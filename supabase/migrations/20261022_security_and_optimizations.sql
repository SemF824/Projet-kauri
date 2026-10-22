-- ==============================================================================
-- KAURI SECURITY & TRANSACTIONS CONSOLIDATION MIGRATION
-- À exécuter dans le Supabase SQL Editor de votre projet Cloud
-- ==============================================================================

-- 1. 🛡️ SÉCURISATION DE LA TABLE WALLETS (Restriction de l'UPDATE client)
-- Les utilisateurs ne doivent PAS pouvoir modifier directement leur solde.
-- Seules les fonctions SECURITY DEFINER ou le rôle de service peuvent altérer les soldes.
DROP POLICY IF EXISTS "Les utilisateurs mettent a jour leur propre wallet" ON public.wallets;

-- On conserve uniquement la lecture sécurisée de son propre portefeuille :
DROP POLICY IF EXISTS "Les utilisateurs lisent leur propre wallet" ON public.wallets;
CREATE POLICY "Les utilisateurs lisent leur propre wallet"
  ON public.wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Autoriser la création initiale du wallet à 0 :
DROP POLICY IF EXISTS "Les utilisateurs peuvent creer leur propre wallet" ON public.wallets;
CREATE POLICY "Les utilisateurs peuvent creer leur propre wallet"
  ON public.wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND 
    balance_eur = 0.00 AND 
    balance_xof = 0.00 AND 
    balance_usdt = 0.00
  );


-- 2. ⚡ PROCÉDURE ATOMIQUE DE VIREMENT (P2P WALLET TRANSFER)
-- Débite l'expéditeur, crédite le destinataire et enregistre les transactions
-- avec isolation ACID complète et protection contre les soldes négatifs.
CREATE OR REPLACE FUNCTION public.process_wallet_transfer(
  p_recipient_identifier text,
  p_amount numeric,
  p_description text default 'Virement bancaire KAURI',
  p_pin text default null
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_sender_id uuid := auth.uid();
  v_recipient_id uuid;
  v_sender_wallet wallets%ROWTYPE;
  v_clean_recipient text;
BEGIN
  -- Vérifier l'authentification
  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  -- Vérifier la validité du montant
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Le montant doit être strictement supérieur à zéro';
  END IF;

  -- Verrouillage de la ligne du portefeuille expéditeur pour éviter toute race condition
  SELECT * INTO v_sender_wallet
  FROM public.wallets
  WHERE user_id = v_sender_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Portefeuille expéditeur introuvable';
  END IF;

  -- Vérifier le solde
  IF v_sender_wallet.balance_eur < p_amount THEN
    RAISE EXCEPTION 'Solde insuffisant';
  END IF;

  -- Identifier le destinataire (soit par UUID, soit par téléphone, soit par nom)
  v_clean_recipient := regexp_replace(p_recipient_identifier, '[\s\-\(\)]', '', 'g');

  SELECT id INTO v_recipient_id
  FROM public.profiles
  WHERE id::text = p_recipient_identifier
     OR regexp_replace(phone_number, '[\s\-\(\)]', '', 'g') = v_clean_recipient
     OR lower(full_name) = lower(p_recipient_identifier)
  LIMIT 1;

  -- 1. Débiter l'expéditeur
  UPDATE public.wallets
  SET balance_eur = balance_eur - p_amount,
      updated_at = now()
  WHERE user_id = v_sender_id;

  -- 2. Enregistrer la transaction de débit
  INSERT INTO public.transactions (
    user_id,
    amount,
    currency,
    type,
    description,
    status
  ) VALUES (
    v_sender_id,
    p_amount,
    'EUR',
    'transfer',
    COALESCE(p_description, 'Virement vers ' || p_recipient_identifier),
    'completed'
  );

  -- 3. Créditer le destinataire s'il existe dans la base
  IF v_recipient_id IS NOT NULL THEN
    -- Mettre à jour son portefeuille
    UPDATE public.wallets
    SET balance_eur = balance_eur + p_amount,
        updated_at = now()
    WHERE user_id = v_recipient_id;

    -- Enregistrer la transaction de crédit
    INSERT INTO public.transactions (
      user_id,
      amount,
      currency,
      type,
      description,
      status
    ) VALUES (
      v_recipient_id,
      p_amount,
      'EUR',
      'transfer',
      'Virement reçu de ' || (SELECT COALESCE(full_name, phone_number, 'Membre KAURI') FROM public.profiles WHERE id = v_sender_id),
      'completed'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'amount', p_amount,
    'new_balance', v_sender_wallet.balance_eur - p_amount
  );
END;
$$;


-- 3. ⚡ PROCÉDURE ATOMIQUE D'INVESTISSEMENT RWA CROWDFUNDING
CREATE OR REPLACE FUNCTION public.invest_in_rwa_project(
  p_project_name text,
  p_sector_id text,
  p_sub_sector text,
  p_amount numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_user_wallet wallets%ROWTYPE;
  v_investment_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Le montant doit être supérieur à zéro';
  END IF;

  -- Verrouillage de sécurité
  SELECT * INTO v_user_wallet
  FROM public.wallets
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Portefeuille introuvable';
  END IF;

  IF v_user_wallet.balance_eur < p_amount THEN
    RAISE EXCEPTION 'Solde insuffisant pour réaliser cet investissement';
  END IF;

  -- 1. Débiter le wallet
  UPDATE public.wallets
  SET balance_eur = balance_eur - p_amount,
      updated_at = now()
  WHERE user_id = v_user_id;

  -- 2. Créer l'enregistrement de l'investissement RWA
  INSERT INTO public.rwa_investments (
    user_id,
    name,
    sector_id,
    sub_sector,
    amount,
    status
  ) VALUES (
    v_user_id,
    p_project_name,
    p_sector_id,
    COALESCE(p_sub_sector, 'RWA Crowdfunding'),
    p_amount,
    'En cours'
  ) RETURNING id INTO v_investment_id;

  -- 3. Enregistrer la transaction financière
  INSERT INTO public.transactions (
    user_id,
    amount,
    currency,
    type,
    description,
    status
  ) VALUES (
    v_user_id,
    p_amount,
    'EUR',
    'withdrawal',
    'Investissement RWA - ' || p_project_name,
    'completed'
  );

  RETURN jsonb_build_object(
    'success', true,
    'investment_id', v_investment_id,
    'new_balance', v_user_wallet.balance_eur - p_amount
  );
END;
$$;


-- 4. 🛡️ VERROUILLAGE STRICT DES RLS SUR LES RAPPORTS DE MODÉRATION
ALTER TABLE public.moderation_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Seuls les admins voient les signalements" ON public.moderation_reports;
CREATE POLICY "Seuls les admins voient les signalements"
  ON public.moderation_reports
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (SELECT email FROM auth.users WHERE id = auth.uid()) LIKE '%@kauri.app'
  );

DROP POLICY IF EXISTS "Les utilisateurs peuvent signaler un contenu" ON public.moderation_reports;
CREATE POLICY "Les utilisateurs peuvent signaler un contenu"
  ON public.moderation_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

