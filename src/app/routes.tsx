import { createBrowserRouter, Navigate, Outlet, useNavigate, useLocation } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OnboardingWrapper } from './components/OnboardingWrapper';
import { DashboardScreen } from './components/lyann/DashboardScreen';
import { TontineDetailScreen } from './components/lyann/TontineDetailScreen';
import { InvestmentMarketplaceScreen } from './components/lyann/InvestmentMarketplaceScreen';
import { FeedScreen } from './components/lyann/FeedScreen';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { WalletPage } from './pages/WalletPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TontineListPage } from './pages/TontineListPage';
import { GlobalWalletScreen } from './pages/GlobalWalletScreen';
import { BlockchainTontineScreen } from './pages/BlockchainTontineScreen';
import { SwapMarketplaceScreen } from './pages/SwapMarketplaceScreen';
import { InvestorAcademyScreen } from './pages/InvestorAcademyScreen';
import { ProjectCrowdfundingScreen } from './pages/ProjectCrowdfundingScreen';
import { AccountTypeSelectionScreen } from './pages/kauri/AccountTypeSelectionScreen';
import { KYCVerificationScreen } from './pages/kauri/KYCVerificationScreen';
import { BiometricSetupScreen } from './pages/kauri/BiometricSetupScreen';
import { ProBusinessVerificationScreen } from './pages/kauri/ProBusinessVerificationScreen';
import { WalletCreationScreen } from './pages/kauri/WalletCreationScreen';
import { NormalDashboardScreen } from './pages/kauri/NormalDashboardScreen';
import { ProDashboardScreen } from './pages/kauri/ProDashboardScreen';
import { SocialFeedScreen } from './pages/kauri/SocialFeedScreen';
import { CommunityMatchingScreen } from './pages/kauri/CommunityMatchingScreen';
import { PotCommunScreen } from './pages/kauri/PotCommunScreen';
import { ProProjectFormScreen } from './pages/kauri/ProProjectFormScreen';
import { SuspendedAccountScreen } from './pages/kauri/SuspendedAccountScreen';
import { MultiSignatureValidationScreen } from './pages/kauri/MultiSignatureValidationScreen';
import { AnimatedIconsDemoScreen } from './pages/kauri/AnimatedIconsDemoScreen';
import { TrustScoreIntroScreen } from './pages/kauri/TrustScoreIntroScreen';
import { SmartContractExplorerScreen } from './pages/kauri/SmartContractExplorerScreen';
import { MediationSystemScreen } from './pages/kauri/MediationSystemScreen';
import { DesignSystemDemo } from './pages/kauri/DesignSystemDemo';
import { KauriLoginScreen } from './pages/kauri/KauriLoginScreen';
import { SplashScreen } from './pages/kauri/SplashScreen';
import { NotificationsScreen } from './pages/kauri/NotificationsScreen';
import { ProNotificationsScreen } from './pages/kauri/ProNotificationsScreen';
import { ManageAccountScreen } from './pages/kauri/ManageAccountScreen';
import { ProManageAccountScreen } from './pages/kauri/ProManageAccountScreen';
import { SendMoneyScreen } from './pages/kauri/SendMoneyScreen';
import { TontinesActivesScreen } from './pages/kauri/TontinesActivesScreen';
import { MesInvestissementsScreen } from './pages/kauri/MesInvestissementsScreen';
import { HistoriqueSwapsScreen } from './pages/kauri/HistoriqueSwapsScreen';
import { EmergencySwapScreen } from './pages/kauri/EmergencySwapScreen';
import { ProfilParticulierScreen } from './pages/kauri/ProfilParticulierScreen';
import { ProfilProScreen } from './pages/kauri/ProfilProScreen';
import { ViralFeedScreen } from './pages/kauri/ViralFeedScreen';
import { RencontresCommunautairesScreen } from './pages/kauri/RencontresCommunautairesScreen';
import { CommunityChatScreen } from './pages/kauri/CommunityChatScreen';
import { SocialHubScreen } from './pages/kauri/SocialHubScreen';
import { SocialHubGateway } from './pages/kauri/SocialHubGateway';
import { DiscoverCirclesScreen } from './pages/kauri/DiscoverCirclesScreen';
import { InvestmentHubScreen } from './pages/kauri/InvestmentHubScreen';
import { PremiumPaywallScreen } from './pages/kauri/PremiumPaywallScreen';
import ForumsScreen from './pages/kauri/social-hub/ForumsScreen';
import DecouverteScreen from './pages/kauri/social-hub/DecouverteScreen';
import RencontresScreen from './pages/kauri/social-hub/RencontresScreen';
import SalonChatScreen from './pages/kauri/social-hub/SalonChatScreen';
import PrivateConversationScreen from './pages/kauri/social-hub/PrivateConversationScreen';
import ForumsMenuScreen from './pages/kauri/social-hub/ForumsMenuScreen';
import CreerSalonScreen from './pages/kauri/social-hub/CreerSalonScreen';
import DecouvrirSalonsScreen from './pages/kauri/social-hub/DecouvrirSalonsScreen';
import SauvegardesScreen from './pages/kauri/social-hub/SauvegardesScreen';
import PreferencesDiscussionScreen from './pages/kauri/social-hub/PreferencesDiscussionScreen';
import SignalerAbusSalonScreen from './pages/kauri/social-hub/SignalerAbusSalonScreen';
import AideSupportScreen from './pages/kauri/social-hub/AideSupportScreen';
import CreateurProfileScreen from './pages/kauri/social-hub/CreateurProfileScreen';
import SocialProfilSetupScreen from './pages/kauri/social-hub/SocialProfilSetupScreen';
import CreerGroupePriveScreen from './pages/kauri/social-hub/CreerGroupePriveScreen';
import GroupManagementScreen from './pages/kauri/social-hub/GroupManagementScreen';
import SalonManagementScreen from './pages/kauri/social-hub/SalonManagementScreen';
import { PortefeuilleScreen } from './pages/kauri/PortefeuilleScreen';
import { ProPortefeuilleScreen } from './pages/kauri/ProPortefeuilleScreen';
import { ProLevesScreen } from './pages/kauri/ProLevesScreen';
import { ProInvestisseursScreen } from './pages/kauri/ProInvestisseursScreen';
import { ProProjetsScreen } from './pages/kauri/ProProjetsScreen';
import { ProPublishScreen } from './pages/kauri/ProPublishScreen';
import { ProPublicationStatsScreen } from './pages/kauri/ProPublicationStatsScreen';
import { TontinesPortefeuilleScreen } from './pages/kauri/TontinesPortefeuilleScreen';
import { InvestissementsPortefeuilleScreen } from './pages/kauri/InvestissementsPortefeuilleScreen';
import { MesTontinesScreen } from './pages/kauri/MesTontinesScreen';
import { CreerTontinePriveeScreen } from './pages/kauri/CreerTontinePriveeScreen';
import { CreerTontinePubliqueScreen } from './pages/kauri/CreerTontinePubliqueScreen';
import { ProjetsImpactsScreen } from './pages/kauri/ProjetsImpactsScreen';
import { InvestissementScreen } from './pages/kauri/InvestissementScreen';
import { ProjetDetailScreen } from './pages/kauri/ProjetDetailScreen';
import { PreferencesContentScreen } from './pages/kauri/PreferencesContentScreen';
import { ContentSauvegardesScreen } from './pages/kauri/ContentSauvegardesScreen';
import { TransferConfirmScreen } from './pages/kauri/TransferConfirmScreen';
import { RejoindreTontineScreen } from './pages/kauri/RejoindreTontineScreen';
import { TransferSuccessScreen } from './pages/kauri/TransferSuccessScreen';
import { CoffreNumeriqueScreen } from './pages/kauri/CoffreNumeriqueScreen';
import { ConfirmationDonScreen } from './pages/kauri/ConfirmationDonScreen';
import { ConfirmationInvestissementScreen } from './pages/kauri/ConfirmationInvestissementScreen';
import { ContributionSuccessScreen } from './pages/kauri/ContributionSuccessScreen';
import { CercleDetailScreen } from './pages/kauri/CercleDetailScreen';
import { RejoindreCircleScreen } from './pages/kauri/RejoindreCircleScreen';
import { CircleJoinSuccessScreen } from './pages/kauri/CircleJoinSuccessScreen';
import { ProCreerTontineScreen } from './pages/kauri/ProCreerTontineScreen';
import { BadgesScreen } from './pages/kauri/BadgesScreen';
import { Setup2FAScreen } from './pages/kauri/Setup2FAScreen';
import { KYCAdminDashboardScreen } from './pages/kauri/admin/KYCAdminDashboardScreen';
import { useAuth } from './contexts/AuthContext';
import { Lock, ShieldAlert, ArrowRight, User as UserIcon } from 'lucide-react';

// ── 🎯 ECOUTEUR ET BARRIÈRE DE PROTECTION FINANCIÈRE GLOBAL ──
function KauriKYCGuardLayout() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  const currentKycStatus = profile?.kyc_status || profile?.kycStatus || 'pending';
  const isKycVerified = currentKycStatus === 'verified' || profile?.kyc_completed === true || profile?.kycCompleted === true;
  const isKycRejected = currentKycStatus === 'rejected';

  // Exclusion stricte : Les écrans d'authentification, de dépôt de pièces et les profils restent ouverts
  const isPageExcluded = 
    location.pathname.includes('/kauri/login') || 
    location.pathname.includes('/kauri/kyc-verification') || 
    location.pathname.includes('/kauri/biometric-setup') || 
    location.pathname.includes('/kauri/profil-particulier') || 
    location.pathname.includes('/kauri/profil-pro') ||
    location.pathname === '/splash' ||
    location.pathname === '/kauri';

  if (!isKycVerified && !isPageExcluded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 text-center space-y-5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg ${isKycRejected ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
            {isKycRejected ? <ShieldAlert className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
          </div>

          <div className="space-y-2">
            <h2 className="text-[#0F172A] text-xl font-extrabold tracking-tight">
              {isKycRejected ? 'Dossier de conformité rejeté' : 'Compte en cours de validation'}
            </h2>
            <p className="text-[#475569] text-xs leading-relaxed px-2">
              {isKycRejected 
                ? "Vos pièces justificatives n'ont pas pu être validées par notre équipe de conformité. Veuillez soumettre à nouveau vos documents réglementaires."
                : "Bonjour ! Vos pièces justificatives ont été transmises avec succès au registre central de KAURI. Votre dossier est en cours d'analyse."}
            </p>
          </div>

          {!isKycRejected && (
            <div className="bg-[#E6F4F5] border border-[#006D77]/10 rounded-2xl p-4">
              <p className="text-[#006D77] text-xs font-semibold leading-relaxed text-center">
                ⏳ Activation de vos accès financiers sous 24 heures maximum.
              </p>
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-4 text-left text-[11px] text-slate-500 leading-normal space-y-1.5 border border-slate-100">
            <p className="font-bold text-slate-700">Fonctionnalités gelées temporairement :</p>
            <p>• Création, adhésion et paiement de Tontines</p>
            <p>• Dépôts, retraits et transferts de capitaux</p>
            <p>• Souscription aux levées de fonds</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate(profile?.accountType === 'professionnel' || profile?.account_type === 'professionnel' ? '/kauri/profil-pro' : '/kauri/profil-particulier')}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" /> Profil
            </button>
            <button
              onClick={() => navigate('/kauri/kyc-verification')}
              className={`flex-1 py-3 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer border-none flex items-center justify-center gap-1.5 ${isKycRejected ? 'bg-red-500 hover:bg-red-600' : 'bg-[#006D77] hover:bg-[#00525a]'}`}
            >
              <span>{isKycRejected ? 'Réessayer' : 'Mes pièces'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    index: true,
    element: <Navigate to="/splash" replace />,
  },
  {
    path: '/splash',
    element: <SplashScreen />,
  },
  {
    path: '/onboarding',
    element: <OnboardingWrapper />,
  },
  {
    element: <KauriKYCGuardLayout />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardScreen />,
          },
          {
            path: 'tontines',
            element: <TontineListPage />,
          },
          {
            path: 'tontines/:id',
            element: <TontineDetailScreen />,
          },
          {
            path: 'investments',
            element: <InvestmentMarketplaceScreen />,
          },
          {
            path: 'investments/:id',
            element: <ProjectDetailPage />,
          },
          {
            path: 'feed',
            element: <FeedScreen />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
          },
          {
            path: 'wallet',
            element: <WalletPage />,
          },
          {
            path: 'global-wallet',
            element: <GlobalWalletScreen />,
          },
          {
            path: 'blockchain-tontine/:id',
            element: <BlockchainTontineScreen />,
          },
          {
            path: 'swap-marketplace',
            element: <SwapMarketplaceScreen />,
          },
          {
            path: 'investor-academy',
            element: <InvestorAcademyScreen />,
          },
          {
            path: 'project-crowdfunding/:id',
            element: <ProjectCrowdfundingScreen />,
          },
        ],
      },
      {
        path: '/kauri',
        children: [
          {
            index: true,
            element: <AccountTypeSelectionScreen />,
          },
          {
            path: 'kyc-verification',
            element: <KYCVerificationScreen />,
          },
          {
            path: 'biometric-setup',
            element: <BiometricSetupScreen />,
          },
          {
            path: 'pro-verification',
            element: <ProBusinessVerificationScreen />,
          },
          {
            path: 'wallet-creation',
            element: <WalletCreationScreen />,
          },
          {
            path: 'normal-dashboard',
            element: <NormalDashboardScreen />,
          },
          {
            path: 'pro-dashboard',
            element: <ProDashboardScreen />,
          },
          {
            path: 'social-feed',
            element: <SocialFeedScreen />,
          },
          {
            path: 'community-matching',
            element: <CommunityMatchingScreen />,
          },
          {
            path: 'pot-commun',
            element: <PotCommunScreen />,
          },
          {
            path: 'pro-project-form',
            element: <ProProjectFormScreen />,
          },
          {
            path: 'pro-publish',
            element: <ProPublishScreen />,
          },
          {
            path: 'pro-publication-stats',
            element: <ProPublicationStatsScreen />,
          },
          {
            path: 'suspended',
            element: <SuspendedAccountScreen />,
          },
          {
            path: 'multi-signature',
            element: <MultiSignatureValidationScreen />,
          },
          {
            path: 'animated-icons',
            element: <AnimatedIconsDemoScreen />,
          },
          {
            path: 'trust-score-intro',
            element: <TrustScoreIntroScreen />,
          },
          {
            path: 'preferences-contenu',
            element: <PreferencesContentScreen />,
          },
          {
            path: 'smart-contract-explorer',
            element: <SmartContractExplorerScreen />,
          },
          {
            path: 'mediation-system',
            element: <MediationSystemScreen />,
          },
          {
            path: 'design-system',
            element: <DesignSystemDemo />,
          },
          {
            path: 'login',
            element: <KauriLoginScreen />,
          },
          {
            path: 'notifications',
            element: <NotificationsScreen />,
          },
          {
            path: 'pro-notifications',
            element: <ProNotificationsScreen />,
          },
          {
            path: 'manage-account',
            element: <ManageAccountScreen />,
          },
          {
            path: 'pro-manage-account',
            element: <ProManageAccountScreen />,
          },
          {
            path: 'send-money',
            element: <SendMoneyScreen />,
          },
          {
            path: 'rejoindre-tontine',
            element: <RejoindreTontineScreen />,
          },
          {
            path: 'transfer-confirm',
            element: <TransferConfirmScreen />,
          },
          {
            path: 'transfer-success',
            element: <TransferSuccessScreen />,
          },
          {
            path: 'tontines-actives',
            element: <TontinesActivesScreen />,
          },
          {
            path: 'mes-tontines',
            element: <MesTontinesScreen />,
          },
          {
            path: 'creer-tontine-privee',
            element: <CreerTontinePriveeScreen />,
          },
          {
            path: 'creer-tontine-publique',
            element: <CreerTontinePubliqueScreen />,
          },
          {
            path: 'projets-impacts',
            element: <ProjetsImpactsScreen />,
          },
          {
            path: 'investissement',
            element: <InvestissementScreen />,
          },
          {
            path: 'projet-detail',
            element: <ProjetDetailScreen />,
          },
          {
            path: 'mes-investissements',
            element: <MesInvestissementsScreen />,
          },
          {
            path: 'portefeuille',
            element: <PortefeuilleScreen />,
          },
          {
            path: 'pro-portefeuille',
            element: <ProPortefeuilleScreen />,
          },
          {
            path: 'pro-leves',
            element: <ProLevesScreen />,
          },
          {
            path: 'pro-investisseurs',
            element: <ProInvestisseursScreen />,
          },
          {
            path: 'pro-projets',
            element: <ProProjetsScreen />,
          },
          {
            path: 'portefeuille-tontines',
            element: <TontinesPortefeuilleScreen />,
          },
          {
            path: 'portefeuille-investissements',
            element: <InvestissementsPortefeuilleScreen />,
          },
          {
            path: 'historique-swaps',
            element: <HistoriqueSwapsScreen />,
          },
          {
            path: 'emergency-swap',
            element: <EmergencySwapScreen />,
          },
          {
            path: 'profil-particulier',
            element: <ProfilParticulierScreen />,
          },
          {
            path: 'profil-pro',
            element: <ProfilProScreen />,
          },
          {
            path: 'viral-feed',
            element: <ViralFeedScreen />,
          },
          {
            path: 'content-sauvegardes',
            element: <ContentSauvegardesScreen />,
          },
          {
            path: 'rencontres-communautaires',
            element: <RencontresCommunautairesScreen />,
          },
          {
            path: 'community-chat',
            element: <CommunityChatScreen />,
          },
          {
            path: 'social-hub',
            element: <SocialHubScreen />,
          },
          {
            path: 'social-hub-gateway',
            element: <SocialHubGateway />,
          },
          {
            path: 'discover-circles',
            element: <DiscoverCirclesScreen />,
          },
          {
            path: 'investment-hub',
            element: <InvestmentHubScreen />,
          },
          {
            path: 'premium-paywall',
            element: <PremiumPaywallScreen />,
          },
          {
            path: 'coffre-numerique',
            element: <CoffreNumeriqueScreen />,
          },
          {
            path: 'confirmation-don',
            element: <ConfirmationDonScreen />,
          },
          {
            path: 'confirmation-investissement',
            element: <ConfirmationInvestissementScreen />,
          },
          {
            path: 'contribution-success',
            element: <ContributionSuccessScreen />,
          },
          {
            path: 'cercle-detail',
            element: <CercleDetailScreen />,
          },
          {
            path: 'rejoindre-cercle',
            element: <RejoindreCircleScreen />,
          },
          {
            path: 'circle-join-success',
            element: <CircleJoinSuccessScreen />,
          },
          {
            path: 'pro-creer-tontine',
            element: <ProCreerTontineScreen />,
          },
          {
            path: 'badges',
            element: <BadgesScreen />,
          },
          {
            path: 'setup-2fa',
            element: <Setup2FAScreen />,
          },
          {
            path: 'social-hub/decouverte',
            element: <DecouverteScreen />,
          },
          {
            path: 'social-hub/rencontres',
            element: <RencontresScreen />,
          },
          {
            path: 'social-hub/forums',
            element: <ForumsScreen />,
          },
          {
            path: 'social-hub/salon/:id',
            element: <SalonChatScreen />,
          },
          {
            path: 'social-hub/conversation/:id',
            element: <PrivateConversationScreen />,
          },
          {
            path: 'social-hub/forums-menu',
            element: <ForumsMenuScreen />,
          },
          {
            path: 'social-hub/creer-salon',
            element: <CreerSalonScreen />,
          },
          {
            path: 'social-hub/decouvrir-salons',
            element: <DecouvrirSalonsScreen />,
          },
          {
            path: 'social-hub/sauvegardes',
            element: <SauvegardesScreen />,
          },
          {
            path: 'social-hub/preferences-discussion',
            element: <PreferencesDiscussionScreen />,
          },
          {
            path: 'social-hub/signaler-abus',
            element: <SignalerAbusSalonScreen />,
          },
          {
            path: 'social-hub/aide-support',
            element: <AideSupportScreen />,
          },
          {
            path: 'social-hub/createur/:id',
            element: <CreateurProfileScreen />,
          },
          {
            path: 'social-hub/profil-setup',
            element: <SocialProfilSetupScreen />,
          },
          {
            path: 'social-hub/creer-groupe-prive',
            element: <CreerGroupePriveScreen />,
          },
          {
            path: 'social-hub/groupe/:id/gerer',
            element: <GroupManagementScreen />,
          },
          {
            path: 'social-hub/salon/:id/gerer',
            element: <SalonManagementScreen />,
          },
        ],
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/kauri/login" replace />,
  },
  {
    path: "/kauri/admin/kyc",
    element: <KYCAdminDashboardScreen />
  },
]);
