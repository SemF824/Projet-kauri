import { ArrowLeft, CheckCircle2, Video, Image, FileText, Hash, Link2, Eye, Heart, MessageCircle, Share2, TrendingUp, Gift, Info, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

type ContentType = 'video' | 'image' | 'texte';
type CtaType = 'investir' | 'don' | 'decouvrir';

const CATEGORIES = ['Finance', 'Agriculture', 'Immobilier', 'Restauration', 'Tech', 'Artisanat', 'Commerce', 'Social'];

const MOCK_PROJECTS = [
  { id: '1', name: 'Lolo Moderne', type: 'investissement', raised: 45000, goal: 100000 },
  { id: '2', name: 'Coopérative Agricole', type: 'les-deux', raised: 32000, goal: 50000 },
];

const CTA_CONFIG: Record<CtaType, { label: string; color: string; bg: string; icon: React.ElementType; desc: string }> = {
  investir: { label: 'Investir maintenant', color: '#006D77', bg: 'bg-[#006D77]', icon: TrendingUp, desc: 'Le particulier sera invité à investir dans votre projet' },
  don:      { label: 'Faire un don',        color: '#B05B3B', bg: 'bg-[#B05B3B]', icon: Gift,       desc: 'Le particulier pourra faire un don au projet lié' },
  decouvrir:{ label: 'En savoir plus',      color: '#D4AF37', bg: 'bg-[#D4AF37]', icon: Info,       desc: 'Redirige vers la page détail de votre projet' },
};

export function ProPublishScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contentType, setContentType] = useState<ContentType | ''>('');
  const [form, setForm] = useState({
    mediaUrl: '',
    caption: '',
    category: '',
    hashtags: '',
    ctaType: '' as CtaType | '',
    projectId: '',
  });
  const [published, setPublished] = useState(false);

  const selectedProject = MOCK_PROJECTS.find(p => p.id === form.projectId);

  const canGoStep2 = contentType !== '';
  const canGoStep3 = form.caption.trim().length > 0 && form.category !== '';
  const canPublish  = form.ctaType !== '';

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => navigate('/kauri/pro-dashboard'), 2200);
  };

  const steps = [
    { id: 1, label: 'Type' },
    { id: 2, label: 'Contenu' },
    { id: 3, label: 'CTA & Aperçu' },
  ];

  if (published) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center gap-6 px-8">
        <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-white text-2xl font-bold text-center">Publication en ligne !</h2>
        <p className="text-white/70 text-sm text-center">
          Votre contenu est maintenant visible dans la section Découverte pour tous les particuliers KAURI.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white/70 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>
        <h1 className="text-white text-2xl font-bold mb-1">Nouvelle Publication</h1>
        <p className="text-white/60 text-sm mb-6">Visible dans Découverte · Comptes particuliers</p>

        {/* Steps */}
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-all ${s.id < step ? 'bg-[#D4AF37]' : s.id === step ? 'bg-white' : 'bg-white/15'}`}>
                  {s.id < step
                    ? <CheckCircle2 className="w-5 h-5 text-white" />
                    : <span className={`text-sm font-bold ${s.id === step ? 'text-[#0F172A]' : 'text-white/50'}`}>{s.id}</span>
                  }
                </div>
                <p className={`text-xs ${s.id <= step ? 'text-white' : 'text-white/40'}`}>{s.label}</p>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px flex-1 mx-2 mb-6 ${s.id < step ? 'bg-[#D4AF37]' : 'bg-white/20'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">

          {/* ── ÉTAPE 1 : Type de contenu ── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-[#0F172A] font-semibold mb-1">Quel type de contenu ?</p>
              <p className="text-[#64748B] text-sm mb-4">Les particuliers le verront dans leur fil Découverte.</p>

              {[
                { type: 'video' as ContentType,  icon: Video,    label: 'Vidéo',  sublabel: 'URL YouTube, Vimeo ou lien direct MP4', badge: 'Recommandé', badgeColor: '#006D77' },
                { type: 'image' as ContentType,  icon: Image,    label: 'Image',  sublabel: 'Photo de projet, infographie, visuel produit', badge: '', badgeColor: '' },
                { type: 'texte' as ContentType,  icon: FileText, label: 'Article',sublabel: 'Annonce, mise à jour, témoignage…', badge: '', badgeColor: '' },
              ].map(opt => {
                const Icon = opt.icon;
                const selected = contentType === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setContentType(opt.type)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selected ? 'border-[#0F172A] bg-[#F8FAFC]' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? 'bg-[#0F172A]' : 'bg-[#F1F5F9]'}`}>
                      <Icon className={`w-6 h-6 ${selected ? 'text-white' : 'text-[#64748B]'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-semibold text-sm ${selected ? 'text-[#0F172A]' : 'text-[#334155]'}`}>{opt.label}</span>
                        {opt.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: opt.badgeColor }}>{opt.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B]">{opt.sublabel}</p>
                    </div>
                    {selected && <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── ÉTAPE 2 : Contenu ── */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Media */}
              <div>
                <label className="text-sm font-semibold text-[#0F172A] mb-2 block">
                  {contentType === 'video' ? 'Lien vidéo' : contentType === 'image' ? 'URL de l\'image' : 'Titre de l\'article'}
                  <span className="text-red-500"> *</span>
                </label>
                {contentType === 'texte' ? (
                  <input
                    type="text"
                    value={form.mediaUrl}
                    onChange={e => setForm({ ...form, mediaUrl: e.target.value })}
                    placeholder="Titre de votre publication"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 text-sm"
                  />
                ) : (
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="url"
                      value={form.mediaUrl}
                      onChange={e => setForm({ ...form, mediaUrl: e.target.value })}
                      placeholder={contentType === 'video' ? 'https://youtube.com/watch?v=...' : 'https://images.unsplash.com/...'}
                      className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Aperçu média */}
              {form.mediaUrl && (contentType === 'image') && (
                <div className="aspect-video rounded-xl overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0]">
                  <img src={form.mediaUrl} alt="aperçu" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="text-sm font-semibold text-[#0F172A] mb-2 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.caption}
                  onChange={e => setForm({ ...form, caption: e.target.value })}
                  placeholder="Partagez l'histoire de votre projet, vos avancées, vos besoins…"
                  rows={4}
                  maxLength={300}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 resize-none text-sm"
                />
                <p className="text-xs text-[#94A3B8] mt-1 text-right">{form.caption.length}/300</p>
              </div>

              {/* Catégorie */}
              <div>
                <label className="text-sm font-semibold text-[#0F172A] mb-2 block">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.category === cat ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <label className="text-sm font-semibold text-[#0F172A] mb-2 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" /> Hashtags
                </label>
                <input
                  type="text"
                  value={form.hashtags}
                  onChange={e => setForm({ ...form, hashtags: e.target.value })}
                  placeholder="#diaspora #investissement #kauri"
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 text-sm"
                />
              </div>
            </div>
          )}

          {/* ── ÉTAPE 3 : CTA & Aperçu ── */}
          {step === 3 && (
            <div className="space-y-5">
              {/* CTA */}
              <div>
                <p className="text-sm font-semibold text-[#0F172A] mb-1">
                  Bouton d'action pour les particuliers <span className="text-red-500">*</span>
                </p>
                <p className="text-[#64748B] text-xs mb-3">Que voulez-vous que les particuliers fassent après avoir vu votre publication ?</p>
                <div className="space-y-2">
                  {(Object.entries(CTA_CONFIG) as [CtaType, typeof CTA_CONFIG[CtaType]][]).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const selected = form.ctaType === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setForm({ ...form, ctaType: key })}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${selected ? 'border-current' : 'border-[#E2E8F0]'}`}
                        style={{ color: selected ? cfg.color : undefined }}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? cfg.bg : 'bg-[#F1F5F9]'}`}>
                          <Icon className={`w-5 h-5 ${selected ? 'text-white' : 'text-[#64748B]'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${selected ? '' : 'text-[#0F172A]'}`}>{cfg.label}</p>
                          <p className="text-xs text-[#64748B]">{cfg.desc}</p>
                        </div>
                        {selected && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Projet lié */}
              <div>
                <label className="text-sm font-semibold text-[#0F172A] mb-2 block">Projet lié (optionnel)</label>
                <select
                  value={form.projectId}
                  onChange={e => setForm({ ...form, projectId: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 text-sm"
                >
                  <option value="">Aucun projet sélectionné</option>
                  {MOCK_PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {selectedProject && (
                  <div className="mt-2 bg-[#F1F5F9] rounded-xl p-3 flex items-center justify-between">
                    <span className="text-xs text-[#0F172A] font-medium">{selectedProject.name}</span>
                    <span className="text-xs text-[#006D77] font-bold">
                      {Math.round(selectedProject.raised / selectedProject.goal * 100)}% financé
                    </span>
                  </div>
                )}
              </div>

              {/* Aperçu publication */}
              <div>
                <p className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Aperçu — vue particulier
                </p>
                <div className="bg-[#0F172A] rounded-2xl overflow-hidden">
                  {/* Faux média */}
                  <div className="aspect-video bg-gradient-to-br from-[#1E293B] to-[#334155] flex items-center justify-center relative">
                    {form.mediaUrl && contentType === 'image' ? (
                      <img src={form.mediaUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/30">
                        {contentType === 'video' ? <Video className="w-10 h-10" /> : contentType === 'image' ? <Image className="w-10 h-10" /> : <FileText className="w-10 h-10" />}
                        <span className="text-xs">Aperçu {contentType}</span>
                      </div>
                    )}
                    {/* Overlay bas */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {/* Category pill */}
                    {form.category && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-[#D4AF37] rounded-full text-[10px] font-bold text-white">
                        {form.category}
                      </div>
                    )}
                    {/* Pro badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] text-white flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      PRO
                    </div>
                  </div>

                  {/* Info bas */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        MC
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">Marie & Cie</p>
                        <p className="text-white/50 text-[10px]">Compte vérifié ✓</p>
                      </div>
                      <button className="ml-auto px-3 py-1 border border-white/30 rounded-full text-white text-[10px]">Suivre</button>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed mb-3 line-clamp-2">{form.caption || 'Votre description apparaîtra ici…'}</p>
                    {form.hashtags && <p className="text-[#D4AF37] text-[10px] mb-3">{form.hashtags}</p>}

                    {/* Interactions */}
                    <div className="flex items-center gap-4 mb-3">
                      <button className="flex items-center gap-1 text-white/60 text-xs"><Heart className="w-4 h-4" /> 0</button>
                      <button className="flex items-center gap-1 text-white/60 text-xs"><MessageCircle className="w-4 h-4" /> 0</button>
                      <button className="flex items-center gap-1 text-white/60 text-xs"><Share2 className="w-4 h-4" /></button>
                    </div>

                    {/* CTA */}
                    {form.ctaType && (
                      <button className={`w-full py-2.5 rounded-xl text-white text-xs font-bold ${CTA_CONFIG[form.ctaType].bg}`}>
                        {CTA_CONFIG[form.ctaType].label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="flex-1 bg-white border-2 border-[#E2E8F0] text-[#64748B] py-4 rounded-xl text-sm font-medium"
            >
              Précédent
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              disabled={(step === 1 && !canGoStep2) || (step === 2 && !canGoStep3)}
              className="flex-1 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white py-4 rounded-xl text-sm font-semibold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={!canPublish}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl text-sm font-bold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Publier maintenant
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
