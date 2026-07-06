import { ArrowLeft, Plus, Trophy, TrendingUp, Users, Sparkles, X, ChevronUp, Lock, CheckCircle2, AlertCircle, Heart, Clock, Filter } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

interface Palier {
  label: string;
  montant: number;
  color: string;
  icon: string;
  description: string;
}

export function PotCommunScreen() {
  const navigate = useNavigate();
  const [currentAmount, setCurrentAmount] = useState(45000);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fallingShells, setFallingShells] = useState<number[]>([]);
  const [showPaliersSheet, setShowPaliersSheet] = useState(false);
  const [histoFilter, setHistoFilter] = useState<'tout' | 'investissement' | 'don'>('tout');
  const [histoExpanded, setHistoExpanded] = useState(false);

  const CONTRIBUTIONS = [
    { id: '1', initials: 'SB', name: 'Sophie B.',     type: 'investissement' as const, montant: 5000,  palier: 'Palier Argent', date: "Aujourd'hui",   time: '09:14' },
    { id: '2', initials: 'JM', name: 'Jean-Luc M.',   type: 'don' as const,            montant: 500,   palier: 'Palier Bronze', date: "Aujourd'hui",   time: '08:32' },
    { id: '3', initials: 'AC', name: 'André C.',       type: 'investissement' as const, montant: 3000,  palier: 'Palier Argent', date: 'Hier',          time: '17:05' },
    { id: '4', initials: 'LM', name: 'Lucia M.',       type: 'don' as const,            montant: 200,   palier: 'Palier Bronze', date: 'Hier',          time: '14:22' },
    { id: '5', initials: 'KD', name: 'Kofi D.',        type: 'investissement' as const, montant: 8000,  palier: 'Palier Or',     date: '2 juil.',       time: '11:48' },
    { id: '6', initials: 'FA', name: 'Fatou A.',       type: 'investissement' as const, montant: 10000, palier: 'Palier Or',     date: '2 juil.',       time: '10:03' },
    { id: '7', initials: 'MN', name: 'Marie N.',       type: 'don' as const,            montant: 100,   palier: 'Palier Bronze', date: '1 juil.',       time: '19:30' },
    { id: '8', initials: 'CE', name: 'Cédric E.',      type: 'investissement' as const, montant: 5000,  palier: 'Palier Argent', date: '1 juil.',       time: '16:11' },
    { id: '9', initials: 'RB', name: 'Rachel B.',      type: 'don' as const,            montant: 300,   palier: 'Palier Bronze', date: '30 juin',       time: '12:55' },
    { id:'10', initials: 'OT', name: 'Omar T.',        type: 'investissement' as const, montant: 2500,  palier: 'Palier Argent', date: '30 juin',       time: '09:40' },
  ];
  const [editStep, setEditStep] = useState<'view' | 'edit' | 'confirm'>('view');
  const [newMontants, setNewMontants] = useState({ p1: '', p2: '', p3: '' });
  const [errors, setErrors] = useState({ p1: '', p2: '', p3: '' });

  const [paliers, setPaliers] = useState<Palier[]>([
    { label: 'Palier Bronze', montant: 30000, color: '#CD7F32', icon: '🥉', description: 'Équipement de base' },
    { label: 'Palier Argent', montant: 60000, color: '#94A3B8', icon: '🥈', description: 'Recrutement & local' },
    { label: 'Palier Or',     montant: 100000, color: '#D4AF37', icon: '🥇', description: 'Lancement complet' },
  ]);

  const targetAmount = paliers[2].montant;
  const percentage = Math.round((currentAmount / targetAmount) * 100);

  const tiers = paliers.map((p) => ({
    level: Math.round((p.montant / targetAmount) * 100),
    label: p.label,
    reached: currentAmount >= p.montant,
    color: p.color,
  }));

  useEffect(() => {
    if (percentage >= 100 && !showSuccess) {
      setShowSuccess(true);
      // Déclencher animation de coquillages
      const shells = Array.from({ length: 20 }, (_, i) => i);
      setFallingShells(shells);
      setTimeout(() => setFallingShells([]), 3000);
    }
  }, [percentage, showSuccess]);

  const openPaliersSheet = () => {
    setNewMontants({ p1: '', p2: '', p3: '' });
    setErrors({ p1: '', p2: '', p3: '' });
    setEditStep('view');
    setShowPaliersSheet(true);
  };

  const validateAndProceed = () => {
    const v1 = parseFloat(newMontants.p1);
    const v2 = parseFloat(newMontants.p2);
    const v3 = parseFloat(newMontants.p3);
    const errs = { p1: '', p2: '', p3: '' };
    let ok = true;

    if (!newMontants.p1 || isNaN(v1)) { errs.p1 = 'Requis'; ok = false; }
    else if (v1 <= paliers[0].montant) { errs.p1 = `Doit dépasser ${paliers[0].montant.toLocaleString()} €`; ok = false; }

    if (!newMontants.p2 || isNaN(v2)) { errs.p2 = 'Requis'; ok = false; }
    else if (v2 <= paliers[1].montant) { errs.p2 = `Doit dépasser ${paliers[1].montant.toLocaleString()} €`; ok = false; }
    else if (v2 <= v1) { errs.p2 = 'Doit être supérieur au Palier 1'; ok = false; }

    if (!newMontants.p3 || isNaN(v3)) { errs.p3 = 'Requis'; ok = false; }
    else if (v3 <= paliers[2].montant) { errs.p3 = `Doit dépasser ${paliers[2].montant.toLocaleString()} €`; ok = false; }
    else if (v3 <= v2) { errs.p3 = 'Doit être supérieur au Palier 2'; ok = false; }

    setErrors(errs);
    if (ok) setEditStep('confirm');
  };

  const confirmAugmentation = () => {
    setPaliers([
      { ...paliers[0], montant: parseFloat(newMontants.p1) },
      { ...paliers[1], montant: parseFloat(newMontants.p2) },
      { ...paliers[2], montant: parseFloat(newMontants.p3) },
    ]);
    setEditStep('view');
    setShowPaliersSheet(false);
  };

  const Shell = ({ delay }: { delay: number }) => (
    <div
      className="absolute animate-fall"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay * 0.1}s`,
        top: '-20px',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#D4AF37]">
        <path
          d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
          fill="currentColor"
        />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F9F9] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-white text-2xl mb-2">Pot Commun</h1>
          <p className="text-white/90 text-sm">Restaurant Lolo Moderne</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/90 text-sm">Objectif Actuel</span>
            <span className="text-white text-lg">{targetAmount.toLocaleString()} €</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/90">Levé</span>
            <span className="text-white">{currentAmount.toLocaleString()} € ({percentage}%)</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Pot Commun Visuel avec Coquillages */}
        <div className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#E2E8F0] overflow-hidden">
            <h3 className="text-[#0F172A] text-center mb-6 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              Pot Commun Visuel
            </h3>

            {/* Conteneur transparent du pot */}
            <div className="relative h-96 mx-auto max-w-xs">
              {/* Bordures du pot */}
              <div className="absolute inset-0 border-4 border-[#006D77] rounded-3xl bg-gradient-to-b from-transparent to-[#006D77]/5 shadow-lg"></div>

              {/* Niveau de remplissage avec dégradé */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#006D77] via-[#0D9488] to-[#14B8A6] rounded-b-3xl transition-all duration-1000 ease-out overflow-hidden"
                style={{ height: `${percentage > 100 ? 100 : percentage}%` }}
              >
                {/* Effet de vagues */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-white/10 animate-pulse"></div>

                {/* Coquillages flottants dans le pot */}
                {Array.from({ length: Math.floor(percentage / 10) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-float"
                    style={{
                      left: `${(i * 25) % 90}%`,
                      bottom: `${(i * 15) % 80}%`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#D4AF37]">
                      <path
                        d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Indicateurs de paliers */}
              {tiers.map((tier) => (
                <div
                  key={tier.level}
                  className="absolute left-0 right-0 flex items-center"
                  style={{ bottom: `${tier.level}%` }}
                >
                  <div className="flex-1 h-0.5 bg-[#E2E8F0]"></div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs mx-2 transition-all ${
                      tier.reached
                        ? 'bg-[#D4AF37] text-white shadow-lg scale-110'
                        : 'bg-white border border-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    {tier.label}
                  </div>
                  <div className="flex-1 h-0.5 bg-[#E2E8F0]"></div>
                </div>
              ))}

              {/* Coquillages qui tombent */}
              {fallingShells.map((shell) => (
                <Shell key={shell} delay={shell} />
              ))}
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#006D77]/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#006D77]" />
                </div>
                <p className="text-sm text-[#0F172A]">87</p>
                <p className="text-xs text-[#64748B]">Contributeurs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <p className="text-sm text-[#0F172A]">{percentage}%</p>
                <p className="text-xs text-[#64748B]">Complété</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#0D9488]/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#0D9488]" />
                </div>
                <p className="text-sm text-[#0F172A]">
                  {tiers.filter((t) => t.reached).length}/3
                </p>
                <p className="text-xs text-[#64748B]">Paliers</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Historique des contributions ── */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#E2E8F0] overflow-hidden">
          {/* En-tête */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#006D77]" />
              <h3 className="text-[#0F172A] font-semibold text-sm">Historique des contributions</h3>
              <span className="text-[10px] bg-[#006D77]/10 text-[#006D77] px-2 py-0.5 rounded-full font-bold">
                {CONTRIBUTIONS.length}
              </span>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-2 px-5 py-3 border-b border-[#F1F5F9]">
            {([
              { id: 'tout',           label: 'Tout',          count: CONTRIBUTIONS.length },
              { id: 'investissement', label: 'Investissements', count: CONTRIBUTIONS.filter(c => c.type === 'investissement').length },
              { id: 'don',            label: 'Dons',           count: CONTRIBUTIONS.filter(c => c.type === 'don').length },
            ] as const).map(f => (
              <button
                key={f.id}
                onClick={() => setHistoFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  histoFilter === f.id
                    ? f.id === 'investissement' ? 'bg-[#006D77] text-white'
                      : f.id === 'don'          ? 'bg-[#B05B3B] text-white'
                      : 'bg-[#0F172A] text-white'
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                {f.id === 'investissement' && <TrendingUp className="w-3 h-3" />}
                {f.id === 'don' && <Heart className="w-3 h-3" />}
                {f.label}
                <span className={`text-[10px] font-bold ${histoFilter === f.id ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Résumé financier filtré */}
          {(() => {
            const filtered = histoFilter === 'tout'
              ? CONTRIBUTIONS
              : CONTRIBUTIONS.filter(c => c.type === histoFilter);
            const total = filtered.reduce((s, c) => s + c.montant, 0);
            return (
              <div className="grid grid-cols-2 gap-px bg-[#F1F5F9] border-b border-[#F1F5F9]">
                <div className="bg-white px-5 py-3">
                  <p className="text-[10px] text-[#64748B] mb-0.5">Total collecté</p>
                  <p className="text-base font-bold text-[#0F172A]">{total.toLocaleString()} €</p>
                </div>
                <div className="bg-white px-5 py-3">
                  <p className="text-[10px] text-[#64748B] mb-0.5">Contributeurs</p>
                  <p className="text-base font-bold text-[#0F172A]">{filtered.length}</p>
                </div>
              </div>
            );
          })()}

          {/* Liste */}
          {(() => {
            const filtered = histoFilter === 'tout'
              ? CONTRIBUTIONS
              : CONTRIBUTIONS.filter(c => c.type === histoFilter);
            const visible = histoExpanded ? filtered : filtered.slice(0, 4);
            let lastDate = '';

            return (
              <div>
                {visible.map((c) => {
                  const showDate = c.date !== lastDate;
                  lastDate = c.date;
                  return (
                    <div key={c.id}>
                      {showDate && (
                        <div className="px-5 pt-3 pb-1">
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{c.date}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#F8FAFC] last:border-0">
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                          c.type === 'investissement'
                            ? 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'
                            : 'bg-gradient-to-br from-[#B05B3B] to-[#D4803A]'
                        }`}>
                          {c.initials}
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-sm font-semibold text-[#0F172A] truncate">{c.name}</p>
                            {c.type === 'investissement'
                              ? <TrendingUp className="w-3 h-3 text-[#006D77] flex-shrink-0" />
                              : <Heart className="w-3 h-3 text-[#B05B3B] flex-shrink-0" />
                            }
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              c.type === 'investissement'
                                ? 'bg-[#006D77]/10 text-[#006D77]'
                                : 'bg-[#B05B3B]/10 text-[#B05B3B]'
                            }`}>
                              {c.palier}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">{c.time}</span>
                          </div>
                        </div>

                        {/* Montant */}
                        <p className={`text-sm font-bold flex-shrink-0 ${
                          c.type === 'investissement' ? 'text-[#006D77]' : 'text-[#B05B3B]'
                        }`}>
                          +{c.montant.toLocaleString()} €
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Voir plus / moins */}
                {filtered.length > 4 && (
                  <button
                    onClick={() => setHistoExpanded(!histoExpanded)}
                    className="w-full py-3.5 text-xs font-semibold text-[#006D77] flex items-center justify-center gap-1.5 hover:bg-[#F8FAFC] transition-colors"
                  >
                    {histoExpanded
                      ? <><ChevronUp className="w-3.5 h-3.5 rotate-180" /> Voir moins</>
                      : <><ChevronUp className="w-3.5 h-3.5 rotate-180" /> Voir les {filtered.length - 4} autres</>
                    }
                  </button>
                )}
              </div>
            );
          })()}
        </div>

        {/* Bouton Augmenter les Paliers */}
        <button
          onClick={openPaliersSheet}
          className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <ChevronUp className="w-5 h-5" />
          <span className="font-semibold">Augmenter les Paliers</span>
        </button>
      </div>

      {/* ─── Bottom Sheet Paliers ─── */}
      {showPaliersSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaliersSheet(false)} />

          <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-[#0F172A] font-bold text-lg">Augmenter les Paliers</h2>
                <p className="text-[#64748B] text-xs mt-0.5">Restaurant Lolo Moderne</p>
              </div>
              <button onClick={() => setShowPaliersSheet(false)} className="w-8 h-8 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>

            {/* ── VUE : Paliers actuels ── */}
            {editStep === 'view' && (
              <div className="px-6 py-5 space-y-5">
                <div className="bg-[#FEF9E7] rounded-xl p-4 border border-[#D4AF37]/30 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#92400E]">
                    Augmenter un palier relève l'objectif de collecte pour votre projet. Les contributeurs existants sont notifiés du nouvel objectif.
                  </p>
                </div>

                <div>
                  <p className="text-[#0F172A] font-semibold text-sm mb-3">Paliers actuels</p>
                  <div className="space-y-3">
                    {paliers.map((p, i) => {
                      const reached = currentAmount >= p.montant;
                      const pct = Math.min(100, Math.round((currentAmount / p.montant) * 100));
                      return (
                        <div key={i} className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0]">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{p.icon}</span>
                              <div>
                                <p className="text-sm font-semibold text-[#0F172A]">{p.label}</p>
                                <p className="text-xs text-[#64748B]">{p.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold" style={{ color: p.color }}>{p.montant.toLocaleString()} €</p>
                              {reached ? (
                                <span className="text-[10px] text-green-600 flex items-center gap-1 justify-end">
                                  <CheckCircle2 className="w-3 h-3" /> Atteint
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#94A3B8]">{pct}% collecté</span>
                              )}
                            </div>
                          </div>
                          <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, background: p.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setEditStep('edit')}
                  className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Définir de nouveaux objectifs
                </button>
              </div>
            )}

            {/* ── ÉDITION : Saisie des nouveaux montants ── */}
            {editStep === 'edit' && (
              <div className="px-6 py-5 space-y-5">
                <p className="text-[#64748B] text-sm">
                  Chaque nouveau montant doit être <strong className="text-[#0F172A]">supérieur</strong> au palier actuel et respecter l'ordre croissant.
                </p>

                {[
                  { key: 'p1' as const, palier: paliers[0], placeholder: `Ex: ${(paliers[0].montant * 1.5).toLocaleString()}` },
                  { key: 'p2' as const, palier: paliers[1], placeholder: `Ex: ${(paliers[1].montant * 1.5).toLocaleString()}` },
                  { key: 'p3' as const, palier: paliers[2], placeholder: `Ex: ${(paliers[2].montant * 1.5).toLocaleString()}` },
                ].map(({ key, palier, placeholder }) => (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{palier.icon}</span>
                      <label className="text-sm font-semibold text-[#0F172A]">{palier.label}</label>
                      <span className="ml-auto text-xs text-[#94A3B8] flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Actuel : {palier.montant.toLocaleString()} €
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] font-bold">€</span>
                      <input
                        type="number"
                        value={newMontants[key]}
                        onChange={(e) => {
                          setNewMontants({ ...newMontants, [key]: e.target.value });
                          setErrors({ ...errors, [key]: '' });
                        }}
                        placeholder={placeholder}
                        className={`w-full pl-9 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors[key]
                            ? 'border-red-400 focus:ring-red-300 bg-red-50'
                            : 'border-[#E2E8F0] focus:ring-[#006D77]/40'
                        }`}
                      />
                    </div>
                    {errors[key] && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors[key]}
                      </p>
                    )}
                    {newMontants[key] && !errors[key] && parseFloat(newMontants[key]) > palier.montant && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <ChevronUp className="w-3 h-3" />
                        +{(parseFloat(newMontants[key]) - palier.montant).toLocaleString()} € par rapport à l'actuel
                      </p>
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setEditStep('view')}
                    className="flex-1 bg-[#F1F5F9] text-[#64748B] py-4 rounded-xl font-medium text-sm"
                  >
                    Retour
                  </button>
                  <button
                    onClick={validateAndProceed}
                    className="flex-1 bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl font-semibold text-sm shadow-lg"
                  >
                    Vérifier
                  </button>
                </div>
              </div>
            )}

            {/* ── CONFIRMATION ── */}
            {editStep === 'confirm' && (
              <div className="px-6 py-5 space-y-5">
                <div className="text-center py-2">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#006D77] to-[#0D9488] rounded-full flex items-center justify-center">
                    <ChevronUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-[#0F172A] font-bold text-lg mb-1">Confirmer l'augmentation</h3>
                  <p className="text-[#64748B] text-sm">Les contributeurs seront notifiés des nouveaux objectifs.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { palier: paliers[0], newVal: parseFloat(newMontants.p1) },
                    { palier: paliers[1], newVal: parseFloat(newMontants.p2) },
                    { palier: paliers[2], newVal: parseFloat(newMontants.p3) },
                  ].map(({ palier, newVal }, i) => (
                    <div key={i} className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0]">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{palier.icon}</span>
                        <span className="text-sm font-semibold text-[#0F172A]">{palier.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 text-center bg-white rounded-xl py-2 border border-[#E2E8F0]">
                          <p className="text-[10px] text-[#94A3B8] mb-0.5">Actuel</p>
                          <p className="text-sm font-bold text-[#64748B]">{palier.montant.toLocaleString()} €</p>
                        </div>
                        <ChevronUp className="w-5 h-5 text-[#006D77]" />
                        <div className="flex-1 text-center bg-[#E0F2FE] rounded-xl py-2 border border-[#006D77]/20">
                          <p className="text-[10px] text-[#006D77] mb-0.5">Nouveau</p>
                          <p className="text-sm font-bold text-[#006D77]">{newVal.toLocaleString()} €</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditStep('edit')}
                    className="flex-1 bg-[#F1F5F9] text-[#64748B] py-4 rounded-xl font-medium text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={confirmAugmentation}
                    className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl font-semibold text-sm shadow-lg"
                  >
                    Confirmer ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification de Réussite */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 mx-6 max-w-sm shadow-2xl animate-scaleIn">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-[#0F172A] text-2xl text-center mb-3">Félicitations ! 🎉</h3>
            <p className="text-[#64748B] text-center mb-6">
              L'objectif de 100% a été atteint ! Le pot commun est complet.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fall { animation: fall 3s ease-in forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
      `}</style>
    </div>
  );
}
