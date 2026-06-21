import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Hash, Users, Lock, Globe, ChevronRight, Check } from 'lucide-react';

const TERRACOTTA = '#B05B3B';
const TEAL = '#006D77';

const CATEGORIES = [
  { id: 'finance', label: 'Finance & Investissement', color: TEAL },
  { id: 'immobilier', label: 'Immobilier', color: '#8B5CF6' },
  { id: 'tech', label: 'Tech & Innovation', color: '#3B82F6' },
  { id: 'sante', label: 'Santé & Bien-être', color: '#059669' },
  { id: 'culture', label: 'Culture & Diaspora', color: '#EC4899' },
  { id: 'agriculture', label: 'Agriculture Durable', color: '#D97706' },
  { id: 'entrepreneuriat', label: 'Entrepreneuriat', color: TERRACOTTA },
  { id: 'autre', label: 'Autre', color: '#64748B' },
];

export default function CreerSalonScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [step, setStep] = useState<'form' | 'success'>('form');

  const isValid = name.trim().length >= 3 && category !== '';

  function handleCreate() {
    if (!isValid) return;
    setStep('success');
  }

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: TERRACOTTA + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={36} color={TERRACOTTA} />
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#1E293B', textAlign: 'center' }}>Salon créé !</h2>
        <p style={{ margin: '0 0 32px', fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 1.6 }}>
          <strong style={{ color: '#1E293B' }}>#{name}</strong> est maintenant actif. Invitez des membres pour commencer les discussions.
        </p>
        <button
          onClick={() => navigate('/kauri/social-hub/salon/new')}
          style={{ width: '100%', background: TERRACOTTA, color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}
        >
          Ouvrir le salon
        </button>
        <button
          onClick={() => navigate('/kauri/social-hub/forums-menu')}
          style={{ width: '100%', background: '#fff', color: '#64748B', border: '1px solid #E8ECF0', borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          Retour aux forums
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: TERRACOTTA, padding: '14px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>KAURI</p>
            <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800 }}>Créer un salon</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 32px' }}>

        {/* Nom */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Nom du salon *</label>
          <div style={{ background: '#fff', border: `1.5px solid ${name.length > 0 ? TERRACOTTA + '60' : '#E8ECF0'}`, borderRadius: 14, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
            <Hash size={16} color={TERRACOTTA} />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ex: Entrepreneurs Antilles"
              maxLength={40}
              style={{ flex: 1, border: 'none', outline: 'none', padding: '13px 0', fontSize: 14, color: '#1E293B', background: 'transparent' }}
            />
            <span style={{ fontSize: 11, color: '#CBD5E1' }}>{name.length}/40</span>
          </div>
          {name.length > 0 && name.length < 3 && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#EF4444' }}>Minimum 3 caractères</p>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="De quoi parle ce salon ?"
            maxLength={150}
            rows={3}
            style={{ width: '100%', background: '#fff', border: '1.5px solid #E8ECF0', borderRadius: 14, padding: '13px 14px', fontSize: 14, color: '#1E293B', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }}
          />
          <div style={{ textAlign: 'right', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: '#CBD5E1' }}>{description.length}/150</span>
          </div>
        </div>

        {/* Catégorie */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Catégorie *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  background: category === cat.id ? cat.color + '14' : '#fff',
                  border: `1.5px solid ${category === cat.id ? cat.color : '#E8ECF0'}`,
                  borderRadius: 12, padding: '10px 12px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: category === cat.id ? cat.color : '#64748B', lineHeight: 1.3 }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Visibilité */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Visibilité</label>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
            {[
              { value: true, icon: <Globe size={18} color={TEAL} />, label: 'Public', sub: 'Tout le monde peut rejoindre' },
              { value: false, icon: <Lock size={18} color='#8B5CF6' />, label: 'Privé', sub: 'Sur invitation uniquement' },
            ].map((opt, i) => (
              <button
                key={String(opt.value)}
                onClick={() => setIsPublic(opt.value)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', background: isPublic === opt.value ? (opt.value ? TEAL + '08' : '#8B5CF608') : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderTop: i > 0 ? '1px solid #F1F5F9' : 'none',
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#F4F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {opt.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{opt.label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>{opt.sub}</p>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${isPublic === opt.value ? TERRACOTTA : '#CBD5E1'}`,
                  background: isPublic === opt.value ? TERRACOTTA : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isPublic === opt.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleCreate}
          disabled={!isValid}
          style={{
            width: '100%', background: isValid ? TERRACOTTA : '#E8ECF0',
            color: isValid ? '#fff' : '#94A3B8',
            border: 'none', borderRadius: 14, padding: '15px',
            fontSize: 15, fontWeight: 700, cursor: isValid ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Hash size={18} />
          Créer le salon
        </button>
      </div>
    </div>
  );
}
