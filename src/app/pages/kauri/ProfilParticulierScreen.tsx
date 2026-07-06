import {
  Shield, CheckCircle2, User, Phone, Mail, MapPin, Edit,
  Award, TrendingUp, Users, ChevronRight, LogOut, Crown,
  Zap, CreditCard, Lock, Smartphone, Bell, Eye,
  Home, Leaf, Wallet, Briefcase, Rocket, ArrowRight, Star, FolderOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';

const TEAL = '#0A847E';
const GOLD = '#D4AF37';

export function ProfilParticulierScreen() {
  const navigate = useNavigate();
  const { isDarkMode, resetDarkMode } = useDarkMode();
  const [activeSpace, setActiveSpace] = useState<'personnel' | 'professionnel'>('personnel');

  const { profile, signOut } = useAuth();
  const trustScore = Math.round((profile?.trustScore ?? 3.5) * (100 / 5));
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'Utilisateur';
  const initials = profile ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase() : 'KA';
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '';

  const handleLogout = async () => {
    resetDarkMode();
    await signOut();
    navigate('/kauri/login');
  };

  const bg     = isDarkMode ? '#0F172A' : '#F8FAFC';
  const card   = isDarkMode ? '#1E293B' : '#ffffff';
  const border = isDarkMode ? '#334155' : '#E8EDF2';
  const textP  = isDarkMode ? '#ffffff' : '#0F172A';
  const textS  = isDarkMode ? '#94A3B8' : '#64748B';
  const inactive = isDarkMode ? '#475569' : '#94A3B8';

  function SettingRow({ icon: Icon, color, bg: ibg, label, sub, onClick }: { icon: any; color: string; bg: string; label: string; sub: string; onClick?: () => void }) {
    return (
      <button onClick={onClick} className="w-full rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: card, border: `1.5px solid ${border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: ibg }}>
            <Icon style={{ width: 19, height: 19, color }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium" style={{ color: textP }}>{label}</p>
            <p className="text-xs" style={{ color: textS }}>{sub}</p>
          </div>
        </div>
        <ChevronRight style={{ width: 16, height: 16, color: inactive }} />
      </button>
    );
  }

  return (
    <div className="min-h-screen pb-28 transition-colors" style={{ backgroundColor: bg }}>

      {/* ── HEADER ── */}
      <div
        className="px-5 pt-14 pb-6 shadow-xl"
        style={{ background: `linear-gradient(150deg, ${TEAL} 0%, #064E4A 100%)`, borderRadius: '0 0 28px 28px' }}
      >
        {/* Avatar row */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-18 h-18 rounded-full flex items-center justify-center border-4 border-white shadow-xl text-white text-xl font-bold flex-shrink-0"
            style={{ width: 72, height: 72, background: `linear-gradient(135deg, ${GOLD}, #B8860B)` }}
          >
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold">{fullName}</h1>
            <p className="text-white/70 text-xs mt-0.5">{memberSince ? `Membre depuis ${memberSince}` : 'Membre KAURI'}</p>
          </div>
          <button
            onClick={() => navigate('/kauri/manage-account')}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          >
            <Edit style={{ width: 16, height: 16, color: '#fff' }} />
          </button>
        </div>

        {/* Trust Score */}
        <div
          onClick={() => navigate('/kauri/trust-score-intro')}
          className="rounded-2xl p-4 mb-5 cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield style={{ width: 15, height: 15, color: GOLD }} />
              <span className="text-white text-xs font-medium">Trust Score</span>
            </div>
            <span className="text-xl font-bold" style={{ color: GOLD }}>{trustScore}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <div className="h-full rounded-full" style={{ width: `${trustScore}%`, background: `linear-gradient(90deg, ${GOLD}, #F59E0B)` }} />
          </div>
          <p className="text-white/60 text-xs mt-1.5">Excellent · Membre de confiance</p>
        </div>

        {/* ── PROFILE SWITCHER ── */}
        <div
          className="flex p-1 rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {/* Espace Personnel */}
          <button
            onClick={() => setActiveSpace('personnel')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full transition-all"
            style={{
              backgroundColor: activeSpace === 'personnel' ? '#fff' : 'transparent',
              boxShadow: activeSpace === 'personnel' ? '0 2px 10px rgba(0,0,0,0.20)' : 'none',
            }}
          >
            <User
              style={{ width: 15, height: 15, color: activeSpace === 'personnel' ? TEAL : 'rgba(255,255,255,0.55)', strokeWidth: 2 }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: activeSpace === 'personnel' ? TEAL : 'rgba(255,255,255,0.55)' }}
            >
              Espace Personnel
            </span>
          </button>

          {/* Espace Professionnel */}
          <button
            onClick={() => setActiveSpace('professionnel')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full transition-all"
            style={{
              backgroundColor: activeSpace === 'professionnel' ? '#fff' : 'transparent',
              boxShadow: activeSpace === 'professionnel' ? '0 2px 10px rgba(0,0,0,0.20)' : 'none',
            }}
          >
            <Briefcase
              style={{ width: 15, height: 15, color: activeSpace === 'professionnel' ? TEAL : 'rgba(255,255,255,0.55)', strokeWidth: 2 }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: activeSpace === 'professionnel' ? TEAL : 'rgba(255,255,255,0.55)' }}
            >
              Pro
            </span>
          </button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-5 pt-5 space-y-5">

        {activeSpace === 'personnel' && (
          <>
            {/* Activité */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Users, color: TEAL,   bg: `${TEAL}14`,  label: 'Tontines',  value: '3',  path: '/kauri/mes-tontines' },
                { icon: TrendingUp, color: GOLD, bg: `${GOLD}18`, label: 'Investis',  value: '2',  path: '/kauri/mes-investissements' },
                { icon: Award, color: '#8B5CF6', bg: '#8B5CF614', label: 'Badges',    value: '12', path: '/kauri/badges' },
              ].map(({ icon: Icon, color, bg: ibg, label, value, path }) => (
                <div key={label} onClick={() => path && navigate(path)} className="rounded-2xl p-4 text-center" style={{ backgroundColor: card, border: `1.5px solid ${border}`, cursor: path ? 'pointer' : 'default' }}>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center" style={{ backgroundColor: ibg }}>
                    <Icon style={{ width: 19, height: 19, color }} />
                  </div>
                  <p className="text-lg font-bold" style={{ color: textP }}>{value}</p>
                  <p className="text-xs" style={{ color: textS }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Mes informations */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: textS }}>Mes informations</p>
              <div className="space-y-2.5">
                {[
                  { icon: Mail,   color: TEAL,      ibg: `${TEAL}12`,    label: 'Email',     sub: 'jean.dupont@email.com' },
                  { icon: Phone,  color: '#3B82F6',  ibg: '#3B82F612',   label: 'Téléphone', sub: '+33 6 12 34 56 78' },
                  { icon: MapPin, color: '#8B5CF6',  ibg: '#8B5CF612',   label: 'Adresse',   sub: 'Paris, France' },
                ].map(({ icon: Icon, color, ibg, label, sub }) => (
                  <button key={label} onClick={() => navigate('/kauri/manage-account')} className="w-full rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: card, border: `1.5px solid ${border}` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: ibg }}>
                        <Icon style={{ width: 18, height: 18, color }} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs" style={{ color: textS }}>{label}</p>
                        <p className="text-sm font-medium" style={{ color: textP }}>{sub}</p>
                      </div>
                    </div>
                    <ChevronRight style={{ width: 16, height: 16, color: inactive }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sécurité */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: textS }}>Sécurité</p>
              <div className="space-y-2.5">
                <SettingRow icon={Lock}       color="#0A847E" bg={`${TEAL}12`}    label="Code PIN"             sub="Modifier votre PIN"    onClick={() => navigate('/kauri/biometric-setup')} />
                <SettingRow icon={Smartphone} color={GOLD}   bg={`${GOLD}18`}    label="Biométrie"            sub="Touch ID activé"       onClick={() => navigate('/kauri/biometric-setup')} />
                <SettingRow icon={Shield}     color="#0D9488" bg="#0D948812"      label="Authentification 2FA" sub="Désactivé"             onClick={() => navigate('/kauri/setup-2fa')} />
              </div>
            </div>

            {/* Paramètres de la carte */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: textS }}>Paramètres de la carte</p>
              <div className="space-y-2.5">
                {[
                  { type: 'Virtuelle', number: '**** 8762', expires: '12/27' },
                  { type: 'Physique',  number: '**** 3421', expires: '08/28' },
                ].map(card_ => (
                  <button key={card_.number} onClick={() => navigate('/kauri/portefeuille')} className="w-full rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: card, border: `1.5px solid ${border}` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${TEAL}, #0D9488)` }}>
                        <CreditCard style={{ width: 18, height: 18, color: '#fff' }} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium" style={{ color: textP }}>Carte {card_.type}</p>
                        <p className="text-xs" style={{ color: textS }}>{card_.number} · Expire {card_.expires}</p>
                      </div>
                    </div>
                    <ChevronRight style={{ width: 16, height: 16, color: inactive }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Préférences */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: textS }}>Préférences</p>
              <div className="space-y-2.5">
                <SettingRow icon={Bell}       color="#F59E0B"  bg="#F59E0B14"  label="Notifications"          sub="Gérer les alertes"      onClick={() => navigate('/kauri/notifications')} />
                <SettingRow icon={Eye}        color="#B05B3B"  bg="#B05B3B14"  label="Confidentialité"        sub="Contrôler vos données"  onClick={() => navigate('/kauri/preferences-contenu')} />
                {/* ── Coffre-fort numérique ── */}
                <button
                  onClick={() => navigate('/kauri/coffre-numerique')}
                  className="w-full rounded-2xl p-4 flex items-center justify-between"
                  style={{ backgroundColor: card, border: `1.5px solid ${border}` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${TEAL}, #0D9488)` }}>
                      <FolderOpen style={{ width: 18, height: 18, color: '#fff' }} />
                      {/* Smart contract dot */}
                      <span style={{ position: 'absolute', top: -3, right: -3, width: 9, height: 9, borderRadius: '50%', backgroundColor: '#A78BFA', border: '2px solid', borderColor: card, boxShadow: '0 0 6px #A78BFA' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: textP }}>Accès à mes documents</p>
                      <p className="text-xs" style={{ color: textS }}>Contrats signés · Coffre-fort numérique</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${TEAL}15`, color: TEAL }}>4</span>
                    <ChevronRight style={{ width: 16, height: 16, color: inactive }} />
                  </div>
                </button>
              </div>
            </div>

            {/* ── KAURI PREMIUM ── */}
            <div
              onClick={() => navigate('/kauri/premium-paywall')}
              className="rounded-3xl p-6 relative overflow-hidden cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 60%, #D4AF37 100%)', boxShadow: '0 8px 28px rgba(212,175,55,0.40)' }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -30, left: -20, width: 100, height: 100, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
                    <Crown style={{ width: 26, height: 26, color: '#fff' }} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">KAURI Premium</p>
                    <p className="text-white/80 text-xs">Débloquez tous les avantages</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {[
                    { icon: Zap,          text: 'SWAPs illimités gratuits' },
                    { icon: CheckCircle2, text: 'Carte physique offerte'    },
                    { icon: TrendingUp,   text: 'Frais réduits de 50%'      },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon style={{ width: 15, height: 15, color: '#fff', flexShrink: 0 }} />
                      <span className="text-white text-sm">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-2xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
                  <div>
                    <p className="text-white/70 text-xs">À partir de</p>
                    <p className="text-white font-bold text-lg">4,99€ / mois</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: '#fff', color: '#B8860B' }}>
                    Découvrir
                  </button>
                </div>
              </div>
            </div>

            {/* ── PRO ONBOARDING CARD ── */}
            <div
              className="rounded-3xl p-5 relative overflow-hidden"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #1A1200 0%, #2A1E00 100%)'
                  : 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: `2px solid ${GOLD}55`,
                boxShadow: `0 6px 28px ${GOLD}22`,
              }}
            >
              {/* Decorative glow */}
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${GOLD}25 0%, transparent 70%)`, pointerEvents: 'none' }} />

              {/* Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, boxShadow: `0 4px 14px ${GOLD}55` }}
                >
                  <Rocket style={{ width: 22, height: 22, color: '#fff' }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Espace Professionnel</p>
                  <p className="text-sm font-bold" style={{ color: isDarkMode ? '#fff' : '#1A1000' }}>Propulsez votre projet</p>
                </div>
              </div>

              {/* Body text */}
              <p className="text-sm leading-relaxed mb-5" style={{ color: isDarkMode ? 'rgba(255,255,255,0.70)' : '#78450A' }}>
                Propulsez votre propre projet. Débloquez les outils de financement participatif pour{' '}
                <span style={{ fontWeight: 700, color: isDarkMode ? GOLD : '#92400E' }}>collecter des dons</span>
                {' '}ou des{' '}
                <span style={{ fontWeight: 700, color: isDarkMode ? GOLD : '#92400E' }}>investissements</span>.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {['Crowdfunding', 'Tokens RWA', 'Tableau de bord Pro'].map(tag => (
                  <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: `${GOLD}22`, color: isDarkMode ? GOLD : '#92400E', border: `1px solid ${GOLD}44` }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate('/kauri/pro-verification')}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
                  color: '#fff',
                  boxShadow: `0 4px 16px ${GOLD}55`,
                }}
              >
                <Zap style={{ width: 16, height: 16 }} />
                Activer le profil Professionnel
                <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="w-full rounded-2xl p-4 flex items-center justify-center gap-2 text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #B05B3B, #DC2626)', color: '#fff', boxShadow: '0 3px 12px rgba(220,38,38,0.35)' }}
            >
              <LogOut style={{ width: 17, height: 17 }} />
              Déconnexion
            </button>
          </>
        )}

        {activeSpace === 'professionnel' && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 mx-auto"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, boxShadow: `0 6px 20px ${GOLD}44` }}
            >
              <Briefcase style={{ width: 36, height: 36, color: '#fff' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: textP }}>Espace Professionnel</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: textS, maxWidth: 280, margin: '0 auto 24px' }}>
              Activez votre profil Pro pour accéder aux outils de financement participatif et piloter vos projets.
            </p>
            <button
              onClick={() => navigate('/kauri/pro-verification')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, color: '#fff', boxShadow: `0 4px 16px ${GOLD}44` }}
            >
              <Rocket style={{ width: 16, height: 16 }} />
              Activer le profil Professionnel
            </button>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto"
        style={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', borderTop: `1px solid ${isDarkMode ? '#334155' : '#E8EDF2'}`, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-end justify-around px-2 pt-1.5 pb-3">
          {[
            { id: 'accueil',        icon: Home,   label: 'Accueil',        path: '/kauri/normal-dashboard' },
            { id: 'investissement', icon: Wallet, label: 'Investissement', path: '/kauri/investissement'   },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => navigate(tab.path)} className="flex flex-col items-center gap-0.5" style={{ minWidth: 44, paddingTop: 6, paddingBottom: 2 }}>
                <Icon style={{ width: 22, height: 22, color: inactive, strokeWidth: 1.8 }} />
                <span style={{ fontSize: 10, color: inactive }}>{tab.label}</span>
              </button>
            );
          })}

          {/* Kauri center */}
          <button
            onClick={() => navigate('/kauri/tontines-actives')}
            style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(212,175,55,0.5), 0 2px 8px rgba(0,0,0,0.18)', border: '2px solid rgba(255,255,255,0.2)', marginBottom: 6, flexShrink: 0, background: 'linear-gradient(135deg, #D4AF37, #F59E0B)' }}
          >
            <svg viewBox="0 0 100 100" style={{ width: 28, height: 28, color: '#fff' }}>
              <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
            </svg>
          </button>

          {/* Social */}
          <button onClick={() => navigate('/kauri/social-hub-gateway')} className="flex flex-col items-center gap-0.5" style={{ minWidth: 44, paddingTop: 6, paddingBottom: 2 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9.5" stroke={inactive} strokeWidth="1.6" />
              <path d="M3 12 Q7 9.5 12 9.5 Q17 9.5 21 12" stroke={inactive} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
              <circle cx="7" cy="10.5" r="1.1" fill={inactive} />
              <path d="M5.8 13.5 Q7 12.5 8.2 13.5" stroke={inactive} strokeWidth="1.1" strokeLinecap="round" fill="none" />
              <circle cx="17" cy="10.5" r="1.1" fill={inactive} />
              <path d="M15.8 13.5 Q17 12.5 18.2 13.5" stroke={inactive} strokeWidth="1.1" strokeLinecap="round" fill="none" />
              <circle cx="12" cy="6.5" r="1.1" fill={inactive} />
              <path d="M10.8 9.5 Q12 8.5 13.2 9.5" stroke={inactive} strokeWidth="1.1" strokeLinecap="round" fill="none" />
              <line x1="8" y1="11" x2="11" y2="7.5" stroke={inactive} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
              <line x1="16" y1="11" x2="13" y2="7.5" stroke={inactive} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
              <line x1="8.5" y1="12" x2="15.5" y2="12" stroke={inactive} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
            </svg>
            <span style={{ fontSize: 10, color: inactive }}>Social</span>
          </button>

          {/* Profil — actif */}
          <button className="flex flex-col items-center gap-0.5 relative" style={{ minWidth: 44, paddingTop: 6, paddingBottom: 2 }}>
            <User style={{ width: 22, height: 22, color: TEAL, strokeWidth: 2.2 }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: TEAL }}>Profil</span>
            <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', backgroundColor: TEAL }} />
          </button>
        </div>
      </nav>
    </div>
  );
}
