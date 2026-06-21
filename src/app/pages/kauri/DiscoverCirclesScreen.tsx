import { ArrowLeft, Search, Lock, Users, TrendingUp, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export interface Circle {
  id: string;
  name: string;
  description: string;
  contribution: number;
  finalPot: number;
  duration: number;
  scoreRequired: number | null;
  currentMembers: number;
  maxMembers: number;
  fillPercentage: number;
  status: 'active' | 'accessible' | 'locked';
  isUserEligible: boolean;
  tags: string[];
  nextStartDate: string;
  organizer: string;
  rules: string[];
}

export const ALL_CIRCLES: Circle[] = [
  {
    id: '1',
    name: 'Cercle Horizon 50',
    description: 'Épargne mensuelle solidaire ouverte à tous les membres vérifiés avec un score de confiance de 75+.',
    contribution: 50,
    finalPot: 500,
    duration: 10,
    scoreRequired: 75,
    currentMembers: 6,
    maxMembers: 10,
    fillPercentage: 60,
    status: 'active',
    isUserEligible: true,
    tags: ['Populaire', 'Recommandé'],
    nextStartDate: 'Août 2026',
    organizer: 'KAURI Community',
    rules: [
      'Cotisation mensuelle de 50 € le 5 de chaque mois',
      'Score de confiance minimum 75 requis',
      'Ordre de réception par tirage au sort initial',
      'Pénalité de 5% en cas de retard de paiement',
      'Sortie anticipée non autorisée',
    ],
  },
  {
    id: '2',
    name: 'Tontine Jeunes Actifs',
    description: 'Cercle ouvert sans condition de score, idéal pour commencer votre épargne communautaire.',
    contribution: 30,
    finalPot: 300,
    duration: 10,
    scoreRequired: null,
    currentMembers: 8,
    maxMembers: 10,
    fillPercentage: 80,
    status: 'accessible',
    isUserEligible: true,
    tags: ['Sans score', 'Débutant'],
    nextStartDate: 'Juillet 2026',
    organizer: 'KAURI Community',
    rules: [
      'Cotisation mensuelle de 30 € le 1er de chaque mois',
      'Ouvert à tous sans condition de score',
      'Ordre de réception défini lors du lancement',
      'Smart contract KAURI sécurisé',
      'Retrait anticipé possible avec accord du groupe',
    ],
  },
  {
    id: '3',
    name: 'Cercle Élite Kauri',
    description: "Cercle premium réservé aux membres avec un score d'excellence. Rendements et discipline maximaux.",
    contribution: 200,
    finalPot: 2000,
    duration: 10,
    scoreRequired: 90,
    currentMembers: 3,
    maxMembers: 10,
    fillPercentage: 30,
    status: 'locked',
    isUserEligible: false,
    tags: ['Élite', 'Premium'],
    nextStartDate: 'Septembre 2026',
    organizer: 'KAURI Élite',
    rules: [
      'Cotisation mensuelle de 200 € le 1er de chaque mois',
      'Score de confiance minimum 90 requis',
      'Accès réservé aux membres vérifiés Pro',
      'Garantie KAURI sur les fonds',
      'Rendement prioritaire pour les membres anciens',
    ],
  },
  {
    id: '4',
    name: 'Cercle Antilles 100',
    description: 'Groupe de solidarité communautaire pour la diaspora antillaise. Épargne mensuelle de 100 €.',
    contribution: 100,
    finalPot: 1000,
    duration: 10,
    scoreRequired: 70,
    currentMembers: 4,
    maxMembers: 10,
    fillPercentage: 40,
    status: 'active',
    isUserEligible: true,
    tags: ['Diaspora', 'Solidarité'],
    nextStartDate: 'Août 2026',
    organizer: 'Communauté Antilles',
    rules: [
      'Cotisation mensuelle de 100 € le 5 de chaque mois',
      'Score de confiance minimum 70 requis',
      'Priorité aux membres de la diaspora antillaise',
      'Smart contract KAURI sécurisé',
      "Tirage au sort pour l'ordre de réception",
    ],
  },
  {
    id: '5',
    name: 'Épargne Famille',
    description: "Cercle familial dédié à l'épargne sur le long terme. Ouvert à toute la famille.",
    contribution: 75,
    finalPot: 750,
    duration: 10,
    scoreRequired: null,
    currentMembers: 5,
    maxMembers: 10,
    fillPercentage: 50,
    status: 'accessible',
    isUserEligible: true,
    tags: ['Famille', 'Sans score'],
    nextStartDate: 'Juillet 2026',
    organizer: 'KAURI Community',
    rules: [
      'Cotisation mensuelle de 75 € le 10 de chaque mois',
      'Ouvert à tous sans condition de score',
      'Idéal pour les projets familiaux',
      'Escrow KAURI sécurisé',
      "Ordre de priorité défini à l'inscription",
    ],
  },
];

const CONTRIBUTION_OPTIONS = [25, 30, 50, 75, 100, 200];
const DURATION_OPTIONS = [6, 10, 12];
const SCORE_OPTIONS = [null, 70, 75, 90];

export function DiscoverCirclesScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterContrib, setFilterContrib] = useState<number | null>(null);
  const [filterDuration, setFilterDuration] = useState<number | null>(null);
  const [filterScore, setFilterScore] = useState<number | null | 'none'>('none'); // 'none' = no filter
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const userScore = 75;

  const filtered = ALL_CIRCLES.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.tags.join(' ').toLowerCase().includes(q) && !String(c.contribution).includes(q)) {
        return false;
      }
    }
    if (filterContrib !== null && c.contribution !== filterContrib) return false;
    if (filterDuration !== null && c.duration !== filterDuration) return false;
    if (filterScore !== 'none') {
      if (filterScore === null && c.scoreRequired !== null) return false;
      if (typeof filterScore === 'number' && c.scoreRequired !== filterScore) return false;
    }
    return true;
  });

  const activeFilterCount = [filterContrib, filterDuration, filterScore !== 'none' ? filterScore : undefined].filter(v => v !== undefined && v !== null).length + (filterScore === null ? 1 : 0);

  function clearFilters() {
    setFilterContrib(null);
    setFilterDuration(null);
    setFilterScore('none');
    setSearchQuery('');
  }

  return (
    <div className="flex justify-center items-stretch min-h-screen bg-[#D6D6D6]">
      <div className="w-full max-w-[430px] h-screen flex flex-col overflow-hidden shadow-2xl bg-[#F9F9F9] relative">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-4 pt-10 pb-5 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Retour</span>
            </button>
            <button
              onClick={() => setShowFilterSheet(true)}
              className="relative flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtres
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#B05B3B] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white mb-1">Découvrir</h1>
            <p className="text-xs text-white/80">
              Épargnez en toute sécurité avec les garants de la communauté.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un cercle (Ex: Antilles, 50€...)"
              className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-white/70" />
              </button>
            )}
          </div>

          {/* Active filter chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {filterContrib !== null && (
              <button
                onClick={() => setFilterContrib(null)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#B05B3B] text-white"
              >
                Mise : {filterContrib}€
                <X className="w-3 h-3" />
              </button>
            )}
            {filterDuration !== null && (
              <button
                onClick={() => setFilterDuration(null)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#B05B3B] text-white"
              >
                Durée : {filterDuration} mois
                <X className="w-3 h-3" />
              </button>
            )}
            {filterScore === null && (
              <button
                onClick={() => setFilterScore('none')}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#B05B3B] text-white"
              >
                Sans score
                <X className="w-3 h-3" />
              </button>
            )}
            {typeof filterScore === 'number' && (
              <button
                onClick={() => setFilterScore('none')}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#B05B3B] text-white"
              >
                Score : {filterScore}+
                <X className="w-3 h-3" />
              </button>
            )}
            {activeFilterCount === 0 && (
              <span className="text-white/50 text-xs flex-shrink-0">Tous les cercles affichés</span>
            )}
          </div>
        </div>

        {/* Circle list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#94A3B8] text-sm font-medium mb-1">Aucun cercle trouvé</p>
              <p className="text-xs text-[#CBD5E1]">Essayez d'autres critères</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[#006D77] text-xs font-semibold underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filtered.map((circle) => {
              const isLocked = !circle.isUserEligible && !!circle.scoreRequired && userScore < circle.scoreRequired;
              const isElite = circle.scoreRequired !== null && circle.scoreRequired >= 90;

              return (
                <div
                  key={circle.id}
                  className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all ${isLocked ? 'opacity-70' : ''} ${isElite ? 'border-2 border-[#D4AF37]' : 'border border-gray-200'}`}
                >
                  {/* Tags */}
                  {circle.tags.length > 0 && (
                    <div className="px-4 pt-3 flex gap-1.5 flex-wrap">
                      {circle.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: isElite ? '#D4AF3715' : '#006D7710',
                            color: isElite ? '#B8860B' : '#006D77',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Header */}
                  <div className="px-4 pt-2.5 pb-3 flex items-start justify-between">
                    <h3 className="text-base font-bold text-[#006D77] flex-1 leading-snug">{circle.name}</h3>
                    {circle.scoreRequired !== null ? (
                      <div className="flex-shrink-0 px-2.5 py-1 rounded-md bg-[#B05B3B] ml-2">
                        <p className="text-[10px] font-bold text-white uppercase tracking-wide">
                          SCORE REQUIS : {circle.scoreRequired}+
                        </p>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 px-2.5 py-1 rounded-md bg-gray-400 ml-2">
                        <p className="text-[10px] font-bold text-white uppercase tracking-wide">
                          SCORE : AUCUN
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Financials */}
                  <div className="px-4 pb-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xl font-bold text-[#006D77]">{circle.contribution} €</p>
                      <p className="text-[11px] text-[#64748B]">Cotisation / mois</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#D4AF37]">{circle.finalPot} €</p>
                      <p className="text-[11px] text-[#64748B]">Pot Final Épargné</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="px-4 pb-4">
                    <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${circle.fillPercentage}%`,
                          backgroundColor: isElite ? '#D4AF37' : '#006D77',
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-[#64748B] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {circle.currentMembers} membres inscrits sur {circle.maxMembers} • Reste{' '}
                      {circle.maxMembers - circle.currentMembers} places
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="px-4 pb-4">
                    {isLocked ? (
                      <button
                        disabled
                        className="w-full py-3.5 rounded-xl bg-gray-200 text-[#94A3B8] font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                        Verrouillé (Score insuffisant)
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          navigate('/kauri/cercle-detail', {
                            state: { circleId: circle.id },
                          })
                        }
                        className="w-full py-3.5 rounded-xl text-white font-medium text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: circle.status === 'accessible' ? '#B05B3B' : '#006D77',
                        }}
                      >
                        {circle.status === 'accessible' ? 'Postuler' : 'Rejoindre le Cercle'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Trust score tip */}
          <div className="bg-white rounded-xl px-4 py-3 border border-[#D4AF37]/30 mb-2">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#006D77] text-sm mb-1">Améliorez votre Score de Confiance</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Participez régulièrement aux tontines et respectez vos engagements pour débloquer
                  les cercles Élite et bénéficier de meilleures opportunités d'épargne.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bottom sheet */}
        {showFilterSheet && (
          <div className="absolute inset-0 z-50 flex flex-col">
            <button className="flex-1 bg-black/40" onClick={() => setShowFilterSheet(false)} />
            <div className="bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-[#0F172A]">Filtrer les cercles</h3>
                <button onClick={() => setShowFilterSheet(false)}>
                  <X className="w-5 h-5 text-[#94A3B8]" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Contribution */}
                <div>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2.5">Cotisation mensuelle</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterContrib(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterContrib === null ? 'bg-[#006D77] text-white border-[#006D77]' : 'border-gray-200 text-[#64748B]'}`}
                    >
                      Tous
                    </button>
                    {CONTRIBUTION_OPTIONS.map((v) => (
                      <button
                        key={v}
                        onClick={() => setFilterContrib(filterContrib === v ? null : v)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterContrib === v ? 'bg-[#006D77] text-white border-[#006D77]' : 'border-gray-200 text-[#64748B]'}`}
                      >
                        {v} €
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2.5">Durée</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterDuration(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterDuration === null ? 'bg-[#006D77] text-white border-[#006D77]' : 'border-gray-200 text-[#64748B]'}`}
                    >
                      Toutes
                    </button>
                    {DURATION_OPTIONS.map((v) => (
                      <button
                        key={v}
                        onClick={() => setFilterDuration(filterDuration === v ? null : v)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterDuration === v ? 'bg-[#006D77] text-white border-[#006D77]' : 'border-gray-200 text-[#64748B]'}`}
                      >
                        {v} mois
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2.5">Score requis</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterScore('none')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterScore === 'none' ? 'bg-[#006D77] text-white border-[#006D77]' : 'border-gray-200 text-[#64748B]'}`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setFilterScore(filterScore === null ? 'none' : null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterScore === null ? 'bg-[#006D77] text-white border-[#006D77]' : 'border-gray-200 text-[#64748B]'}`}
                    >
                      Sans score
                    </button>
                    {SCORE_OPTIONS.filter((v): v is number => typeof v === 'number').map((v) => (
                      <button
                        key={v}
                        onClick={() => setFilterScore(filterScore === v ? 'none' : v)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterScore === v ? 'bg-[#006D77] text-white border-[#006D77]' : 'border-gray-200 text-[#64748B]'}`}
                      >
                        {v}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#64748B]"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setShowFilterSheet(false)}
                  className="flex-1 py-3 rounded-xl bg-[#006D77] text-white text-sm font-semibold"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
