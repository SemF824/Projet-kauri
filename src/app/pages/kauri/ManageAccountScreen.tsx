import {
  ArrowLeft,
  CreditCard,
  Shield,
  Bell,
  Smartphone,
  Lock,
  Eye,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

interface PaymentCard {
  id: string;
  type: string;
  last4: string;
  expires: string;
  brand: string;
}

export function ManageAccountScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user, profile, refreshProfile } = useAuth();
  const supabase = getSupabase();

  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);

  // Formulaire d'ajout de carte
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isSavingCard, setIsSavingCard] = useState(false);

  // Formulaire de modification de code PIN
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);

  // Charger les cartes enregistrées depuis les préférences du profil Supabase
  useEffect(() => {
    if (!profile) return;
    try {
      // Extraction des cartes depuis le champ preferences
      const savedCardPref = profile.preferences?.find((p: string) => p.startsWith("cards_json:"));
      if (savedCardPref) {
        const jsonStr = savedCardPref.replace("cards_json:", "");
        setCards(JSON.parse(jsonStr));
      } else {
        // Carte virtuelle Kauree par défaut rattachée au compte
        const defaultCard: PaymentCard = {
          id: "kauri-virtuelle",
          type: "Virtuelle KAUREE",
          last4: profile.id ? profile.id.slice(-4).toUpperCase() : "9820",
          expires: "12/28",
          brand: "Mastercard",
        };
        setCards([defaultCard]);
      }
    } catch (e) {
      console.error("Erreur chargement cartes:", e);
    }
  }, [profile]);

  // Sauvegarder les cartes dans Supabase
  const persistCards = async (updatedCards: PaymentCard[]) => {
    if (!user) return;
    try {
      const currentPrefs = (profile?.preferences || []).filter((p: string) => !p.startsWith("cards_json:"));
      const newPrefs = [...currentPrefs, `cards_json:${JSON.stringify(updatedCards)}`];

      const { error } = await supabase
        .from("profiles")
        .update({ preferences: newPrefs, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;
      setCards(updatedCards);
      await refreshProfile();
    } catch (err: any) {
      console.error("Erreur sauvegarde carte:", err);
      toast.error("Impossible de sauvegarder la carte en base de données.");
    }
  };

  const handleAddCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s+/g, "");
    if (cleanNum.length < 16) {
      toast.error("Numéro de carte incomplet (16 chiffres requis).");
      return;
    }
    if (!cardExpiry.includes("/") || cardExpiry.length < 5) {
      toast.error("Format de date invalide (MM/AA).");
      return;
    }

    setIsSavingCard(true);
    try {
      const newCard: PaymentCard = {
        id: crypto.randomUUID(),
        type: "Physique",
        last4: cleanNum.slice(-4),
        expires: cardExpiry,
        brand: cleanNum.startsWith("4") ? "Visa" : "Mastercard",
      };

      const updated = [...cards, newCard];
      await persistCards(updated);
      toast.success("Carte enregistrée avec succès !");
      setShowAddCard(false);
      setCardNumber("");
      setCardExpiry("");
      setCardHolder("");
      setCardCvv("");
    } finally {
      setIsSavingCard(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const updated = cards.filter((c) => c.id !== cardId);
    await persistCards(updated);
    toast.success("Carte supprimée.");
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast.error("Le code PIN doit comporter exactement 4 chiffres.");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("Les codes PIN ne correspondent pas.");
      return;
    }

    setIsUpdatingPin(true);
    try {
      // Mise à jour sécurisée du mot de passe associé au PIN dans Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: `${newPin}_kauri`,
      });

      if (error) throw error;
      toast.success("Votre code PIN a été mis à jour avec succès !");
      setShowChangePin(false);
      setNewPin("");
      setConfirmPin("");
    } catch (err: any) {
      console.error("Erreur mise à jour PIN:", err);
      toast.error(err.message || "Échec de la mise à jour du code PIN.");
    } finally {
      setIsUpdatingPin(false);
    }
  };

  return (
    <div
      className={`min-h-screen pb-24 transition-colors ${
        isDarkMode ? "bg-[#0F172A]" : "bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]"
      }`}
    >
      <div
        className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${
          isDarkMode
            ? "bg-gradient-to-br from-[#1E293B] to-[#334155]"
            : "bg-gradient-to-br from-[#006D77] to-[#0D9488]"
        }`}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-1 font-bold">Gérer mon compte</h1>
        <p className="text-white/80 text-sm">Cartes, sécurité & préférences</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* ── SECTION CARTES ── */}
        <div>
          <h3 className={`mb-4 font-semibold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>
            Moyens de paiement & Cartes
          </h3>
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl p-5 shadow-md border ${
                  isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>
                        {card.type}
                      </p>
                      <p className={`text-sm ${isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        •••• •••• •••• {card.last4}
                      </p>
                    </div>
                  </div>
                  {cards.length > 1 && (
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
                    Expire : {card.expires}
                  </p>
                  <span className="px-3 py-1 bg-[#D1FAE5] text-[#006D77] text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowAddCard(true)}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl shadow-lg font-semibold flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter une carte bancaire</span>
            </button>
          </div>
        </div>

        {/* ── SECTION SÉCURITÉ ── */}
        <div>
          <h3 className={`mb-4 font-semibold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>
            Sécurité du compte
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowChangePin(true)}
              className={`w-full rounded-xl p-4 flex items-center justify-between border cursor-pointer ${
                isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#006D77]/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#006D77]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>
                    Code PIN de sécurité
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Modifier votre code de confirmation
                  </p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"} />
            </button>

            <button
              onClick={() => navigate("/kauri/biometric-setup")}
              className={`w-full rounded-xl p-4 flex items-center justify-between border cursor-pointer ${
                isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>
                    Biométrie
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Configurer Touch ID / Face ID
                  </p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"} />
            </button>

            <button
              onClick={() => navigate("/kauri/setup-2fa")}
              className={`w-full rounded-xl p-4 flex items-center justify-between border cursor-pointer ${
                isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>
                    Authentification 2FA
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Gérer la double authentification
                  </p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"} />
            </button>
          </div>
        </div>

        {/* ── SECTION PRÉFÉRENCES ── */}
        <div>
          <h3 className={`mb-4 font-semibold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>
            Préférences & Confidentialité
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/kauri/notifications")}
              className={`w-full rounded-xl p-4 flex items-center justify-between border cursor-pointer ${
                isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>
                    Notifications & Alertes
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Consulter vos notifications
                  </p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"} />
            </button>

            <button
              onClick={() => navigate("/kauri/preferences-contenu")}
              className={`w-full rounded-xl p-4 flex items-center justify-between border cursor-pointer ${
                isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#B05B3B]/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#B05B3B]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>
                    Centres d'intérêt & Thèmes
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Personnaliser vos préférences de contenu
                  </p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL : AJOUTER UNE CARTE ── */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 ${
              isDarkMode ? "bg-[#1E293B] text-white" : "bg-white text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Enregistrer une carte</h3>
              <button
                onClick={() => setShowAddCard(false)}
                className="p-1 rounded-full border-none bg-transparent cursor-pointer text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Titulaire de la carte</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean Dupont"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm ${
                    isDarkMode ? "bg-[#0F172A] border-[#334155]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Numéro de carte</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="4532 •••• •••• ••••"
                  value={cardNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                    setCardNumber(v.replace(/(\d{4})/g, "$1 ").trim());
                  }}
                  className={`w-full p-3 rounded-xl border text-sm font-mono ${
                    isDarkMode ? "bg-[#0F172A] border-[#334155]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Date d'expiration</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                      setCardExpiry(v);
                    }}
                    className={`w-full p-3 rounded-xl border text-sm ${
                      isDarkMode ? "bg-[#0F172A] border-[#334155]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Code CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    className={`w-full p-3 rounded-xl border text-sm font-mono ${
                      isDarkMode ? "bg-[#0F172A] border-[#334155]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 py-3.5 rounded-xl border border-gray-300 bg-transparent text-sm font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingCard}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white text-sm font-bold border-none shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingCard ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL : MODIFIER LE CODE PIN ── */}
      {showChangePin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 ${
              isDarkMode ? "bg-[#1E293B] text-white" : "bg-white text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Modifier mon code PIN</h3>
              <button
                onClick={() => setShowChangePin(false)}
                className="p-1 rounded-full border-none bg-transparent cursor-pointer text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Nouveau code PIN (4 chiffres)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  className={`w-full p-3 rounded-xl border text-center text-2xl tracking-widest font-mono ${
                    isDarkMode ? "bg-[#0F172A] border-[#334155]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Confirmer le code PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  className={`w-full p-3 rounded-xl border text-center text-2xl tracking-widest font-mono ${
                    isDarkMode ? "bg-[#0F172A] border-[#334155]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowChangePin(false)}
                  className="flex-1 py-3.5 rounded-xl border border-gray-300 bg-transparent text-sm font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPin}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white text-sm font-bold border-none shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingPin ? "Modification..." : "Valider le PIN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
