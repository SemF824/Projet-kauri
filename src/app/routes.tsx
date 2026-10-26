import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { AccountTypeGuard } from "./components/AccountTypeGuard";
import { OnboardingWrapper } from "./components/OnboardingWrapper";
import { DashboardScreen } from "./components/lyann/DashboardScreen";
import { TontineDetailScreen } from "./components/lyann/TontineDetailScreen";
import { InvestmentMarketplaceScreen } from "./components/lyann/InvestmentMarketplaceScreen";
import { FeedScreen } from "./components/lyann/FeedScreen";
import { ProfilePage } from "./pages/ProfilePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { WalletPage } from "./pages/WalletPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { TontineListPage } from "./pages/TontineListPage";
import { GlobalWalletScreen } from "./pages/GlobalWalletScreen";
import { BlockchainTontineScreen } from "./pages/BlockchainTontineScreen";
import { SwapMarketplaceScreen } from "./pages/SwapMarketplaceScreen";
import { InvestorAcademyScreen } from "./pages/InvestorAcademyScreen";
import { ProjectCrowdfundingScreen } from "./pages/ProjectCrowdfundingScreen";
import { AccountTypeSelectionScreen } from "./pages/kauri/AccountTypeSelectionScreen";
import { BiometricSetupScreen } from "./pages/kauri/BiometricSetupScreen";
import { ProBusinessVerificationScreen } from "./pages/kauri/ProBusinessVerificationScreen";
import { WalletCreationScreen } from "./pages/kauri/WalletCreationScreen";
import { NormalDashboardScreen } from "./pages/kauri/NormalDashboardScreen";
import { ProDashboardScreen } from "./pages/kauri/ProDashboardScreen";
import { SocialFeedScreen } from "./pages/kauri/SocialFeedScreen";
import { CommunityMatchingScreen } from "./pages/kauri/CommunityMatchingScreen";
import { PotCommunScreen } from "./pages/kauri/PotCommunScreen";
import { ProProjectFormScreen } from "./pages/kauri/ProProjectFormScreen";
import { SuspendedAccountScreen } from "./pages/kauri/SuspendedAccountScreen";
import { MultiSignatureValidationScreen } from "./pages/kauri/MultiSignatureValidationScreen";
import { TrustScoreIntroScreen } from "./pages/kauri/TrustScoreIntroScreen";
import { KauriLoginScreen } from "./pages/kauri/KauriLoginScreen";
import { SplashScreen } from "./pages/kauri/SplashScreen";
import { NotificationsScreen } from "./pages/kauri/NotificationsScreen";
import { ProNotificationsScreen } from "./pages/kauri/ProNotificationsScreen";
import { ManageAccountScreen } from "./pages/kauri/ManageAccountScreen";
import { ProManageAccountScreen } from "./pages/kauri/ProManageAccountScreen";
import { SendMoneyScreen } from "./pages/kauri/SendMoneyScreen";
import { TontinesActivesScreen } from "./pages/kauri/TontinesActivesScreen";
import { MesInvestissementsScreen } from "./pages/kauri/MesInvestissementsScreen";
import { HistoriqueSwapsScreen } from "./pages/kauri/HistoriqueSwapsScreen";
import { EmergencySwapScreen } from "./pages/kauri/EmergencySwapScreen";
import { ProfilParticulierScreen } from "./pages/kauri/ProfilParticulierScreen";
import { ProfilProScreen } from "./pages/kauri/ProfilProScreen";
import { ViralFeedScreen } from "./pages/kauri/ViralFeedScreen";
import { RencontresCommunautairesScreen } from "./pages/kauri/RencontresCommunautairesScreen";
import { CommunityChatScreen } from "./pages/kauri/CommunityChatScreen";
import { SocialHubScreen } from "./pages/kauri/SocialHubScreen";
import { SocialHubGateway } from "./pages/kauri/SocialHubGateway";
import { DiscoverCirclesScreen } from "./pages/kauri/DiscoverCirclesScreen";
import { InvestmentHubScreen } from "./pages/kauri/InvestmentHubScreen";
import { PremiumPaywallScreen } from "./pages/kauri/PremiumPaywallScreen";
import ForumsScreen from "./pages/kauri/social-hub/ForumsScreen";
import DecouverteScreen from "./pages/kauri/social-hub/DecouverteScreen";
import RencontresScreen from "./pages/kauri/social-hub/RencontresScreen";
import SalonChatScreen from "./pages/kauri/social-hub/SalonChatScreen";
import PrivateConversationScreen from "./pages/kauri/social-hub/PrivateConversationScreen";
import ForumsMenuScreen from "./pages/kauri/social-hub/ForumsMenuScreen";
import CreerSalonScreen from "./pages/kauri/social-hub/CreerSalonScreen";
import DecouvrirSalonsScreen from "./pages/kauri/social-hub/DecouvrirSalonsScreen";
import SauvegardesScreen from "./pages/kauri/social-hub/SauvegardesScreen";
import PreferencesDiscussionScreen from "./pages/kauri/social-hub/PreferencesDiscussionScreen";
import SignalerAbusSalonScreen from "./pages/kauri/social-hub/SignalerAbusSalonScreen";
import AideSupportScreen from "./pages/kauri/social-hub/AideSupportScreen";
import CreateurProfileScreen from "./pages/kauri/social-hub/CreateurProfileScreen";
import SocialProfilSetupScreen from "./pages/kauri/social-hub/SocialProfilSetupScreen";
import CreerGroupePriveScreen from "./pages/kauri/social-hub/CreerGroupePriveScreen";
import GroupManagementScreen from "./pages/kauri/social-hub/GroupManagementScreen";
import SalonManagementScreen from "./pages/kauri/social-hub/SalonManagementScreen";
import { PortefeuilleScreen } from "./pages/kauri/PortefeuilleScreen";
import { ProPortefeuilleScreen } from "./pages/kauri/ProPortefeuilleScreen";
import { ProLevesScreen } from "./pages/kauri/ProLevesScreen";
import { ProInvestisseursScreen } from "./pages/kauri/ProInvestisseursScreen";
import { ProProjetsScreen } from "./pages/kauri/ProProjetsScreen";
import { ProPublishScreen } from "./pages/kauri/ProPublishScreen";
import { ProPublicationStatsScreen } from "./pages/kauri/ProPublicationStatsScreen";
import { TontinesPortefeuilleScreen } from "./pages/kauri/TontinesPortefeuilleScreen";
import { InvestissementsPortefeuilleScreen } from "./pages/kauri/InvestissementsPortefeuilleScreen";
import { MesTontinesScreen } from "./pages/kauri/MesTontinesScreen";
import { CreerTontinePriveeScreen } from "./pages/kauri/CreerTontinePriveeScreen";
import { CreerTontinePubliqueScreen } from "./pages/kauri/CreerTontinePubliqueScreen";
import { ProjetsImpactsScreen } from "./pages/kauri/ProjetsImpactsScreen";
import { InvestissementScreen } from "./pages/kauri/InvestissementScreen";
import { ProjetDetailScreen } from "./pages/kauri/ProjetDetailScreen";
import { PreferencesContentScreen } from "./pages/kauri/PreferencesContentScreen";
import { ContentSauvegardesScreen } from "./pages/kauri/ContentSauvegardesScreen";
import { TransferConfirmScreen } from "./pages/kauri/TransferConfirmScreen";
import { RejoindreTontineScreen } from "./pages/kauri/RejoindreTontineScreen";
import { TransferSuccessScreen } from "./pages/kauri/TransferSuccessScreen";
import { CoffreNumeriqueScreen } from "./pages/kauri/CoffreNumeriqueScreen";
import { ConfirmationDonScreen } from "./pages/kauri/ConfirmationDonScreen";
import { ConfirmationInvestissementScreen } from "./pages/kauri/ConfirmationInvestissementScreen";
import { ContributionSuccessScreen } from "./pages/kauri/ContributionSuccessScreen";
import { CercleDetailScreen } from "./pages/kauri/CercleDetailScreen";
import { RejoindreCircleScreen } from "./pages/kauri/RejoindreCircleScreen";
import { CircleJoinSuccessScreen } from "./pages/kauri/CircleJoinSuccessScreen";
import { ProCreerTontineScreen } from "./pages/kauri/ProCreerTontineScreen";
import { BadgesScreen } from "./pages/kauri/BadgesScreen";
import { useAuth } from "./contexts/AuthContext";
import { useInactivitySecurityTimeout } from "./hooks/useInactivitySecurityTimeout";
import { Lock, ShieldAlert, ArrowRight, User as UserIcon } from "lucide-react";

// ── ⚡ COMPOSANTS CHARGÉS EN LAZY-LOADING POUR ALLÉGER LE BUNDLE INITIAL ──
const KYCVerificationScreen = lazy(() => import("./pages/kauri/KYCVerificationScreen").then(m => ({ default: m.KYCVerificationScreen })));
const Setup2FAScreen = lazy(() => import("./pages/kauri/Setup2FAScreen").then(m => ({ default: m.Setup2FAScreen })));
const AnimatedIconsDemoScreen = lazy(() => import("./pages/kauri/AnimatedIconsDemoScreen").then(m => ({ default: m.AnimatedIconsDemoScreen })));
const SmartContractExplorerScreen = lazy(() => import("./pages/kauri/SmartContractExplorerScreen").then(m => ({ default: m.SmartContractExplorerScreen })));
const MediationSystemScreen = lazy(() => import("./pages/kauri/MediationSystemScreen").then(m => ({ default: m.MediationSystemScreen })));
const DesignSystemDemo = lazy(() => import("./pages/kauri/DesignSystemDemo").then(m => ({ default: m.DesignSystemDemo })));
const KYCAdminDashboardScreen = lazy(() => import("./pages/kauri/admin/KYCAdminDashboardScreen").then(m => ({ default: m.KYCAdminDashboardScreen })));
const ModerationAdminDashboard = lazy(() => import("./pages/kauri/admin/ModerationAdminDashboard"));

function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-[#0a5c7a] animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

// ── 🎯 ECOUTEUR ET BARRIÈRE DE PROTECTION FINANCIÈRE GLOBAL ──
function KauriKYCGuardLayout() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verrouillage proactif contre le vol d'appareil ou l'inactivité prolongée
  useInactivitySecurityTimeout();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ProtectedRoute intercepte et redirige vers /kauri/login
  if (!profile) {
    return <Outlet />;
  }

  const isKycVerified = profile?.kycCompleted === true;
  const isKycRejected = false;

  // Exclusion stricte : Les écrans d'authentification, de dépôt de pièces et les profils restent ouverts
  const isPageExcluded =
    location.pathname.includes("/kauri/login") ||
    location.pathname.includes("/kauri/kyc-verification") ||
    location.pathname.includes("/kauri/biometric-setup") ||
    location.pathname.includes("/kauri/profil-particulier") ||
    location.pathname.includes("/kauri/profil-pro") ||
    location.pathname === "/splash" ||
    location.pathname === "/kauri";

  if (!isKycVerified && !isPageExcluded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 text-center space-y-5">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg ${
              isKycRejected ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
            }`}
          >
            {isKycRejected ? (
              <ShieldAlert className="w-7 h-7" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-[#0F172A] text-xl font-extrabold tracking-tight">
              {isKycRejected
                ? "Dossier de conformité rejeté"
                : "Compte en cours de validation"}
            </h2>
            <p className="text-[#475569] text-xs leading-relaxed px-2">
              {isKycRejected
                ? "Vos pièces justificatives n'ont pas pu être validées par notre équipe de conformité. Veuillez soumettre à nouveau vos documents réglementaires."
                : "Bonjour ! Vos pièces justificatives ont été transmises avec succès au registre central de KAUREE. Votre dossier est en cours d'analyse."}
            </p>
          </div>

          {!isKycRejected && (
            <div className="bg-[#E6F4F5] border border-[#0a5c7a]/10 rounded-2xl p-4">
              <p className="text-[#0a5c7a] text-xs font-semibold leading-relaxed text-center">
                ⏳ Activation de vos accès financiers sous 24 heures maximum.
              </p>
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-4 text-left text-[11px] text-slate-500 leading-normal space-y-1.5 border border-slate-100">
            <p className="font-bold text-slate-700">
              Fonctionnalités gelées temporairement :
            </p>
            <p>• Création, adhésion et paiement de Tontines</p>
            <p>• Dépôts, retraits et transferts de capitaux</p>
            <p>• Souscription aux levées de fonds</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() =>
                navigate(
                  profile?.accountType === "professionnel"
                    ? "/kauri/profil-pro"
                    : "/kauri/profil-particulier",
                )
              }
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" /> Profil
            </button>
            <button
              onClick={() => navigate("/kauri/kyc-verification")}
              className={`flex-1 py-3 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer border-none flex items-center justify-center gap-1.5 ${
                isKycRejected ? "bg-red-500 hover:bg-red-600" : "bg-[#0a5c7a] hover:bg-[#00525a]"
              }`}
            >
              <span>{isKycRejected ? "Réessayer" : "Mes pièces"}</span>
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
    path: "/splash",
    element: <SplashScreen />,
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <OnboardingWrapper />
      </ProtectedRoute>
    ),
  },
  {
    element: <KauriKYCGuardLayout />,
    children: [
      {
        path: "/",
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
            path: "dashboard",
            element: <DashboardScreen />,
          },
          {
            path: "tontines",
            element: <TontineListPage />,
          },
          {
            path: "tontines/:id",
            element: <TontineDetailScreen />,
          },
          {
            path: "investments",
            element: <InvestmentMarketplaceScreen />,
          },
          {
            path: "investments/:id",
            element: <ProjectDetailPage />,
          },
          {
            path: "feed",
            element: <FeedScreen />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
          {
            path: "wallet",
            element: <WalletPage />,
          },
          {
            path: "global-wallet",
            element: <GlobalWalletScreen />,
          },
          {
            path: "blockchain-tontine/:id",
            element: <BlockchainTontineScreen />,
          },
          {
            path: "swap-marketplace",
            element: <SwapMarketplaceScreen />,
          },
          {
            path: "investor-academy",
            element: <InvestorAcademyScreen />,
          },
          {
            path: "project-crowdfunding/:id",
            element: <ProjectCrowdfundingScreen />,
          },
        ],
      },
      {
        path: "/kauri",
        children: [
          // ── Pages publiques d'inscription et de connexion ──
          {
            index: true,
            element: <AccountTypeSelectionScreen />,
          },
          {
            path: "login",
            element: <KauriLoginScreen />,
          },

          // ── Parcours Onboarding / KYC / Sécurité (Connecté requis) ──
          {
            path: "kyc-verification",
            element: (
              <ProtectedRoute>
                <LazyRoute>
                  <KYCVerificationScreen />
                </LazyRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: "biometric-setup",
            element: (
              <ProtectedRoute>
                <BiometricSetupScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-verification",
            element: (
              <ProtectedRoute>
                <ProBusinessVerificationScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "wallet-creation",
            element: (
              <ProtectedRoute>
                <WalletCreationScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "setup-2fa",
            element: (
              <ProtectedRoute>
                <LazyRoute>
                  <Setup2FAScreen />
                </LazyRoute>
              </ProtectedRoute>
            ),
          },

          // ── Tableaux de bord protégés par profil ──
          {
            path: "normal-dashboard",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="particulier">
                  <NormalDashboardScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-dashboard",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProDashboardScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },

          // ── Social Hub & Communication ──
          {
            path: "social-feed",
            element: (
              <ProtectedRoute>
                <SocialFeedScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "community-matching",
            element: (
              <ProtectedRoute>
                <CommunityMatchingScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "pot-commun",
            element: (
              <ProtectedRoute>
                <PotCommunScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "viral-feed",
            element: (
              <ProtectedRoute>
                <ViralFeedScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "content-sauvegardes",
            element: (
              <ProtectedRoute>
                <ContentSauvegardesScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "rencontres-communautaires",
            element: (
              <ProtectedRoute>
                <RencontresCommunautairesScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "community-chat",
            element: (
              <ProtectedRoute>
                <CommunityChatScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub",
            element: (
              <ProtectedRoute>
                <SocialHubScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub-gateway",
            element: (
              <ProtectedRoute>
                <SocialHubGateway />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/decouverte",
            element: (
              <ProtectedRoute>
                <DecouverteScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/rencontres",
            element: (
              <ProtectedRoute>
                <RencontresScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/forums",
            element: (
              <ProtectedRoute>
                <ForumsScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/salon/:id",
            element: (
              <ProtectedRoute>
                <SalonChatScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/conversation/:id",
            element: (
              <ProtectedRoute>
                <PrivateConversationScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/forums-menu",
            element: (
              <ProtectedRoute>
                <ForumsMenuScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/creer-salon",
            element: (
              <ProtectedRoute>
                <CreerSalonScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/decouvrir-salons",
            element: (
              <ProtectedRoute>
                <DecouvrirSalonsScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/sauvegardes",
            element: (
              <ProtectedRoute>
                <SauvegardesScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/preferences-discussion",
            element: (
              <ProtectedRoute>
                <PreferencesDiscussionScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/signaler-abus",
            element: (
              <ProtectedRoute>
                <SignalerAbusSalonScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/aide-support",
            element: (
              <ProtectedRoute>
                <AideSupportScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/createur/:id",
            element: (
              <ProtectedRoute>
                <CreateurProfileScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/profil-setup",
            element: (
              <ProtectedRoute>
                <SocialProfilSetupScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/creer-groupe-prive",
            element: (
              <ProtectedRoute>
                <CreerGroupePriveScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/groupe/:id/gerer",
            element: (
              <ProtectedRoute>
                <GroupManagementScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "social-hub/salon/:id/gerer",
            element: (
              <ProtectedRoute>
                <SalonManagementScreen />
              </ProtectedRoute>
            ),
          },

          // ── Cercles & Découverte ──
          {
            path: "discover-circles",
            element: (
              <ProtectedRoute>
                <DiscoverCirclesScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "cercle-detail",
            element: (
              <ProtectedRoute>
                <CercleDetailScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "rejoindre-cercle",
            element: (
              <ProtectedRoute>
                <RejoindreCircleScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "circle-join-success",
            element: (
              <ProtectedRoute>
                <CircleJoinSuccessScreen />
              </ProtectedRoute>
            ),
          },

          // ── Espaces Professionnels Spécifiques ──
          {
            path: "pro-project-form",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProProjectFormScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-publish",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProPublishScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-publication-stats",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProPublicationStatsScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-notifications",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProNotificationsScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-manage-account",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProManageAccountScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-portefeuille",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProPortefeuilleScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-leves",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProLevesScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-investisseurs",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProInvestisseursScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-projets",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProProjetsScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "pro-creer-tontine",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProCreerTontineScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },

          // ── Gestion de Compte & Profils ──
          {
            path: "notifications",
            element: (
              <ProtectedRoute>
                <NotificationsScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "manage-account",
            element: (
              <ProtectedRoute>
                <ManageAccountScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "profil-particulier",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="particulier">
                  <ProfilParticulierScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: "profil-pro",
            element: (
              <ProtectedRoute>
                <AccountTypeGuard allowedType="professionnel">
                  <ProfilProScreen />
                </AccountTypeGuard>
              </ProtectedRoute>
            ),
          },

          // ── Transactions, Portefeuille & Tontines ──
          {
            path: "send-money",
            element: (
              <ProtectedRoute>
                <SendMoneyScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "rejoindre-tontine",
            element: (
              <ProtectedRoute>
                <RejoindreTontineScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "transfer-confirm",
            element: (
              <ProtectedRoute>
                <TransferConfirmScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "transfer-success",
            element: (
              <ProtectedRoute>
                <TransferSuccessScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "tontines-actives",
            element: (
              <ProtectedRoute>
                <TontinesActivesScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "mes-tontines",
            element: (
              <ProtectedRoute>
                <MesTontinesScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "creer-tontine-privee",
            element: (
              <ProtectedRoute>
                <CreerTontinePriveeScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "creer-tontine-publique",
            element: (
              <ProtectedRoute>
                <CreerTontinePubliqueScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "projets-impacts",
            element: (
              <ProtectedRoute>
                <ProjetsImpactsScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "investissement",
            element: (
              <ProtectedRoute>
                <InvestissementScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "projet-detail",
            element: (
              <ProtectedRoute>
                <ProjetDetailScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "mes-investissements",
            element: (
              <ProtectedRoute>
                <MesInvestissementsScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "portefeuille",
            element: (
              <ProtectedRoute>
                <PortefeuilleScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "portefeuille-tontines",
            element: (
              <ProtectedRoute>
                <TontinesPortefeuilleScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "portefeuille-investissements",
            element: (
              <ProtectedRoute>
                <InvestissementsPortefeuilleScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "historique-swaps",
            element: (
              <ProtectedRoute>
                <HistoriqueSwapsScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "emergency-swap",
            element: (
              <ProtectedRoute>
                <EmergencySwapScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "investment-hub",
            element: (
              <ProtectedRoute>
                <InvestmentHubScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "premium-paywall",
            element: (
              <ProtectedRoute>
                <PremiumPaywallScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "coffre-numerique",
            element: (
              <ProtectedRoute>
                <CoffreNumeriqueScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "confirmation-don",
            element: (
              <ProtectedRoute>
                <ConfirmationDonScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "confirmation-investissement",
            element: (
              <ProtectedRoute>
                <ConfirmationInvestissementScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "contribution-success",
            element: (
              <ProtectedRoute>
                <ContributionSuccessScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "badges",
            element: (
              <ProtectedRoute>
                <BadgesScreen />
              </ProtectedRoute>
            ),
          },

          // ── Système & Sécurité ──
          {
            path: "suspended",
            element: (
              <ProtectedRoute>
                <SuspendedAccountScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "multi-signature",
            element: (
              <ProtectedRoute>
                <MultiSignatureValidationScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "animated-icons",
            element: (
              <ProtectedRoute>
                <LazyRoute>
                  <AnimatedIconsDemoScreen />
                </LazyRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: "trust-score-intro",
            element: (
              <ProtectedRoute>
                <TrustScoreIntroScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "preferences-contenu",
            element: (
              <ProtectedRoute>
                <PreferencesContentScreen />
              </ProtectedRoute>
            ),
          },
          {
            path: "smart-contract-explorer",
            element: (
              <ProtectedRoute>
                <LazyRoute>
                  <SmartContractExplorerScreen />
                </LazyRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: "mediation-system",
            element: (
              <ProtectedRoute>
                <LazyRoute>
                  <MediationSystemScreen />
                </LazyRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: "design-system",
            element: (
              <ProtectedRoute>
                <LazyRoute>
                  <DesignSystemDemo />
                </LazyRoute>
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/kauri/admin/kyc",
    element: (
      <AdminRoute>
        <LazyRoute>
          <KYCAdminDashboardScreen />
        </LazyRoute>
      </AdminRoute>
    ),
  },
  {
    path: "/kauri/admin/moderation",
    element: (
      <AdminRoute>
        <LazyRoute>
          <ModerationAdminDashboard />
        </LazyRoute>
      </AdminRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/kauri/login" replace />,
  },
]);