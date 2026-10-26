import {
  ArrowLeft,
  Building,
  Shield,
  FileText,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Settings,
  LogOut,
  BarChart3,
  DollarSign,
  Pencil,
  X,
  CheckCircle2,
  Camera,
  Info,
  Lock,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../contexts/AuthContext";

// ── Logique des badges ────────────────────────────────────────────────────────
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

function computeBadges(
  totalLeve: number,
  backers: number,
  projetsActifs: number,
  trustScore: number,
): Badge[] {
  return [
    {
      id: "impact",
      icon: Award,
      label: "Impact Social",
      desc: "Au moins 50 contributeurs réunis sur un projet",
      condition: `${backers} contributeurs`,
      color: "#D4AF37",
      gradient: "from-[#D4AF37] to-[#F59E0B]",
      earned: backers >= 50,
    },
    {
      id: "kyb",
      icon: Shield,
      label: "Vérifié KYB",
      desc: "Vérification d'identité entreprise complète",
      condition: "KYB validé",
      color: "#0a5c7a",
      gradient: "from-[#0a5c7a] to-[#0F172A]",
      earned: true,
    },
    {
      id: "performer",
      icon: TrendingUp,
      label: "Top Performer",
      desc: "Plus de 50 000 € levés au total",
      condition: `${(totalLeve / 1000).toFixed(0)}k€ levés`,
      color: "#B05B3B",
      gradient: "from-[#B05B3B] to-[#DC2626]",
      earned: totalLeve >= 50_000,
    },
    {
      id: "trust",
      icon: Star,
      label: "Partenaire Elite",
      desc: "Trust Score supérieur à 90",
      condition: `Score ${trustScore}/100`,
      color: "#7C3AED",
      gradient: "from-[#7C3AED] to-[#A855F7]",
      earned: trustScore >= 90,
    },
    {
      id: "multi",
      icon: Users,
      label: "Multi-Projets",
      desc: "Gérer simultanément 2 projets actifs ou plus",
      condition: `${projetsActifs} projet${projetsActifs > 1 ? "s" : ""} actif${projetsActifs > 1 ? "s" : ""}`,
      color: "#059669",
      gradient: "from-[#059669] to-[#0D9488]",
      earned: projetsActifs >= 2,
    },
    {
      id: "early",
      icon: Lock,
      label: "Pionnier Diaspora",
      desc: "Membre fondateur de la plateforme KAUREE",
      condition: "Membre depuis 2026",
      color: "#64748B",
      gradient: "from-[#475569] to-[#64748B]",
      earned: false,
    },
  ];
}

export function ProfilProScreen() {
  const navigate = useNavigate();
  const { isDarkMode, resetDarkMode } = useDarkMode();
  const { signOut, profile: userProfile } = useAuth();

  const trustScore = userProfile?.trustScore ?? 92;
  const totalLeve = 77_000;
  const backers = 129;
  const projetsActifs = 2;
  const tauxSucces = 100;

  // Profil hydraté avec les données Supabase réelles
  const [profile, setProfile] = useState({
    nom: userProfile?.businessName || "SARL Innovation Caraïbes",
    description:
      "Entreprise spécialisée dans le financement participatif et le développement économique de la diaspora afro-caribéenne.",
    secteur: "Financement & Innovation",
    localisation: "Fort-de-France, Martinique",
    siteWeb: "www.innovation-caraibes.fr",
    siret: userProfile?.siret || "123 456 789 00012",
    formeJuridique: userProfile?.formeJuridique || "SARL",
    dirigeant: userProfile?.dirigeant || "Marie Céleste (Gérante)",
  });

  useEffect(() => {
    if (userProfile) {
      setProfile((prev) => ({
        ...prev,
        nom: userProfile.businessName || prev.nom,
        siret: userProfile.siret || prev.siret,
        formeJuridique: userProfile.formeJuridique || prev.formeJuridique,
        dirigeant: userProfile.dirigeant || prev.dirigeant,
      }));
    }
  }, [userProfile]);

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  // Logo upload
  const [logoUrl, setLogoUrl] = useState<string | null>(() =>
    localStorage.getItem("kauri_pro_logo"),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setLogoUrl(url);
      try {
        localStorage.setItem("kauri_pro_logo", url);
      } catch {
        /* quota */
      }
    };
    reader.readAsDataURL(file);
  };

  const [badgeDetail, setBadgeDetail] = useState<Badge | null>(null);

  const badges = computeBadges(totalLeve, backers, projetsActifs, trustScore);
  const earnedCount = badges.filter((b) => b.earned).length;

  const openEdit = () => {
    setDraft({ ...profile });
    setEditOpen(true);
  };
  const saveEdit = () => {
    setProfile(draft);
    setEditOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    resetDarkMode();
    await signOut();
    navigate("/kauri/login");
  };

  const bg = isDarkMode
    ? "bg-[#0F172A]"
    : "bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]";
  const card = isDarkMode
    ? "bg-[#1E293B] border-[#334155]"
    : "bg-white border-[#E2E8F0]";
  const txt = isDarkMode ? "text-white" : "text-[#0F172A]";
  const sub = isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const inp = isDarkMode
    ? "bg-[#0F172A] border-[#334155] text-white placeholder:text-white/30"
    : "border-[#E2E8F0] text-[#0F172A]";

  const complianceLabel =
    userProfile?.kybStatus === "verified" || userProfile?.kycCompleted
      ? "VALIDÉ PAR CENTRAL REGISTRE"
      : "EN COURS DE VALIDATION";

  return (
    <div className={`min-h-screen pb-10 font-sans ${bg}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <button
          onClick={() => navigate(-1)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border ${card}`}
        >
          <ArrowLeft className={`w-5 h-5 ${txt}`} />
        </button>
        <h1 className={`text-base font-bold ${txt}`}>Profil Professionnel</h1>
        <button
          onClick={openEdit}
          className={`w-10 h-10 rounded-full flex items-center justify-center border ${card}`}
        >
          <Pencil className="w-4 h-4 text-[#D4AF37]" />
        </button>
      </div>

      <div className="px-6 space-y-6">
        {/* Identité Entreprise */}
        <div className={`rounded-3xl border p-6 text-center relative ${card}`}>
          {saved && (
            <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] font-bold px-3 py-1.5 rounded-full animate-fade-in">
              Profil enregistré !
            </div>
          )}

          {/* Logo Upload Zone */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-[#D4AF37] bg-slate-100 flex items-center justify-center shadow-md">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo entreprise"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#D4AF37] hover:bg-[#F59E0B] flex items-center justify-center text-white border-4 border-white shadow-md cursor-pointer transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <h2 className={`text-xl font-extrabold ${txt}`}>{profile.nom}</h2>
          <p className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase mt-1">
            {profile.secteur}
          </p>
          <p className={`text-xs mt-1.5 ${sub}`}>{profile.localisation}</p>

          <a
            href={`https://${profile.siteWeb}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-bold text-[#0a5c7a] hover:underline"
          >
            {profile.siteWeb}
          </a>

          {/* Bio courte */}
          <div
            className={`mt-4 rounded-2xl p-4 text-xs leading-relaxed text-left border ${isDarkMode ? "bg-[#0F172A]/40 border-[#334155]/50" : "bg-slate-50 border-slate-100"}`}
          >
            <p className={sub}>{profile.description}</p>
          </div>
        </div>

        {/* Métriques d'activité */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-2xl border p-4 ${card}`}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
              <span className={`text-[10px] font-semibold uppercase ${sub}`}>
                Levé Total
              </span>
            </div>
            <p className={`text-lg font-extrabold ${txt}`}>
              {totalLeve.toLocaleString()} €
            </p>
          </div>

          <div className={`rounded-2xl border p-4 ${card}`}>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-[#0a5c7a]" />
              <span className={`text-[10px] font-semibold uppercase ${sub}`}>
                Investisseurs
              </span>
            </div>
            <p className={`text-lg font-extrabold ${txt}`}>{backers} membres</p>
          </div>

          <div className={`rounded-2xl border p-4 ${card}`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className={`text-[10px] font-semibold uppercase ${sub}`}>
                Succès
              </span>
            </div>
            <p className={`text-lg font-extrabold ${txt}`}>{tauxSucces} %</p>
          </div>

          <div className={`rounded-2xl border p-4 ${card}`}>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-purple-500" />
              <span className={`text-[10px] font-semibold uppercase ${sub}`}>
                Projets Actifs
              </span>
            </div>
            <p className={`text-lg font-extrabold ${txt}`}>
              {projetsActifs} en cours
            </p>
          </div>
        </div>

        {/* Informations Légales (KYB) */}
        <div className={`rounded-3xl border p-5 space-y-4 ${card}`}>
          <h3 className={`text-sm font-bold border-b pb-2 ${txt}`}>
            Informations réglementaires (KYB)
          </h3>
          <div className="space-y-2.5">
            {[
              { label: "Numéro SIRET", val: profile.siret },
              { label: "Forme Juridique", val: profile.formeJuridique },
              { label: "Dirigeant central", val: profile.dirigeant },
              {
                label: "Statut de conformité",
                val: complianceLabel,
                badge: true,
              },
            ].map(({ label, val, badge }) => (
              <div key={label} className="flex justify-between items-center">
                <span className={`text-xs ${sub}`}>{label}</span>
                {badge ? (
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                    {val}
                  </span>
                ) : (
                  <span className={`text-xs font-bold ${txt}`}>{val}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Badges d'impact et de confiance */}
        <div className={`rounded-3xl border p-5 ${card}`}>
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className={`text-sm font-bold ${txt}`}>
              Badges de réputation
            </h3>
            <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">
              {earnedCount} / {badges.length} débloqués
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.id}
                  onClick={() => setBadgeDetail(b)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all hover:scale-95 cursor-pointer bg-transparent ${isDarkMode ? "border-[#334155]/40" : "border-slate-100"}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mb-2 shadow-sm ${!b.earned ? "opacity-30 grayscale" : ""}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-[9px] font-bold text-center truncate w-full ${txt}`}>
                    {b.label}
                  </span>
                  {!b.earned && (
                    <div className="flex items-center gap-0.5 mt-0.5 text-slate-400">
                      <Lock className="w-2 h-2" />
                      <span className="text-[7px] font-medium">Verrouillé</span>
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
            onClick={() => navigate("/kauri/pro-manage-account")}
            className={`w-full rounded-xl p-4 flex items-center justify-between border ${card}`}
          >
            <div className="flex items-center gap-3">
              <Settings className={`w-5 h-5 ${sub}`} />
              <span className={`text-sm ${txt}`}>
                Paramètres professionnels
              </span>
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
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
          />
          <div
            className={`relative rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col ${isDarkMode ? "bg-[#1E293B]" : "bg-white"}`}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
            </div>
            <div
              className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${isDarkMode ? "border-[#334155]" : "border-[#F1F5F9]"}`}
            >
              <div>
                <h2 className={`font-bold text-base ${txt}`}>
                  Modifier le profil
                </h2>
                <p className={`text-xs mt-0.5 ${sub}`}>
                  Visible par les particuliers dans Découverte
                </p>
              </div>
              <button
                onClick={() => setEditOpen(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-white/10" : "bg-[#F1F5F9]"}`}
              >
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
              {[
                {
                  key: "nom",
                  label: "Nom de l'entreprise",
                  placeholder: "SARL Innovation Caraïbes",
                },
                {
                  key: "secteur",
                  label: "Secteur d'activité",
                  placeholder: "Financement & Innovation",
                },
                {
                  key: "localisation",
                  label: "Localisation",
                  placeholder: "Fort-de-France, Martinique",
                },
                {
                  key: "siteWeb",
                  label: "Site web",
                  placeholder: "www.votre-site.fr",
                },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>
                    {label}
                  </label>
                  <input
                    value={draft[key as keyof typeof draft]}
                    onChange={(e) =>
                      setDraft({ ...draft, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${inp}`}
                  />
                </div>
              ))}

              <div>
                <label className={`text-sm font-semibold mb-2 block ${txt}`}>
                  Description
                </label>
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                  placeholder="Décrivez votre entreprise et votre mission…"
                  rows={4}
                  maxLength={300}
                  className={`w-full px-4 py-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${inp}`}
                />
                <p className={`text-xs text-right mt-1 ${sub}`}>
                  {draft.description.length}/300
                </p>
              </div>

              <div
                className={`rounded-xl p-4 border ${isDarkMode ? "bg-[#0F172A] border-[#334155]" : "bg-[#FEF9E7] border-[#D4AF37]/30"}`}
              >
                <p
                  className={`text-xs ${isDarkMode ? "text-[#D4AF37]" : "text-[#92400E]"}`}
                >
                  <strong>SIRET, forme juridique et dirigeants</strong> ne sont
                  modifiables que via une nouvelle vérification KYB. Contactez
                  le support KAUREE.
                </p>
              </div>
            </div>

            <div
              className={`flex gap-3 px-5 py-4 border-t flex-shrink-0 ${isDarkMode ? "border-[#334155]" : "border-[#F1F5F9]"}`}
            >
              <button
                onClick={() => setEditOpen(false)}
                className={`flex-1 py-4 rounded-xl border-2 text-sm font-medium ${isDarkMode ? "border-[#334155] text-white" : "border-[#E2E8F0] text-[#64748B]"}`}
              >
                Annuler
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DÉTAIL BADGE ───────────────────────────────────────────────── */}
      {badgeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setBadgeDetail(null)}
          />
          <div
            className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDarkMode ? "bg-[#1E293B]" : "bg-white"}`}
          >
            <button
              onClick={() => setBadgeDetail(null)}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-white/10" : "bg-[#F1F5F9]"}`}
            >
              <X className="w-4 h-4 text-[#64748B]" />
            </button>

            <div
              className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${badgeDetail.gradient} flex items-center justify-center ${!badgeDetail.earned ? "opacity-40 grayscale" : ""}`}
            >
              <badgeDetail.icon className="w-10 h-10 text-white" />
            </div>

            <h3 className={`text-lg font-bold text-center mb-1 ${txt}`}>
              {badgeDetail.label}
            </h3>
            <p className={`text-sm text-center mb-4 ${sub}`}>
              {badgeDetail.desc}
            </p>

            <div
              className={`rounded-xl p-4 mb-4 ${isDarkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs ${sub}`}>Condition</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: badgeDetail.color }}
                >
                  {badgeDetail.condition}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${sub}`}>Statut</span>
                {badgeDetail.earned ? (
                  <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Obtenu
                  </span>
                ) : (
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${sub}`}
                  >
                    <Lock className="w-3.5 h-3.5" /> Non débloqué
                  </span>
                )}
              </div>
            </div>

            {!badgeDetail.earned && (
              <div
                className={`rounded-xl p-3 border ${isDarkMode ? "bg-[#D4AF37]/10 border-[#D4AF37]/20" : "bg-[#FEF9E7] border-[#D4AF37]/30"} flex gap-2`}
              >
                <Info className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#92400E]">
                  Continuez à développer votre activité sur KAUREE pour débloquer
                  ce badge.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilProScreen;