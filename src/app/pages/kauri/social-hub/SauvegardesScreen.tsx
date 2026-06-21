import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Hash, Users, Bookmark, BookmarkX, ChevronRight, MessageCircle } from 'lucide-react';

const TERRACOTTA = '#B05B3B';
const TEAL = '#006D77';

const SAVED_MESSAGES = [
  { id: 'msg1', author: 'Sophie Laurent', salon: 'Immobilier Antilles', color: TEAL, text: 'La rentabilité locative en Martinique tourne autour de 5 à 7% selon les secteurs. C\'est très intéressant pour les diaspora.', time: 'Il y a 2h', salonId: '1' },
  { id: 'msg2', author: 'Jean-Baptiste Fond', salon: 'Finance Caribéenne', color: '#D4AF37', text: 'Le taux de crédit immobilier en Antilles est actuellement autour de 3.2%. Beaucoup plus avantageux qu\'en métropole !', time: 'Hier', salonId: '5' },
  { id: 'msg3', author: 'Isabelle Moutoussamy', salon: 'Tech Diaspora', color: '#3B82F6', text: 'Super ressource pour apprendre React Native en 2024 : reactnative.dev/docs/getting-started — gratuit et très complet.', time: 'Il y a 3j', salonId: '2' },
];

const SAVED_SALONS = [
  { id: '5', name: 'Finance Caribéenne', members: 521, color: TEAL, description: 'Épargne, investissement et crypto' },
  { id: '7', name: 'Culture & Diaspora', members: 315, color: '#EC4899', description: 'Art, musique et identité caribéenne' },
];

export default function SauvegardesScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'salons' | 'messages'>('salons');
  const [savedSalons, setSavedSalons] = useState(SAVED_SALONS);
  const [savedMessages, setSavedMessages] = useState(SAVED_MESSAGES);

  function removeSalon(id: string) {
    setSavedSalons(prev => prev.filter(s => s.id !== id));
  }

  function removeMessage(id: string) {
    setSavedMessages(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: TERRACOTTA, padding: '14px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>KAURI</p>
            <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800 }}>Sauvegardés</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8ECF0', display: 'flex', padding: '0 16px' }}>
        {[
          { key: 'salons', label: 'Salons', count: savedSalons.length, icon: <Hash size={14} /> },
          { key: 'messages', label: 'Messages', count: savedMessages.length, icon: <MessageCircle size={14} /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as 'salons' | 'messages')}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '13px 0', border: 'none', background: 'transparent', cursor: 'pointer',
              borderBottom: `2.5px solid ${tab === t.key ? TERRACOTTA : 'transparent'}`,
              color: tab === t.key ? TERRACOTTA : '#94A3B8', fontWeight: 700, fontSize: 13,
            }}
          >
            {t.icon}
            {t.label}
            <span style={{ background: tab === t.key ? TERRACOTTA : '#E8ECF0', color: tab === t.key ? '#fff' : '#94A3B8', borderRadius: 10, padding: '0 6px', fontSize: 11, fontWeight: 700 }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 32px' }}>

        {tab === 'salons' && (
          savedSalons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#94A3B8' }}>
              <Bookmark size={40} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: 0, fontSize: 14 }}>Aucun salon sauvegardé</p>
              <button
                onClick={() => navigate('/kauri/social-hub/decouvrir')}
                style={{ marginTop: 16, background: TERRACOTTA + '14', border: `1px solid ${TERRACOTTA}30`, borderRadius: 20, padding: '8px 18px', color: TERRACOTTA, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Découvrir des salons
              </button>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
              {savedSalons.map((salon, i) => (
                <div key={salon.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: salon.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Hash size={18} color={salon.color} />
                  </div>
                  <button
                    onClick={() => navigate(`/kauri/social-hub/salon/${salon.id}`)}
                    style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{salon.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94A3B8' }}>
                      <Users size={10} style={{ display: 'inline', marginRight: 3 }} />{salon.members} membres · {salon.description}
                    </p>
                  </button>
                  <button
                    onClick={() => removeSalon(salon.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                    title="Retirer des sauvegardés"
                  >
                    <BookmarkX size={18} color="#CBD5E1" />
                  </button>
                  <ChevronRight size={16} color="#CBD5E1" />
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'messages' && (
          savedMessages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#94A3B8' }}>
              <MessageCircle size={40} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: 0, fontSize: 14 }}>Aucun message sauvegardé</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {savedMessages.map(msg => (
                <div key={msg.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8ECF0', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: msg.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: msg.color }}>
                        {msg.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{msg.author}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>dans #{msg.salon} · {msg.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMessage(msg.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                    >
                      <BookmarkX size={16} color="#CBD5E1" />
                    </button>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{msg.text}</p>
                  <button
                    onClick={() => navigate(`/kauri/social-hub/salon/${msg.salonId}`)}
                    style={{ background: TERRACOTTA + '10', border: `1px solid ${TERRACOTTA}20`, borderRadius: 10, padding: '6px 12px', color: TERRACOTTA, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Voir dans le salon →
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
