import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Flag, Check, AlertTriangle } from 'lucide-react';

const TERRACOTTA = '#B05B3B';

const RAISONS = [
  { id: 'spam', label: 'Spam ou publicité', description: 'Messages commerciaux non sollicités' },
  { id: 'harcelement', label: 'Harcèlement', description: 'Comportement hostile ou intimidant' },
  { id: 'haine', label: 'Discours haineux', description: 'Contenu discriminatoire ou offensant' },
  { id: 'fausses', label: 'Fausses informations', description: 'Désinformation ou contenu trompeur' },
  { id: 'arnaque', label: 'Arnaque / Fraude', description: 'Tentative d\'escroquerie financière' },
  { id: 'autre', label: 'Autre', description: 'Autre type de violation' },
];

const SALONS_LIST = ['Immobilier Antilles', 'Tech Diaspora', 'Finance Caribéenne', 'Santé & Bien-être', 'Culture & Diaspora', 'Autre'];

export default function SignalerAbusSalonScreen() {
  const navigate = useNavigate();
  const [raison, setRaison] = useState('');
  const [salon, setSalon] = useState('');
  const [details, setDetails] = useState('');
  const [step, setStep] = useState<'form' | 'confirm' | 'sent'>('form');

  const isValid = raison !== '' && salon !== '';

  if (step === 'sent') {
    return (
      <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#05906918', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={36} color="#059669" />
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#1E293B', textAlign: 'center' }}>Signalement envoyé</h2>
        <p style={{ margin: '0 0 8px', fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 1.6 }}>
          Notre équipe de modération examine votre signalement sous 24h.
        </p>
        <p style={{ margin: '0 0 32px', fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>
          Référence : #RPT-{Math.random().toString(36).substr(2, 8).toUpperCase()}
        </p>
        <button
          onClick={() => navigate('/kauri/social-hub/forums-menu')}
          style={{ width: '100%', background: TERRACOTTA, color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
        >
          Retour aux forums
        </button>
      </div>
    );
  }

  if (step === 'confirm') {
    const selectedRaison = RAISONS.find(r => r.id === raison);
    return (
      <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#EF444420', padding: '14px 16px 20px', borderBottom: '1px solid #EF444430' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setStep('form')} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowLeft size={18} color="#EF4444" />
            </button>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#EF4444' }}>Confirmer le signalement</h1>
          </div>
        </div>
        <div style={{ flex: 1, padding: '24px 16px' }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8ECF0', padding: '20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <AlertTriangle size={20} color="#EF4444" />
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1E293B' }}>Récapitulatif du signalement</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>Salon signalé</p>
                <p style={{ margin: 0, fontSize: 14, color: '#1E293B', fontWeight: 600 }}>{salon}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>Raison</p>
                <p style={{ margin: 0, fontSize: 14, color: '#1E293B', fontWeight: 600 }}>{selectedRaison?.label}</p>
              </div>
              {details && (
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>Détails</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{details}</p>
                </div>
              )}
            </div>
          </div>
          <p style={{ margin: '0 0 20px', fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 1.5 }}>
            Ce signalement sera examiné de manière confidentielle par notre équipe de modération.
          </p>
          <button
            onClick={() => setStep('sent')}
            style={{ width: '100%', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}
          >
            Confirmer le signalement
          </button>
          <button
            onClick={() => setStep('form')}
            style={{ width: '100%', background: '#fff', color: '#64748B', border: '1px solid #E8ECF0', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            Modifier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: '#EF4444', padding: '14px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Flag size={18} color="#fff" />
            <div>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>KAURI</p>
              <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800 }}>Signaler un abus</h1>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 32px' }}>

        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 14px', marginBottom: 20, display: 'flex', gap: 10 }}>
          <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
            Les signalements abusifs peuvent entraîner des restrictions sur votre compte.
          </p>
        </div>

        {/* Salon */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Salon concerné *</p>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
            {SALONS_LIST.map((s, i) => (
              <button
                key={s}
                onClick={() => setSalon(s)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: salon === s ? '#FEF2F210' : 'none', border: 'none', cursor: 'pointer', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{s}</span>
                {salon === s && <Check size={16} color="#EF4444" />}
              </button>
            ))}
          </div>
        </div>

        {/* Raison */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Type de violation *</p>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
            {RAISONS.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setRaison(r.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: raison === r.id ? '#FEF2F210' : 'none', border: 'none', cursor: 'pointer', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none', textAlign: 'left' }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{r.label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>{r.description}</p>
                </div>
                {raison === r.id && <Check size={16} color="#EF4444" />}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Détails supplémentaires</p>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="Décrivez le comportement problématique..."
            maxLength={500}
            rows={4}
            style={{ width: '100%', background: '#fff', border: '1.5px solid #E8ECF0', borderRadius: 14, padding: '13px 14px', fontSize: 14, color: '#1E293B', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }}
          />
        </div>

        <button
          onClick={() => setStep('confirm')}
          disabled={!isValid}
          style={{
            width: '100%', background: isValid ? '#EF4444' : '#E8ECF0',
            color: isValid ? '#fff' : '#94A3B8',
            border: 'none', borderRadius: 14, padding: '15px',
            fontSize: 15, fontWeight: 700, cursor: isValid ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Flag size={18} />
          Signaler
        </button>
      </div>
    </div>
  );
}
