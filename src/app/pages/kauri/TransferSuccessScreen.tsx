import { useNavigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { Home, Download, RefreshCw, Share2, Copy, CheckCheck } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

function formatAmount(amount: string) {
  const n = parseFloat(amount);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

function formatDateTime() {
  const now = new Date();
  return now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    + ' · '
    + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function TransferSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  const {
    amount = '0',
    recipient = '',
    message = '',
    transactionId = 'KAU-XXXXXX',
    avatarInitials = '??',
  } = (location.state as {
    amount: string; recipient: string; message: string;
    transactionId: string; avatarInitials: string;
  }) || {};

  const [mounted, setMounted] = useState(false);
  const [ringScale, setRingScale] = useState(0);
  const [checkVisible, setCheckVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 50);
    const t2 = setTimeout(() => setRingScale(1), 100);
    const t3 = setTimeout(() => setCheckVisible(true), 400);
    const t4 = setTimeout(() => setContentVisible(true), 650);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const dateTime = formatDateTime();
  const bg = isDarkMode ? '#0F172A' : '#F0FDF4';
  const cardBg = isDarkMode ? '#1E293B' : '#FFFFFF';
  const cardBorder = isDarkMode ? '#334155' : '#D1FAE5';
  const textMain = isDarkMode ? '#F8FAFC' : '#0F172A';
  const textMuted = isDarkMode ? '#94A3B8' : '#64748B';

  return (
    <div style={{
      minHeight: '100dvh', background: bg,
      maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      opacity: mounted ? 1 : 0, transition: 'opacity 0.3s',
    }}>

      {/* Hero success section */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(160deg, #059669 0%, #10B981 50%, #34D399 100%)',
        padding: '56px 20px 48px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          border: '40px solid rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 160, height: 160, borderRadius: '50%',
          border: '30px solid rgba(255,255,255,0.06)',
        }} />

        {/* Animated checkmark circle */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          transform: `scale(${ringScale})`,
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        }}>
          {/* Pulse ring */}
          <div style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.25)',
            animation: checkVisible ? 'pulse-ring 2s ease-out infinite' : 'none',
          }} />
          <div style={{
            opacity: checkVisible ? 1 : 0,
            transform: checkVisible ? 'scale(1)' : 'scale(0.3)',
            transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <path
                d="M14 26 L22 34 L38 18"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 40,
                  strokeDashoffset: checkVisible ? 0 : 40,
                  transition: 'stroke-dashoffset 0.5s ease 0.1s',
                }}
              />
            </svg>
          </div>
        </div>

        <h1 style={{
          margin: 0, color: '#fff', fontSize: 26, fontWeight: 900, textAlign: 'center',
          opacity: checkVisible ? 1 : 0, transform: checkVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s',
        }}>
          Transfert réussi !
        </h1>
        <p style={{
          margin: '6px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center',
          opacity: checkVisible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.35s',
        }}>
          L'argent est en route vers {recipient}
        </p>

        {/* Big amount */}
        <div style={{
          marginTop: 28,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          borderRadius: 20, padding: '16px 32px',
          border: '1px solid rgba(255,255,255,0.25)',
          opacity: checkVisible ? 1 : 0,
          transform: checkVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.4s ease 0.45s, transform 0.4s ease 0.45s',
        }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 40, fontWeight: 900, textAlign: 'center', lineHeight: 1 }}>
            {formatAmount(amount)}<span style={{ fontSize: 22, fontWeight: 700, marginLeft: 3 }}>€</span>
          </p>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center' }}>
            envoyé à <strong style={{ color: '#fff' }}>{recipient}</strong>
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, width: '100%', padding: '20px 16px 32px',
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>

        {/* Receipt card */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 24, overflow: 'hidden', marginBottom: 16,
          boxShadow: isDarkMode ? 'none' : '0 4px 20px rgba(5,150,105,0.08)',
        }}>
          {/* Dashed divider */}
          <div style={{
            height: 1,
            backgroundImage: `repeating-linear-gradient(to right, ${isDarkMode ? '#334155' : '#D1FAE5'} 0px, ${isDarkMode ? '#334155' : '#D1FAE5'} 8px, transparent 8px, transparent 16px)`,
            margin: '0',
          }} />

          <div style={{ padding: '20px' }}>
            <p style={{ margin: '0 0 14px', fontSize: 11, color: textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Reçu de transaction
            </p>

            {[
              { label: 'Destinataire', value: recipient },
              { label: 'Montant', value: `${formatAmount(amount)} €`, highlight: true },
              ...(message ? [{ label: 'Note', value: `"${message}"` }] : []),
              { label: 'Date', value: dateTime },
              { label: 'Réseau', value: 'KAURI Chain · Instantané' },
              { label: 'Statut', value: 'Confirmé ✓', green: true },
            ].map((row: any, i, arr) => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                paddingBottom: i < arr.length - 1 ? 12 : 0,
                marginBottom: i < arr.length - 1 ? 12 : 0,
                borderBottom: i < arr.length - 1 ? `1px solid ${isDarkMode ? '#1E293B' : '#F0FDF4'}` : 'none',
              }}>
                <span style={{ fontSize: 13, color: textMuted, flexShrink: 0 }}>{row.label}</span>
                <span style={{
                  fontSize: 13, fontWeight: 700, textAlign: 'right', maxWidth: '60%',
                  color: row.highlight ? '#D4AF37' : row.green ? '#059669' : textMain,
                }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Transaction ID */}
          <div style={{
            background: isDarkMode ? '#0F172A' : '#F0FDF4',
            borderTop: `1px dashed ${isDarkMode ? '#334155' : '#A7F3D0'}`,
            padding: '14px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 10, color: textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ID Transaction</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: textMain, fontFamily: 'monospace' }}>{transactionId}</p>
            </div>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: copied ? '#059669' : isDarkMode ? '#1E293B' : '#fff',
                border: `1px solid ${copied ? '#059669' : isDarkMode ? '#334155' : '#D1FAE5'}`,
                borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
                color: copied ? '#fff' : '#059669', fontSize: 12, fontWeight: 700,
                transition: 'all 0.2s',
              }}
            >
              {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <button
            onClick={handleShare}
            style={{
              flex: 1, padding: '14px', borderRadius: 14,
              border: `1px solid ${isDarkMode ? '#334155' : '#D1FAE5'}`,
              background: isDarkMode ? '#1E293B' : '#fff',
              color: shared ? '#059669' : textMuted,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'color 0.2s',
            }}
          >
            {shared ? <CheckCheck size={16} /> : <Share2 size={16} />}
            {shared ? 'Partagé !' : 'Partager'}
          </button>
          <button
            onClick={() => {}}
            style={{
              flex: 1, padding: '14px', borderRadius: 14,
              border: `1px solid ${isDarkMode ? '#334155' : '#D1FAE5'}`,
              background: isDarkMode ? '#1E293B' : '#fff',
              color: textMuted, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Download size={16} />
            Reçu PDF
          </button>
        </div>

        <button
          onClick={() => navigate('/kauri/send-money')}
          style={{
            width: '100%', padding: '14px', borderRadius: 14,
            border: `1px solid ${isDarkMode ? '#334155' : '#D1FAE5'}`,
            background: isDarkMode ? '#1E293B' : '#fff',
            color: '#059669', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 12,
          }}
        >
          <RefreshCw size={16} />
          Faire un autre transfert
        </button>

        <button
          onClick={() => navigate('/kauri/normal-dashboard')}
          style={{
            width: '100%', padding: '16px', borderRadius: 16,
            border: 'none',
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 4px 20px rgba(5,150,105,0.3)',
          }}
        >
          <Home size={18} />
          Retour à l'accueil
        </button>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          70% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
