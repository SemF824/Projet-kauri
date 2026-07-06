import {
  ArrowLeft, Building, Shield, FileText, Users, TrendingUp, Award,
  ChevronRight, Settings, LogOut, BarChart3, DollarSign, Pencil, X,
  CheckCircle2, Camera, Info, Lock, Star
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

// ── Logique des badges ────────────────────────────────────────────────────────
// Chaque badge a des conditions calculées depuis les métriques réelles
interface Badge {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  condition: string;
  color: string;
  gradient: string;
  earned: boolean;
}

function computeBadges(totalLeve: number, backers: number, projetsActifs: number, trustScore: number): Badge[] {
  return [
    {
      id: 'impact',
      icon: Award,
      label: 'Impact Social',
      desc: 'Au moins 50 contributeurs réunis sur un projet',
      condition: `${backers} contributeurs`,
      color: '#D4AF37',
      gradient: 'from-[#D4AF37] to-[#F59E0B]',
      earned: backers >= 50,
    },
    {
      id: 'kyb',
      icon: Shield,
      label: 'Vérifié KYB',
      desc: 'Vérification d\'identité entreprise complète',
      condition: 'KYB validé',
      color: '#006D77',
      gradient: 'from-[#006D77] to-[#0D9488]',
      earned: true, // compte vérifié par défaut
    },
    {
      id: 'performer',
      icon: TrendingUp,
      label: 'Top Performer',
      desc: 'Plus de 50 000 € levés au total',
      condition: `${(totalLeve / 1000).toFixed(0)}k€ levés`,
      color: '#B05B3B',
      gradient: 'from-[#B05B3B] to-[#DC2626]',
      earned: totalLeve >= 50_000,
    },
    {
      id: 'trust',
      icon: Star,
      label: 'Partenaire Elite',
      desc: 'Trust Score supérieur à 90',
      condition: `Score ${trustScore}/100`,
      color: '#7C3AED',
      gradient: 'from-[#7C3AED] to-[#A855F7]',
      earned: trustScore >= 90,
    },
    {
      id: 'multi',
      icon: Users,
      label: 'Multi-Projets',
      desc: 'Gérer simultanément 2 projets actifs ou plus',
      condition: `${projetsActifs} projet${projetsActifs > 1 ? 's' : ''} actif${projetsActifs > 1 ? 's' : ''}`,
      color: '#059669',
      gradient: 'from-[#059669] to-[#0D9488]',
      earned: projetsActifs >= 2,
    },
    {
      id: 'early',
      icon: Lock,
      label: 'Pionnier Diaspora',
      desc: 'Membre fondateur de la plateforme KAURI',
      condition: 'Membre depuis 2026',
      color: '#64748B',
      gradient: 'from-[#475569] to-[#64748B]',
      earned: false, // non encore débloqué
    },
  ];
}

// ── Profil par défaut ─────────────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  nom: 'SARL Innovation Caraïbes',
  description: "Entreprise spécialisée dans le financement participatif et le développement économique de la diaspora afro-caribéenne.",
  secteur: 'Financement & Innovation',
  localisation: 'Fort-de-France, Martinique',
  siteWeb: 'www.innovation-caraibes.fr',
  siret: '123 456 789 00012',
  formeJuridique: 'SARL',
  dirigeant: 'Marie Céleste (Gérante)',
};

export function ProfilProScreen() {
  const navigate = useNavigate();
  const { isDarkMode, resetDarkMode } = useDarkMode();

  const trustScore = 92;
  const totalLeve  = 77_000;
  const backers    = 129;
  const projetsActifs = 2;
  const tauxSucces = 100;

  // Édition profil
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [editOpen, setEditOpen]   = useState(false);
  const [draft,    setDraft]      = useState(DEFAULT_PROFILE);
  const [saved,    setSaved]      = useState(false);

  // Logo upload
  const [logoUrl, setLogoUrl] = useState<string | null>(() => localStorage.getItem('kauri_pro_logo'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setLogoUrl(url);
      try { localStorage.setItem('kauri_pro_logo', url); } catch { /* quota */ }
    };
    reader.readAsDataURL(file);
  };

  // Badge détail
  const [badgeDetail, setBadgeDetail] = useState<Badge | null>(null);

  const badges = computeBadges(totalLeve, backers, projetsActifs, trustScore);
  const earnedCount = badges.filter(b => b.earned).length;

  const openEdit = () => { setDraft({ ...profile }); setEditOpen(true); };
  const saveEdit = () => {
    setProfile(draft);
    setEditOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    resetDarkMode();
    localStorage.removeItem('kauri_account_type');
    navigate('/kauri/login');
  };

  const bg   = isDarkMode ? 'bg-[#0F172A]'  : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]';
  const card = isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]';
  const txt  = isDarkMode ? 'text-white'     : 'text-[#0F172A]';
  const sub  = isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const inp  = isDarkMode
    ? 'bg-[#0F172A] border-[#334155] text-white placeholder:text-white/30'
    : 'border-[#E2E8F0] text-[#0F172A]';

  return (
    <div className={`min-h-screen pb-24 transition-colors ${bg}`}>

      {/* Toast */}
      {saved && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#006D77] text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4" /> Profil mis à jour
        </div>
      )}

      {/* HEADER */}
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]'}`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Retour</span>
          </button>
          <button
            onClick={openEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full text-white text-xs font-semibold"
          >
            <Pencil className="w-3.5 h-3.5" /> Modifier
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          {/* Logo entreprise */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white/30 shadow-xl overflow-hidden flex items-center justify-center">
              {logoUrl
                ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                : <Building className="w-10 h-10 text-[#D4AF37]" />
              }
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0F172A] rounded-full flex items-center justify-center border-2 border-white"
            >
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-xl font-bold leading-tight mb-0.5 truncate">{profile.nom}</h1>
            <p className="text-white/80 text-xs">{profile.secteur}</p>
            <p className="text-white/60 text-xs mt-0.5">{profile.localisation}</p>
          </div>
        </div>

        {/* Trust Score */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white text-sm font-medium">Trust Score Corporate</span>
            </div>
            <span className="text-[#D4AF37] text-2xl font-bold">{trustScore}</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B]" style={{ width: `${trustScore}%` }} />
          </div>
          <p className="text-white/70 text-xs mt-2">Excellent · Partenaire de confiance KAURI</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">

        {/* Description entreprise */}
        <div className={`rounded-2xl p-5 shadow-md border ${card}`}>
          <p className={`text-xs font-semibold mb-2 ${sub}`}>À propos</p>
          <p className={`text-sm leading-relaxed mb-3 ${txt}`}>{profile.description}</p>
          {profile.siteWeb && (
            <p className="text-xs text-[#006D77] font-medium">🌐 {profile.siteWeb}</p>
          )}
        </div>

        {/* Vérification KYB */}
        <div className={`rounded-2xl p-5 shadow-md border ${card}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${txt}`}>Vérification KYB</h3>
            <span className="px-3 py-1 bg-[#D1FAE5] text-[#006D77] text-xs rounded-full font-medium">✓ Vérifié</span>
          </div>
          <div className="space-y-3">
            {[
              { icon: FileText, label: 'SIRET',          value: profile.siret          },
              { icon: Building, label: 'Forme juridique', value: profile.formeJuridique },
              { icon: Users,    label: 'Dirigeants',      value: profile.dirigeant      },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#334155] border-[#475569]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${sub}`} />
                  <div>
                    <p className={`text-xs ${sub}`}>{label}</p>
                    <p className={`text-sm font-medium ${txt}`}>{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métriques */}
        <div>
          <h3 className={`mb-4 font-semibold ${txt}`}>Métriques business</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: DollarSign, label: 'Levés total',    value: '77 000 €', color: '#006D77' },
              { icon: Users,      label: 'Investisseurs',  value: String(backers), color: '#D4AF37' },
              { icon: BarChart3,  label: 'Projets actifs', value: String(projetsActifs), color: '#006D77' },
              { icon: TrendingUp, label: 'Taux de succès', value: `${tauxSucces}%`, color: '#D4AF37' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className={`rounded-xl p-4 border ${card}`}>
                <Icon className="w-6 h-6 mb-2" style={{ color }} />
                <p className={`text-xs mb-1 ${sub}`}>{label}</p>
                <p className={`text-xl font-bold ${txt}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges avec logique */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${txt}`}>Certifications & Badges</h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#FEF9E7] text-[#92400E]'}`}>
              {earnedCount}/{badges.length} obtenus
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.map(badge => {
              const Icon = badge.icon;
              return (
                <button
                  key={badge.id}
                  onClick={() => setBadgeDetail(badge)}
                  className={`rounded-xl p-3 text-center border transition-all relative ${card} ${!badge.earned ? 'opacity-40 grayscale' : ''}`}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${badge.gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className={`text-xs font-medium leading-tight ${sub}`}>{badge.label}</p>
                  {badge.earned && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  {!badge.earned && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#94A3B8] rounded-full flex items-center justify-center">
                      <Lock className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Paramètres + Déconnexion */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/kauri/pro-manage-account')}
            className={`w-full rounded-xl p-4 flex items-center justify-between border ${card}`}
          >
            <div className="flex items-center gap-3">
              <Settings className={`w-5 h-5 ${sub}`} />
              <span className={`text-sm ${txt}`}>Paramètres professionnels</span>
            </div>
            <ChevronRight className={`w-4 h-4 ${sub}`} />
          </button>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl p-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#B05B3B] to-[#DC2626] text-white font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* ── SHEET ÉDITION PROFIL ─────────────────────────────────────────────── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className={`relative rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
            </div>
            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}>
              <div>
                <h2 className={`font-bold text-base ${txt}`}>Modifier le profil</h2>
                <p className={`text-xs mt-0.5 ${sub}`}>Visible par les particuliers dans Découverte</p>
              </div>
              <button onClick={() => setEditOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-[#F1F5F9]'}`}>
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
              {[
                { key: 'nom',            label: 'Nom de l\'entreprise',    placeholder: 'SARL Innovation Caraïbes' },
                { key: 'secteur',        label: 'Secteur d\'activité',     placeholder: 'Financement & Innovation' },
                { key: 'localisation',   label: 'Localisation',           placeholder: 'Fort-de-France, Martinique' },
                { key: 'siteWeb',        label: 'Site web',               placeholder: 'www.votre-site.fr' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>{label}</label>
                  <input
                    value={draft[key as keyof typeof draft]}
                    onChange={e => setDraft({ ...draft, [key]: e.target.value })}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${inp}`}
                  />
                </div>
              ))}

              <div>
                <label className={`text-sm font-semibold mb-2 block ${txt}`}>Description</label>
                <textarea
                  value={draft.description}
                  onChange={e => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Décrivez votre entreprise et votre mission…"
                  rows={4}
                  maxLength={300}
                  className={`w-full px-4 py-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${inp}`}
                />
                <p className={`text-xs text-right mt-1 ${sub}`}>{draft.description.length}/300</p>
              </div>

              <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#0F172A] border-[#334155]' : 'bg-[#FEF9E7] border-[#D4AF37]/30'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#92400E]'}`}>
                  <strong>SIRET, forme juridique et dirigeants</strong> ne sont modifiables que via une nouvelle vérification KYB. Contactez le support KAURI.
                </p>
              </div>
            </div>

            <div className={`flex gap-3 px-5 py-4 border-t flex-shrink-0 ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}>
              <button onClick={() => setEditOpen(false)}
                className={`flex-1 py-4 rounded-xl border-2 text-sm font-medium ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                Annuler
              </button>
              <button onClick={saveEdit}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DÉTAIL BADGE ───────────────────────────────────────────────── */}
      {badgeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBadgeDetail(null)} />
          <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
            <button onClick={() => setBadgeDetail(null)} className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-[#F1F5F9]'}`}>
              <X className="w-4 h-4 text-[#64748B]" />
            </button>

            <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${badgeDetail.gradient} flex items-center justify-center ${!badgeDetail.earned ? 'opacity-40 grayscale' : ''}`}>
              <badgeDetail.icon className="w-10 h-10 text-white" />
            </div>

            <h3 className={`text-lg font-bold text-center mb-1 ${txt}`}>{badgeDetail.label}</h3>
            <p className={`text-sm text-center mb-4 ${sub}`}>{badgeDetail.desc}</p>

            <div className={`rounded-xl p-4 mb-4 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${sub}`}>Condition</span>
                <span className="text-xs font-semibold" style={{ color: badgeDetail.color }}>{badgeDetail.condition}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${sub}`}>Statut</span>
                {badgeDetail.earned ? (
                  <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Obtenu
                  </span>
                ) : (
                  <span className={`text-xs font-bold flex items-center gap-1 ${sub}`}>
                    <Lock className="w-3.5 h-3.5" /> Non débloqué
                  </span>
                )}
              </div>
            </div>

            {!badgeDetail.earned && (
              <div className={`rounded-xl p-3 border ${isDarkMode ? 'bg-[#D4AF37]/10 border-[#D4AF37]/20' : 'bg-[#FEF9E7] border-[#D4AF37]/30'} flex gap-2`}>
                <Info className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#92400E]">
                  Continuez à développer votre activité sur KAURI pour débloquer ce badge.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
