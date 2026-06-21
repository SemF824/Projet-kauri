import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check } from 'lucide-react';

const TERRACOTTA = '#B05B3B';
const TEAL = '#006D77';

const LANGUAGES = ['Français', 'English', 'Créole martiniquais', 'Créole guadeloupéen', 'Español'];
const FONT_SIZES = [
  { label: 'Petit', value: 'sm', preview: 13 },
  { label: 'Moyen', value: 'md', preview: 15 },
  { label: 'Grand', value: 'lg', preview: 17 },
  { label: 'Très grand', value: 'xl', preview: 20 },
];

export default function PreferencesDiscussionScreen() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('Français');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [fontSize, setFontSize] = useState('md');
  const [notifSound, setNotifSound] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: value ? TERRACOTTA : '#CBD5E1',
        border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );

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
            <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800 }}>Préférences de discussion</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 32px' }}>

        {/* Langue */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Langue d'affichage</p>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
            {LANGUAGES.map((lang, i) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{lang}</span>
                {language === lang && <Check size={16} color={TERRACOTTA} />}
              </button>
            ))}
          </div>
        </div>

        {/* Thème */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Thème</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { key: 'light', label: 'Clair', preview: { bg: '#F4F6F8', fg: '#1E293B', border: '#E8ECF0' } },
              { key: 'dark', label: 'Sombre', preview: { bg: '#1E293B', fg: '#F8FAFC', border: '#334155' } },
              { key: 'auto', label: 'Auto', preview: { bg: 'linear-gradient(135deg, #F4F6F8 50%, #1E293B 50%)', fg: '#64748B', border: '#CBD5E1' } },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setTheme(opt.key as 'light' | 'dark' | 'auto')}
                style={{
                  background: theme === opt.key ? TERRACOTTA + '10' : '#fff',
                  border: `2px solid ${theme === opt.key ? TERRACOTTA : '#E8ECF0'}`,
                  borderRadius: 14, padding: '12px 8px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                }}
              >
                <div style={{
                  width: 48, height: 30, borderRadius: 8,
                  background: opt.preview.bg,
                  border: `1px solid ${opt.preview.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 20, height: 4, borderRadius: 2, background: opt.preview.fg, opacity: 0.5 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme === opt.key ? TERRACOTTA : '#64748B' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Taille du texte */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Taille du texte</p>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8ECF0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
              {FONT_SIZES.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFontSize(f.value)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '0 4px',
                  }}
                >
                  <span style={{ fontSize: f.preview, color: fontSize === f.value ? TERRACOTTA : '#94A3B8', fontWeight: 700, lineHeight: 1 }}>Aa</span>
                  <span style={{ fontSize: 10, color: fontSize === f.value ? TERRACOTTA : '#94A3B8', fontWeight: 600 }}>{f.label}</span>
                  {fontSize === f.value && <div style={{ width: 4, height: 4, borderRadius: '50%', background: TERRACOTTA }} />}
                </button>
              ))}
            </div>
            {/* Aperçu */}
            <div style={{ background: '#F4F6F8', borderRadius: 10, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: FONT_SIZES.find(f => f.value === fontSize)?.preview, color: '#1E293B', lineHeight: 1.5 }}>
                Aperçu du texte des discussions dans les salons KAURI.
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Options</p>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
            {[
              { label: 'Sons de notification', sub: 'Jouer un son lors des nouveaux messages', value: notifSound, toggle: () => setNotifSound(v => !v) },
              { label: 'Accusés de lecture', sub: 'Afficher quand vos messages sont lus', value: readReceipts, toggle: () => setReadReceipts(v => !v) },
            ].map((item, i) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>{item.sub}</p>
                </div>
                <Toggle value={item.value} onChange={item.toggle} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%', background: saved ? '#059669' : TERRACOTTA, color: '#fff',
            border: 'none', borderRadius: 14, padding: '15px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s',
          }}
        >
          {saved ? <><Check size={18} /> Enregistré !</> : 'Enregistrer les préférences'}
        </button>
      </div>
    </div>
  );
}
