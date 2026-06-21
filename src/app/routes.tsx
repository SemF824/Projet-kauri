import { createBrowserRouter, Navigate } from 'react-router';
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
import { PortefeuilleScreen } from './pages/kauri/PortefeuilleScreen';
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
    ],
  },
  {
    path: '*',
    element: <Navigate to="/kauri/login" replace />,
  },
]);