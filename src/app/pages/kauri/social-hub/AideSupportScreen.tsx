import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, HelpCircle, ChevronRight, ChevronDown, MessageCircle, Mail, ExternalLink } from 'lucide-react';

const TERRACOTTA = '#B05B3B';
const TEAL = '#006D77';

const FAQS = [
  {
    question: "Comment rejoindre un salon ?",
    answer: "Accédez à la section 'Découvrir' depuis le menu Forums, puis cliquez sur 'Rejoindre' sur le salon qui vous intéresse. Vous pouvez immédiatement participer aux discussions.",
  },
  {
    question: "Comment créer un salon communautaire ?",
    answer: "Dans le menu Forums, cliquez sur 'Créer un salon'. Donnez-lui un nom, une description et choisissez sa catégorie. Les salons publics sont accessibles à tous, les salons privés sur invitation uniquement.",
  },
  {
    question: "Comment modérer un salon que j'ai créé ?",
    answer: "En tant que créateur du salon, vous avez accès aux outils de modération via le menu ⋮ dans le salon. Vous pouvez gérer les membres, épingler des messages et exclure des participants.",
  },
  {
    question: "Comment signaler un comportement abusif ?",
    answer: "Depuis le menu Forums, cliquez sur 'Signaler un abus'. Notre équipe de modération examine tous les signalements sous 24 heures et prend les mesures nécessaires.",
  },
  {
    question: "Pourquoi mon message n'apparaît pas ?",
    answer: "Votre message peut avoir été filtré par notre système anti-spam ou retenu pour modération. Si le problème persiste, contactez notre support via le formulaire ci-dessous.",
  },
  {
    question: "Comment désactiver les notifications d'un salon ?",
    answer: "Dans le salon concerné, appuyez sur l'icône de cloche en haut de l'écran pour désactiver les notifications. Vous pouvez aussi gérer toutes les notifications depuis 'Notifs actives' dans le menu Forums.",
  },
];

export default function AideSupportScreen() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!subject.trim() || !message.trim()) return;
    setSent(true);
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: TEAL, padding: '14px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HelpCircle size={18} color="#fff" />
            <div>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>KAURI</p>
              <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800 }}>Aide & Support</h1>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 32px' }}>

        {/* Quick actions */}
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: <MessageCircle size={20} color={TEAL} />, label: 'Chat en direct', sub: 'Réponse en ~5 min', bg: TEAL + '12' },
              { icon: <Mail size={20} color={TERRACOTTA} />, label: 'Email support', sub: 'support@kauri.app', bg: TERRACOTTA + '12' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', padding: '14px 12px' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  {item.icon}
                </div>
                <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 13, color: '#1E293B' }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ padding: '16px 16px 8px' }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Questions fréquentes</p>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', flex: 1, lineHeight: 1.4 }}>{faq.question}</span>
                  {openFaq === i ? <ChevronDown size={16} color={TEAL} /> : <ChevronRight size={16} color="#CBD5E1" />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 16px 14px', background: TEAL + '06' }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div style={{ padding: '16px 16px 8px' }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Contacter l'équipe KAURI</p>
          {sent ? (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8ECF0', padding: '24px', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#05906914', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Mail size={24} color="#059669" />
              </div>
              <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 15, color: '#1E293B' }}>Message envoyé !</p>
              <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>Nous vous répondrons sous 24h ouvrées.</p>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8ECF0', padding: '16px' }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>Sujet</label>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Décrivez brièvement votre problème"
                  style={{ width: '100%', background: '#F4F6F8', border: '1.5px solid #E8ECF0', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Décrivez votre problème en détail..."
                  rows={4}
                  style={{ width: '100%', background: '#F4F6F8', border: '1.5px solid #E8ECF0', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#1E293B', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!subject.trim() || !message.trim()}
                style={{
                  width: '100%', background: subject.trim() && message.trim() ? TEAL : '#E8ECF0',
                  color: subject.trim() && message.trim() ? '#fff' : '#94A3B8',
                  border: 'none', borderRadius: 10, padding: '12px',
                  fontSize: 14, fontWeight: 700, cursor: subject.trim() && message.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Envoyer le message
              </button>
            </div>
          )}
        </div>

        {/* Footer link */}
        <div style={{ padding: '8px 16px' }}>
          <button style={{ width: '100%', background: '#fff', border: '1px solid #E8ECF0', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>Centre d'aide complet</span>
            <ExternalLink size={16} color="#94A3B8" />
          </button>
        </div>
      </div>
    </div>
  );
}
