import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, Hash, Users, TrendingUp, Flame } from 'lucide-react';

const TERRACOTTA = '#B05B3B';
const TEAL = '#006D77';

const CATEGORIES = ['Tous', 'Finance', 'Immobilier', 'Tech', 'Santé', 'Culture', 'Agriculture', 'Entrepreneuriat'];

const ALL_SALONS = [
  { id: '5', name: 'Finance Caribéenne', members: 521, color: TEAL, category: 'Finance', trending: true, description: 'Épargne, investissement et crypto pour la diaspora' },
  { id: '6', name: 'Santé & Bien-être', members: 98, color: '#8B5CF6', category: 'Santé', trending: false, description: 'Médecine naturelle, sport et équilibre de vie' },
  { id: '7', name: 'Culture & Diaspora', members: 315, color: '#EC4899', category: 'Culture', trending: true, description: 'Art, musique et identité caribéenne' },
  { id: '8', name: 'Agriculture Durable', members: 142, color: '#059669', category: 'Agriculture', trending: false, description: 'Permaculture et agriculture biologique aux Antilles' },
  { id: '9', name: 'Entrepreneurs Caribéens', members: 289, color: TERRACOTTA, category: 'Entrepreneuriat', trending: true, description: 'Créer et développer son entreprise aux Antilles' },
  { id: '10', name: 'Immo Guadeloupe', members: 176, color: '#D97706', category: 'Immobilier', trending: false, description: 'Acheter, louer et investir en Guadeloupe' },
  { id: '11', name: 'IA & Tech Diaspora', members: 203, color: '#3B82F6', category: 'Tech', trending: true, description: 'Nouvelles technologies et opportunités numériques' },
  { id: '12', name: 'Crédit & Épargne', members: 445, color: '#D4AF37', category: 'Finance', trending: false, description: 'Tontines, microfinance et plans d\'épargne' },
];

export default function DecouvrirSalonsScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const filtered = ALL_SALONS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Tous' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const trending = ALL_SALONS.filter(s => s.trending);

  function toggleJoin(id: string) {
    setJoined(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: TERRACOTTA, padding: '14px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>KAURI</p>
            <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800 }}>Découvrir des salons</h1>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={15} color="rgba(255,255,255,0.6)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un salon..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 22, padding: '9px 14px 9px 36px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8ECF0', padding: '12px 0' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0, padding: '6px 14px',
                background: activeCategory === cat ? TERRACOTTA : '#F4F6F8',
                color: activeCategory === cat ? '#fff' : '#64748B',
                border: 'none', borderRadius: 20,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 32px' }}>

        {/* Trending - shown only when no search and "Tous" */}
        {!search && activeCategory === 'Tous' && (
          <div style={{ padding: '16px 16px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Flame size={14} color={TERRACOTTA} />
              <p style={{ margin: 0, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Tendances</p>
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
              {trending.map(salon => (
                <button
                  key={salon.id}
                  onClick={() => navigate(`/kauri/social-hub/salon/${salon.id}`)}
                  style={{
                    flexShrink: 0, width: 140, background: salon.color + '12',
                    border: `1.5px solid ${salon.color}30`, borderRadius: 16,
                    padding: '12px', textAlign: 'left', cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: salon.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <Hash size={18} color={salon.color} />
                  </div>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 13, color: '#1E293B', lineHeight: 1.3 }}>{salon.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Users size={10} />{salon.members}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All results */}
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              {search ? `${filtered.length} résultat${filtered.length !== 1 ? 's' : ''}` : 'Tous les salons'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={12} color="#94A3B8" />
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Popularité</span>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                Aucun salon trouvé pour "{search}"
              </div>
            ) : (
              filtered.map((salon, i) => (
                <div
                  key={salon.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: salon.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Hash size={18} color={salon.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{salon.name}</p>
                      {salon.trending && <Flame size={11} color={TERRACOTTA} />}
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{salon.description}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Users size={10} />{salon.members} membres
                    </p>
                  </div>
                  <button
                    onClick={() => toggleJoin(salon.id)}
                    style={{
                      flexShrink: 0,
                      background: joined.has(salon.id) ? '#F1F5F9' : TERRACOTTA + '14',
                      border: `1px solid ${joined.has(salon.id) ? '#CBD5E1' : TERRACOTTA + '30'}`,
                      borderRadius: 20, padding: '6px 13px',
                      color: joined.has(salon.id) ? '#94A3B8' : TERRACOTTA,
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {joined.has(salon.id) ? 'Rejoint ✓' : 'Rejoindre'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
