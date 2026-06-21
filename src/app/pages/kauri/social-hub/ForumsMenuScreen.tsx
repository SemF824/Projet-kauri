import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, BellOff, Plus, Users, Bookmark, Settings, Flag, HelpCircle, ChevronRight, Search, Hash } from 'lucide-react';
import { useState } from 'react';

const TERRACOTTA = '#B05B3B';
const TEAL = '#006D77';

const MY_SALONS = [
  { id: '1', name: 'Immobilier Antilles', members: 234, color: TEAL, unread: 12 },
  { id: '2', name: 'Tech Diaspora', members: 189, color: '#D4AF37', unread: 8 },
  { id: '3', name: 'Bons Plans Vie Chère', members: 412, color: TERRACOTTA, unread: 0 },
];

const SUGGESTED_SALONS = [
  { id: '5', name: 'Finance Caribéenne', members: 521, color: TEAL },
  { id: '6', name: 'Santé & Bien-être', members: 98, color: '#8B5CF6' },
  { id: '7', name: 'Culture & Diaspora', members: 315, color: '#EC4899' },
  { id: '8', name: 'Agriculture Durable', members: 142, color: '#059669' },
];

export default function ForumsMenuScreen() {
  const navigate = useNavigate();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = [...MY_SALONS, ...SUGGESTED_SALONS].filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <div style={{ background: TERRACOTTA, padding: '14px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>KAURI</p>
            <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800 }}>Paramètres Forums</h1>
          </div>
        </div>

        {/* Barre de recherche */}
        <div style={{ position: 'relative' }}>
          <Search size={15} color="rgba(255,255,255,0.6)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un salon..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 22, padding: '9px 14px 9px 36px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 32px' }}>

        {/* ── ACTIONS RAPIDES ── */}
        {!searchQuery && (
          <div style={{ padding: '16px 16px 8px' }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Actions rapides</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: <Plus size={20} color={TERRACOTTA} />, label: 'Créer un salon', bg: TERRACOTTA + '14', action: () => navigate('/kauri/social-hub/creer-salon') },
                { icon: <Search size={20} color={TEAL} />, label: 'Découvrir', bg: TEAL + '14', action: () => navigate('/kauri/social-hub/decouvrir-salons') },
                { icon: <Bookmark size={20} color='#D4AF37' />, label: 'Sauvegardés', bg: '#D4AF3714', action: () => navigate('/kauri/social-hub/sauvegardes') },
                { icon: notificationsOn ? <Bell size={20} color='#059669' /> : <BellOff size={20} color='#94A3B8' />, label: notificationsOn ? 'Notifs actives' : 'Notifs coupées', bg: notificationsOn ? '#05906914' : '#94A3B814', action: () => setNotificationsOn(v => !v) },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── MES SALONS ── */}
        {!searchQuery && (
          <div style={{ padding: '16px 16px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Mes salons</p>
              <span style={{ fontSize: 12, color: TERRACOTTA, fontWeight: 600 }}>{MY_SALONS.length} rejoints</span>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
              {MY_SALONS.map((salon, i) => (
                <button
                  key={salon.id}
                  onClick={() => navigate(`/kauri/social-hub/salon/${salon.id}`)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none', textAlign: 'left' }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: salon.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hash size={18} color={salon.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{salon.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}><Users size={10} style={{ display: 'inline', marginRight: 3 }} />{salon.members} membres</p>
                  </div>
                  {salon.unread > 0 && (
                    <span style={{ background: TERRACOTTA, color: '#fff', fontSize: 11, fontWeight: 700, minWidth: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{salon.unread}</span>
                  )}
                  <ChevronRight size={16} color="#CBD5E1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── RÉSULTATS RECHERCHE ── */}
        {searchQuery && (
          <div style={{ padding: '16px 16px 8px' }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{filtered.length} résultats</p>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
              {filtered.map((salon, i) => (
                <button
                  key={salon.id}
                  onClick={() => navigate(`/kauri/social-hub/salon/${salon.id}`)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none', textAlign: 'left' }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: salon.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hash size={18} color={salon.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{salon.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{salon.members} membres</p>
                  </div>
                  <ChevronRight size={16} color="#CBD5E1" />
                </button>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                  Aucun salon trouvé pour "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SALONS SUGGÉRÉS ── */}
        {!searchQuery && (
          <div style={{ padding: '16px 16px 8px' }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Salons suggérés</p>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
              {SUGGESTED_SALONS.map((salon, i) => (
                <div
                  key={salon.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: salon.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hash size={18} color={salon.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{salon.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{salon.members} membres</p>
                  </div>
                  <button
                    onClick={() => navigate(`/kauri/social-hub/salon/${salon.id}`)}
                    style={{ background: TERRACOTTA + '14', border: `1px solid ${TERRACOTTA}30`, borderRadius: 20, padding: '5px 12px', color: TERRACOTTA, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Rejoindre
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PARAMÈTRES ── */}
        {!searchQuery && (
          <div style={{ padding: '16px 16px 8px' }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Paramètres</p>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
              {[
                { icon: <Settings size={17} color="#64748B" />, label: 'Préférences de discussion', sub: 'Langue, thème, taille du texte', route: '/kauri/social-hub/preferences-discussion' },
                { icon: <Flag size={17} color="#EF4444" />, label: 'Signaler un abus', sub: 'Modération communautaire', route: '/kauri/social-hub/signaler-abus' },
                { icon: <HelpCircle size={17} color={TEAL} />, label: 'Aide & support', sub: 'FAQ, contacter l\'équipe KAURI', route: '/kauri/social-hub/aide-support' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(item.route)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none', textAlign: 'left' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F4F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{item.sub}</p>
                  </div>
                  <ChevronRight size={16} color="#CBD5E1" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
