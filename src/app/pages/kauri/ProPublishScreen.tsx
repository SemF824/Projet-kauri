import { ArrowLeft, CheckCircle2, Video, Image, FileText, Hash, Link2, Eye, Heart, MessageCircle, Share2, TrendingUp, Gift, Info, X, BarChart2, Music, Search, Loader2, Play, Pause, ChevronRight, Upload, UploadCloud } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProPublications, type ProPublication, type MusicTrack } from '../../contexts/ProPublicationsContext';
import { useProData } from '../../contexts/ProDataContext';

type ContentType = 'video' | 'image' | 'texte';
type CtaType = 'investir' | 'don' | 'decouvrir';

const CATEGORIES = ['Finance', 'Agriculture', 'Immobilier', 'Restauration', 'Tech', 'Artisanat', 'Commerce', 'Social'];

// ── Composant MusicPicker (iTunes Search API — sans authentification) ──────────
function MusicPicker({ selected, onSelect }: { selected: MusicTrack | null; onSelect: (t: MusicTrack | null) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=8&country=fr`
      );
      const data = await res.json();
      setResults(
        (data.results as Record<string, unknown>[])
          .filter((r) => r.previewUrl)
          .map((r) => ({
            id: r.trackId as number,
            title: r.trackName as string,
            artist: r.artistName as string,
            artwork: (r.artworkUrl100 as string).replace('100x100', '60x60'),
            previewUrl: r.previewUrl as string,
          }))
      );
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, search]);

  const togglePlay = (track: MusicTrack) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(track.previewUrl);
      audio.play();
      audio.onended = () => setPlayingId(null);
      audioRef.current = audio;
      setPlayingId(track.id);
    }
  };

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  if (selected) {
    return (
      <div className="flex items-center gap-3 p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-xl">
        <img src={selected.artwork} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0F172A] truncate">{selected.title}</p>
          <p className="text-xs text-[#64748B] truncate">{selected.artist}</p>
        </div>
        <button
          type="button"
          onClick={() => { audioRef.current?.pause(); setPlayingId(null); onSelect(null); }}
          className="flex-shrink-0 text-[#94A3B8] hover:text-[#64748B]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un artiste, un titre…"
          className="w-full pl-9 pr-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-sm"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37] animate-spin" />}
      </div>

      {results.length > 0 && (
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#F1F5F9]">
          {results.map(track => (
            <div key={track.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#F8FAFC] transition-colors">
              <img src={track.artwork} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
              <button
                type="button"
                onClick={() => togglePlay(track)}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0F172A] flex items-center justify-center"
              >
                {playingId === track.id
                  ? <Pause className="w-3 h-3 text-white" />
                  : <Play className="w-3 h-3 text-white ml-0.5" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0F172A] truncate">{track.title}</p>
                <p className="text-[10px] text-[#64748B] truncate">{track.artist}</p>
              </div>
              <button
                type="button"
                onClick={() => { audioRef.current?.pause(); setPlayingId(null); onSelect(track); setQuery(''); setResults([]); }}
                className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold text-[#D4AF37] hover:text-[#B8920D]"
              >
                Choisir <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {query && !loading && results.length === 0 && (
        <p className="text-xs text-[#94A3B8] text-center py-3">Aucun résultat pour « {query} »</p>
      )}
    </div>
  );
}

const CTA_CONFIG: Record<CtaType, { label: string; color: string; bg: string; icon: React.ElementType; desc: string }> = {
  investir: { label: 'Investir maintenant', color: '#006D77', bg: 'bg-[#006D77]', icon: TrendingUp, desc: 'Le particulier sera invité à investir dans votre projet' },
  don:      { label: 'Faire un don',        color: '#B05B3B', bg: 'bg-[#B05B3B]', icon: Gift,       desc: 'Le particulier pourra faire un don au projet lié' },
  decouvrir:{ label: 'En savoir plus',      color: '#D4AF37', bg: 'bg-[#D4AF37]', icon: Info,       desc: 'Redirige vers la page détail de votre projet' },
};

export function ProPublishScreen() {
  const navigate = useNavigate();
  const { addPublication } = useProPublications();
  const { projets } = useProData();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contentType, setContentType] = useState<ContentType | ''>('');
  const [form, setForm] = useState({
    mediaUrl: '',
    caption: '',
    category: '',
    hashtags: '',
    ctaType: '' as CtaType | '',
    projectId: '',
    audio: '',
    music: null as MusicTrack | null,
  });
  const [mediaMode, setMediaMode] = useState<'url' | 'upload'>('url');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (mediaPreview) URL.revokeObjectURL(mediaPreview); }, [mediaPreview]);

  const handleFileSelect = (file: File) => {
    const accepted = contentType === 'video'
      ? file.type.startsWith('video/')
      : file.type.startsWith('image/');
    if (!accepted) return;
    const url = URL.createObjectURL(file);
    setMediaFile(file);
    setMediaPreview(url);
    setForm(f => ({ ...f, mediaUrl: url }));
  };
  const [published, setPublished] = useState(false);
  const [newPubId, setNewPubId] = useState('');

  const selectedProject = projets.find(p => p.id === form.projectId);

  const canGoStep2 = contentType !== '';
  const hasMedia = contentType === 'texte' || form.mediaUrl !== '' || mediaFile !== null;
  const canGoStep3 = form.caption.trim().length > 0 && form.category !== '' && hasMedia;
  const canPublish  = form.ctaType !== '';

  const handlePublish = () => {
    const id = `pub_${Date.now()}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    const newPub: ProPublication = {
      id,
      title: form.caption.trim(),
      type: contentType as string,
      category: form.category,
      project: selectedProject?.nom ?? '',
      ctaType: form.ctaType as 'investir' | 'don' | 'decouvrir',
      publishedAt: dateStr,
      thumbnail: mediaPreview || form.mediaUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      audio: form.music ? form.music.title : (form.audio || 'Son original'),
      music: form.music || undefined,
      stats: {
        vues: 0, vuesEvol: 0, likes: 0, likesEvol: 0,
        comments: 0, partages: 0, ctaClics: 0, ctaEvol: 0,
        conversions: { total: 0, investissements: { count: 0, montant: 0 }, dons: { count: 0, montant: 0 } },
        taux_conversion: 0, portee: 0, nouveaux_abonnes: 0,
      },
      timeline: [],
      top_contributeurs: [],
    };

    addPublication(newPub);
    setNewPubId(id);
    setPublished(true);
  };

  const steps = [
    { id: 1, label: 'Type' },
    { id: 2, label: 'Contenu' },
    { id: 3, label: 'CTA & Aperçu' },
  ];

  if (published) {
    const ctaCfg = form.ctaType ? CTA_CONFIG[form.ctaType as CtaType] : null;
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#0F172A] to-[#006D77]/30 flex flex-col px-6 pt-16 pb-10">
        {/* Checkmark animé */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center shadow-2xl mb-5"
            style={{ boxShadow: '0 0 40px rgba(0,109,119,0.5)' }}>
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-white text-2xl font-bold text-center mb-1">Publication en ligne !</h2>
          <p className="text-white/50 text-xs text-center">Visible instantanément dans le fil Découverte</p>
        </div>

        {/* Aperçu de la publication */}
        <div className="bg-white/8 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">Pro</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Votre entreprise</p>
              <p className="text-white/40 text-xs">À l'instant · <span className="text-[#0D9488]">● En ligne</span></p>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-3 line-clamp-3">{form.caption}</p>
          {ctaCfg && (
            <div className="flex items-center gap-2 py-2 px-3 rounded-xl" style={{ backgroundColor: `${ctaCfg.color}22` }}>
              <ctaCfg.icon className="w-4 h-4" style={{ color: ctaCfg.color }} />
              <span className="text-xs font-semibold" style={{ color: ctaCfg.color }}>{ctaCfg.label}</span>
            </div>
          )}
        </div>

        {/* Stats initiales */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Eye, label: 'Vues', val: '0' },
            { icon: Heart, label: 'Likes', val: '0' },
            { icon: MessageCircle, label: 'Commentaires', val: '0' },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="bg-white/6 border border-white/10 rounded-xl py-3 flex flex-col items-center gap-1">
              <Icon className="w-4 h-4 text-white/40" />
              <span className="text-white font-bold text-lg">{ val }</span>
              <span className="text-white/40 text-[10px]">{label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-auto">
          <button
            onClick={() => navigate('/kauri/pro-publication-stats')}
            className="w-full py-4 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)', boxShadow: '0 4px 16px rgba(212,175,55,0.4)' }}
          >
            <BarChart2 className="w-5 h-5" />
            Voir mes statistiques
          </button>
          <button
            onClick={() => navigate('/kauri/pro-dashboard')}
            className="w-full py-4 rounded-2xl text-white/70 text-sm font-medium border border-white/15 bg-transparent"
          >
            Retour au dashboard
          </button>
        </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#0F172A]">
                    {contentType === 'video' ? 'Vidéo' : contentType === 'image' ? 'Image' : 'Titre de l\'article'}
                    <span className="text-red-500"> *</span>
                  </label>
                  {/* Toggle URL / Upload (seulement pour image et vidéo) */}
                  {contentType !== 'texte' && (
                    <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => { setMediaMode('url'); setMediaFile(null); setMediaPreview(''); setForm(f => ({ ...f, mediaUrl: '' })); }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${mediaMode === 'url' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#94A3B8]'}`}
                      >
                        <Link2 className="w-3 h-3" /> Lien
                      </button>
                      <button
                        type="button"
                        onClick={() => { setMediaMode('upload'); setForm(f => ({ ...f, mediaUrl: '' })); }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${mediaMode === 'upload' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#94A3B8]'}`}
                      >
                        <Upload className="w-3 h-3" /> Upload
                      </button>
                    </div>
                  )}
                </div>

                {/* Mode texte */}
                {contentType === 'texte' && (
                  <input
                    type="text"
                    value={form.mediaUrl}
                    onChange={e => setForm({ ...form, mediaUrl: e.target.value })}
                    placeholder="Titre de votre publication"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 text-sm"
                  />
                )}

                {/* Mode URL */}
                {contentType !== 'texte' && mediaMode === 'url' && (
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

                {/* Mode Upload */}
                {contentType !== 'texte' && mediaMode === 'upload' && (
                  <div>
                    {/* Zone de dépôt — masquée si fichier déjà sélectionné */}
                    {!mediaFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${dragOver ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-[#F8FAFC]'}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                          <UploadCloud className="w-6 h-6 text-[#94A3B8]" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {dragOver ? 'Déposez ici' : 'Glissez ou cliquez pour choisir'}
                          </p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            {contentType === 'video' ? 'MP4, MOV, WebM · max 500 Mo' : 'JPG, PNG, WebP, GIF · max 50 Mo'}
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={contentType === 'video' ? 'video/*' : 'image/*'}
                          className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                        />
                      </div>
                    ) : (
                      /* Aperçu fichier sélectionné */
                      <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0]">
                        {contentType === 'image' ? (
                          <img src={mediaPreview} alt="aperçu" className="w-full aspect-video object-cover" />
                        ) : (
                          <video src={mediaPreview} controls className="w-full aspect-video object-cover bg-black" />
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 flex items-center justify-between">
                          <span className="text-white text-xs truncate max-w-[70%]">{mediaFile.name}</span>
                          <button
                            type="button"
                            onClick={() => { setMediaFile(null); setMediaPreview(''); setForm(f => ({ ...f, mediaUrl: '' })); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Aperçu URL image */}
              {contentType === 'image' && mediaMode === 'url' && form.mediaUrl && (
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

              {/* Musique */}
              <div>
                <label className="text-sm font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Musique <span className="text-[#94A3B8] font-normal text-xs">(optionnel)</span>
                </label>
                <p className="text-[#64748B] text-xs mb-3">
                  Recherchez un vrai titre — aperçu 30s disponible avant de choisir
                </p>
                <MusicPicker
                  selected={form.music}
                  onSelect={music => setForm({ ...form, music })}
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
                  {projets.map(p => (
                    <option key={p.id} value={p.id}>{p.nom}</option>
                  ))}
                </select>
                {selectedProject && (
                  <div className="mt-2 bg-[#F1F5F9] rounded-xl p-3 flex items-center justify-between">
                    <span className="text-xs text-[#0F172A] font-medium">{selectedProject.nom}</span>
                    <span className="text-xs text-[#006D77] font-bold">
                      {selectedProject.objectif > 0
                        ? `${Math.round(selectedProject.leve / selectedProject.objectif * 100)} % financé`
                        : selectedProject.statut}
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
                    {contentType === 'image' && form.mediaUrl ? (
                      <img src={form.mediaUrl} alt="" className="w-full h-full object-cover" />
                    ) : contentType === 'video' && mediaPreview ? (
                      <video src={mediaPreview} className="w-full h-full object-cover" muted playsInline />
                    ) : contentType === 'video' && form.mediaUrl ? (
                      <div className="flex flex-col items-center gap-2 text-white/60">
                        <Video className="w-10 h-10" />
                        <span className="text-xs text-center px-4 truncate max-w-full">{form.mediaUrl}</span>
                      </div>
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
                        PRO
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">Votre entreprise</p>
                        <p className="text-white/50 text-[10px]">Compte vérifié ✓</p>
                      </div>
                      <button className="ml-auto px-3 py-1 border border-white/30 rounded-full text-white text-[10px]">Suivre</button>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed mb-3 line-clamp-2">{form.caption || 'Votre description apparaîtra ici…'}</p>
                    {form.hashtags && <p className="text-[#D4AF37] text-[10px] mb-2">{form.hashtags}</p>}

                    {/* Musique dans l'aperçu */}
                    {form.music ? (
                      <div className="flex items-center gap-2 mb-3 bg-black/40 rounded-full pl-1 pr-3 py-1 w-fit max-w-full overflow-hidden">
                        <img src={form.music.artwork} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                        <Music className="w-2.5 h-2.5 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-white/80 text-[10px] font-medium truncate">{form.music.title} — {form.music.artist}</span>
                      </div>
                    ) : form.audio ? (
                      <div className="flex items-center gap-2 mb-3 bg-black/30 rounded-full px-3 py-1.5 w-fit max-w-full overflow-hidden">
                        <Music className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-white/80 text-[10px] font-medium truncate">{form.audio}</span>
                      </div>
                    ) : null}

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
