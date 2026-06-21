import { ArrowLeft, Shield, ChevronRight, Lock, AlertCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

function formatAmount(amount: string) {
  const n = parseFloat(amount);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

export function TransferConfirmScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  const { amount = '0', recipient = '', message = '' } = (location.state as { amount: string; recipient: string; message: string }) || {};

  const [isConfirming, setIsConfirming] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState(false);

  const fees = parseFloat(amount) >= 1 ? 0 : 0;
  const total = parseFloat(amount) || 0;
  const isExternal = !recipient.startsWith('@') && !['Marie C.', 'Pierre D.', 'Sophie L.'].includes(recipient);
  const feeAmount = isExternal ? 0.5 : 0;

  const avatarInitials = recipient
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleDigit = (d: string) => {
    if (pinDigits.length >= 4) return;
    const next = [...pinDigits, d];
    setPinDigits(next);
    setPinError(false);
    if (next.length === 4) {
      setTimeout(() => confirmTransfer(next.join('')), 200);
    }
  };

  const handleDelete = () => {
    setPinDigits(prev => prev.slice(0, -1));
    setPinError(false);
  };

  const confirmTransfer = (pin: string) => {
    if (pin !== '1234') {
      setPinError(true);
      setPinDigits([]);
      return;
    }
    setIsConfirming(true);
    const txId = 'KAU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setTimeout(() => {
      navigate('/kauri/transfer-success', {
        state: { amount, recipient, message, transactionId: txId, avatarInitials },
        replace: true,
      });
    }, 800);
  };

  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = isDarkMode ? '#1E293B' : '#FFFFFF';
  const cardBorder = isDarkMode ? '#334155' : '#E8ECF0';
  const textMain = isDarkMode ? '#F8FAFC' : '#0F172A';
  const textMuted = isDarkMode ? '#94A3B8' : '#64748B';
  const textSub = isDarkMode ? '#64748B' : '#94A3B8';

  return (
    <div style={{ minHeight: '100dvh', background: bg, maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
        padding: '48px 20px 24px',
        position: 'relative',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 52, left: 20,
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} color="#fff" />
        </button>

        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            border: '2px solid rgba(255,255,255,0.4)',
          }}>
            <Shield size={24} color="#fff" />
          </div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 800 }}>Confirmer le transfert</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Vérifiez les détails avant d'envoyer</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 32px' }}>

        {/* Amount hero */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 20, padding: '24px 20px', textAlign: 'center', marginBottom: 12,
          boxShadow: isDarkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Montant envoyé
          </p>
          <p style={{ margin: 0, fontSize: 48, fontWeight: 900, color: '#D4AF37', lineHeight: 1.1 }}>
            {formatAmount(amount)}<span style={{ fontSize: 28, fontWeight: 700, marginLeft: 4 }}>€</span>
          </p>
          {feeAmount > 0 && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: textSub }}>
              + {feeAmount.toFixed(2)}€ de frais · Total : {(total + feeAmount).toFixed(2)}€
            </p>
          )}
          {feeAmount === 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: '#DCFCE7', borderRadius: 20, padding: '3px 10px', marginTop: 8,
            }}>
              <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 700 }}>✓ Transfert gratuit entre membres</span>
            </div>
          )}
        </div>

        {/* Recipient */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 20, padding: '16px 20px', marginBottom: 12,
          boxShadow: isDarkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, color: textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Destinataire</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #006D77, #0D9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0,
            }}>
              {avatarInitials || <User size={22} color="#fff" />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: textMain }}>{recipient}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: textSub }}>Membre KAURI vérifié ✓</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message ? (
          <div style={{
            background: cardBg, border: `1px solid ${cardBorder}`,
            borderRadius: 20, padding: '16px 20px', marginBottom: 12,
          }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message</p>
            <p style={{ margin: 0, fontSize: 14, color: textMain, lineHeight: 1.5, fontStyle: 'italic' }}>"{message}"</p>
          </div>
        ) : null}

        {/* Details breakdown */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 20, padding: '16px 20px', marginBottom: 12,
        }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, color: textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Détails</p>
          {[
            { label: 'Montant', value: `${formatAmount(amount)} €` },
            { label: 'Frais', value: feeAmount === 0 ? 'Gratuit' : `${feeAmount.toFixed(2)} €` },
            { label: 'Délai', value: 'Instantané' },
            { label: 'Réseau', value: 'KAURI Chain' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingBottom: i < arr.length - 1 ? 10 : 0,
              marginBottom: i < arr.length - 1 ? 10 : 0,
              borderBottom: i < arr.length - 1 ? `1px solid ${cardBorder}` : 'none',
            }}>
              <span style={{ fontSize: 13, color: textMuted }}>{row.label}</span>
              <span style={{
                fontSize: 13, fontWeight: 700,
                color: row.label === 'Frais' && feeAmount === 0 ? '#16A34A' : textMain,
              }}>{row.value}</span>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 12, borderTop: `2px solid ${isDarkMode ? '#334155' : '#E8ECF0'}`, marginTop: 6,
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: textMain }}>Total débité</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#D4AF37' }}>{(total + feeAmount).toFixed(2)} €</span>
          </div>
        </div>

        {/* Security notice */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: isDarkMode ? 'rgba(212,175,55,0.08)' : '#FFFBEB',
          border: `1px solid ${isDarkMode ? 'rgba(212,175,55,0.2)' : '#FDE68A'}`,
          borderRadius: 14, padding: '12px 16px', marginBottom: 24,
        }}>
          <Lock size={16} color="#D4AF37" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 12, color: isDarkMode ? '#FDE68A' : '#92400E', lineHeight: 1.5 }}>
            Ce transfert est <strong>chiffré de bout en bout</strong> et sécurisé par la blockchain KAURI.
          </p>
        </div>

        {/* PIN Pad */}
        {!showPin ? (
          <button
            onClick={() => setShowPin(true)}
            disabled={isConfirming}
            style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #006D77, #0D9488)',
              color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 4px 20px rgba(0,109,119,0.35)',
              opacity: isConfirming ? 0.7 : 1,
            }}
          >
            <Lock size={18} color="#fff" />
            Confirmer avec mon code PIN
          </button>
        ) : (
          <div style={{
            background: cardBg, border: `1px solid ${cardBorder}`,
            borderRadius: 24, padding: '24px 20px',
            boxShadow: isDarkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <p style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 700, color: textMain, textAlign: 'center' }}>
              Entrez votre code PIN
            </p>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: pinError
                    ? '#EF4444'
                    : i < pinDigits.length
                    ? '#006D77'
                    : isDarkMode ? '#334155' : '#E2E8F0',
                  transition: 'background 0.15s',
                  transform: pinError ? 'scale(1.2)' : 'scale(1)',
                }} />
              ))}
            </div>

            {pinError && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
                <AlertCircle size={14} color="#EF4444" />
                <p style={{ margin: 0, fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Code incorrect. Réessayez.</p>
              </div>
            )}

            {/* Numpad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
                <button
                  key={i}
                  onClick={() => d === '⌫' ? handleDelete() : d ? handleDigit(d) : null}
                  disabled={isConfirming || d === ''}
                  style={{
                    height: 60, borderRadius: 14, border: 'none',
                    background: d === '⌫'
                      ? isDarkMode ? '#1E293B' : '#FEE2E2'
                      : d === ''
                      ? 'transparent'
                      : isDarkMode ? '#334155' : '#F1F5F9',
                    color: d === '⌫' ? '#EF4444' : textMain,
                    fontSize: d === '⌫' ? 18 : 22,
                    fontWeight: 700,
                    cursor: d ? 'pointer' : 'default',
                    transition: 'transform 0.1s, background 0.1s',
                    opacity: isConfirming ? 0.5 : 1,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            <p style={{ margin: '16px 0 0', fontSize: 11, color: textSub, textAlign: 'center' }}>
              Code de démonstration : 1234
            </p>
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          style={{
            width: '100%', padding: '14px', borderRadius: 14, border: `1px solid ${cardBorder}`,
            background: 'transparent', color: textMuted, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', marginTop: 12,
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
