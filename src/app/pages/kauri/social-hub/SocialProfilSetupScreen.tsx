import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Check, Eye, EyeOff, MapPin,
  Shield, MessageCircle, Star, User, Edit3,
} from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────────────────
const TEAL   = '#006D77';
const GOLD   = '#D4AF37';
const TERRA  = '#B05B3B';
const BG     = '#0D1F25';
const CARD   = 'rgba(255,255,255,0.06)';
const BORDER = 'rgba(255,255,255,0.10)';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SocialProfile {
  avatarIndex: number;
  useRealName: boolean;
  pseudo: string;
  tagline: string;
  bio: string;
  domaine: string;
  tags: string[];
  objectifs: string[];
  locationDisplay: 'ville' | 'pays' | 'masquer';
  invisibleRencontres: boolean;
  invisibleDiscussions: boolean;
  messagerie: 'tous' | 'connexions' | 'personne';
}

const DEFAULT_PROFILE: SocialProfile = {
  avatarIndex: 0,
  useRealName: true,
  pseudo: '',
  tagline: '',
  bio: '',
  domaine: '',
  tags: [],
  objectifs: [],
  locationDisplay: 'ville',
  invisibleRencontres: false,
  invisibleDiscussions: false,
  messagerie: 'tous',
};

// ── Static data ───────────────────────────────────────────────────────────────
const AVATARS = [
  { bg: 'linear-gradient(135deg, #006D77, #0D9488)', initials: 'JD', emoji: null },
  { bg: 'linear-gradient(135deg, #D4AF37, #B8860B)', initials: 'JD', emoji: null },
  { bg: 'linear-gradient(135deg, #B05B3B, #8B3E24)', initials: 'JD', emoji: null },
  { bg: 'linear-gradient(135deg, #7C3AED, #4C1D95)', initials: 'JD', emoji: null },
  { bg: 'linear-gradient(135deg, #0EA5E9, #0369A1)', initials: 'JD', emoji: null },
  { bg: 'linear-gradient(135deg, #10B981, #065F46)', initials: 'JD', emoji: null },
];

const DOMAINES = [
  'Finance & Investissement', 'Tech & Innovation', 'Entrepreneuriat',
  'Agriculture & Bio', 'Art & Culture', 'Santé & Bien-être',
  'Éducation', 'Immobilier', 'Autre',
];

const ALL_TAGS = [
  'Impact Social', 'Co-investissement', 'Blockchain', 'DeFi',
  'Microfinance', 'Mentorat', 'Diaspora', 'Startup', 'Export',
  'Tontines', 'Immobilier', 'Agriculture Bio',
];

const OBJECTIFS = [
  { id: 'mentor', label: 'Trouver un mentor', icon: '🎓' },
  { id: 'associe', label: 'Chercher un associé', icon: '🤝' },
  { id: 'investisseur', label: 'Co-investissement', icon: '💰' },
  { id: 'partenaire', label: 'Partenariats', icon: '🌐' },
  { id: 'echanges', label: 'Échanges & réseau', icon: '💬' },
  { id: 'communaute', label: 'Vie communautaire', icon: '🌺' },
];

const STEPS = [
  { id: 1, label: 'Identité',      icon: User },
  { id: 2, label: 'À propos',      icon: Edit3 },
  { id: 3, label: 'Objectifs',     icon: Star },
  { id: 4, label: 'Confidentialité', icon: Shield },
];

// ── Small atoms ───────────────────────────────────────────────────────────────
function Toggle({ on, onChange, accent = TEAL }: { on: boolean; onChange: (v: boolean) => void; accent?: string }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 46, height: 26, borderRadius: 13, flexShrink: 0,
        background: on ? accent : 'rgba(255,255,255,0.15)',
        border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background 0.25s',
      }}
    >
      <motion.div
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute', top: 3,
          width: 20, height: 20, borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        }}
      />
    </button>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <p style={{
      color: GOLD, fontSize: 10, fontWeight: 800,
      letterSpacing: '0.2em', textTransform: 'uppercase',
      margin: '0 0 12px',
    }}>{children}</p>
  );
}

function StyledInput({
  value, onChange, placeholder, maxLength, multiline,
}: {
  value: string; onChange: (v: string) => void;
  placeholder: string; maxLength?: number; multiline?: boolean;
}) {
  const base: React.CSSProperties = {
    width: '100%', background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 14, padding: '12px 16px',
    color: '#fff', fontSize: 14, fontWeight: 400,
    outline: 'none', resize: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };
  return multiline ? (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        style={{ ...base, lineHeight: 1.55 }}
      />
      {maxLength && (
        <span style={{
          position: 'absolute', bottom: 10, right: 14,
          color: 'rgba(255,255,255,0.35)', fontSize: 11,
        }}>{value.length}/{maxLength}</span>
      )}
    </div>
  ) : (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={base}
    />
  );
}

// ── Profile preview card ──────────────────────────────────────────────────────
function ProfilePreviewCard({ profile }: { profile: SocialProfile }) {
  const av = AVATARS[profile.avatarIndex];
  const displayName = profile.useRealName ? 'Jean Dupont' : (profile.pseudo || 'Votre pseudo');

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: 'linear-gradient(160deg, #0D2830 0%, #0A1E26 100%)',
      border: '1px solid rgba(212,175,55,0.25)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
    }}>
      {/* Top banner */}
      <div style={{
        height: 72,
        background: 'linear-gradient(135deg, #B05B3B 0%, #9A4530 100%)',
        position: 'relative',
      }}>
        {/* Avatar */}
        <div style={{
          position: 'absolute', bottom: -28, left: 20,
          width: 56, height: 56, borderRadius: '50%',
          background: av.bg, border: '3px solid #0A1E26',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <span style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{av.initials}</span>
        </div>

        {/* Invisible badges */}
        <div style={{ position: 'absolute', top: 10, right: 14, display: 'flex', gap: 6 }}>
          {profile.invisibleRencontres && (
            <div style={{
              background: 'rgba(0,0,0,0.5)', borderRadius: 20,
              padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4,
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <EyeOff style={{ width: 9, height: 9, color: '#FDA' }} />
              <span style={{ color: '#FDA', fontSize: 9, fontWeight: 700 }}>Rencontres</span>
            </div>
          )}
          {profile.invisibleDiscussions && (
            <div style={{
              background: 'rgba(0,0,0,0.5)', borderRadius: 20,
              padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4,
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <EyeOff style={{ width: 9, height: 9, color: '#FDA' }} />
              <span style={{ color: '#FDA', fontSize: 9, fontWeight: 700 }}>Discussions</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '36px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: '0 0 2px', letterSpacing: '-0.02em' }}>
              {displayName}
            </h3>
            {profile.tagline && (
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, margin: 0 }}>
                {profile.tagline}
              </p>
            )}
          </div>
          <div style={{
            background: 'rgba(212,175,55,0.15)', borderRadius: 20,
            padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4,
            border: '1px solid rgba(212,175,55,0.3)', flexShrink: 0,
          }}>
            <Shield style={{ width: 10, height: 10, color: GOLD }} />
            <span style={{ color: '#FFE57A', fontSize: 11, fontWeight: 700 }}>94</span>
          </div>
        </div>

        {profile.bio ? (
          <p style={{
            color: 'rgba(255,255,255,0.70)', fontSize: 13, lineHeight: 1.6,
            margin: '12px 0',
          }}>
            {profile.bio}
          </p>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontStyle: 'italic', margin: '12px 0' }}>
            Aucune bio renseignée
          </p>
        )}

        {profile.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {profile.tags.map(t => (
              <span key={t} style={{
                background: `${GOLD}18`, border: `1px solid ${GOLD}40`,
                color: '#FFE57A', fontSize: 11, fontWeight: 600,
                borderRadius: 20, padding: '3px 10px',
              }}>{t}</span>
            ))}
          </div>
        )}

        {profile.domaine && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.4)' }} />
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
              {profile.domaine}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Step components ───────────────────────────────────────────────────────────
function StepIdentite({ p, set }: { p: SocialProfile; set: (k: keyof SocialProfile, v: unknown) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Avatar picker */}
      <div>
        <SectionTitle>Votre avatar</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
          {AVATARS.map((av, i) => (
            <button
              key={i}
              onClick={() => set('avatarIndex', i)}
              style={{
                aspectRatio: '1', borderRadius: '50%',
                background: av.bg, border: `3px solid ${i === p.avatarIndex ? GOLD : 'transparent'}`,
                cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i === p.avatarIndex ? `0 0 0 2px ${BG}, 0 0 0 4px ${GOLD}` : 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            >
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>JD</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nom ou pseudo */}
      <div>
        <SectionTitle>Comment vous appeler ?</SectionTitle>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14,
        }}>
          {[
            { label: 'Mon prénom', value: true },
            { label: 'Un pseudo', value: false },
          ].map(opt => (
            <button
              key={opt.label}
              onClick={() => set('useRealName', opt.value)}
              style={{
                padding: '11px 8px', borderRadius: 14, cursor: 'pointer',
                background: p.useRealName === opt.value ? `${TERRA}25` : CARD,
                border: `1.5px solid ${p.useRealName === opt.value ? TERRA : BORDER}`,
                color: p.useRealName === opt.value ? '#fff' : 'rgba(255,255,255,0.55)',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {p.useRealName === opt.value && <Check style={{ width: 13, height: 13, color: TERRA }} />}
              {opt.label}
            </button>
          ))}
        </div>

        {!p.useRealName && (
          <StyledInput
            value={p.pseudo}
            onChange={v => set('pseudo', v)}
            placeholder="@votre_pseudo"
            maxLength={30}
          />
        )}

        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '8px 0 0', lineHeight: 1.5 }}>
          {p.useRealName
            ? 'Votre prénom du compte KAURI sera affiché dans le Hub Social.'
            : 'Le pseudo remplace votre nom partout dans le réseau social.'}
        </p>
      </div>

      {/* Tagline */}
      <div>
        <SectionTitle>Accroche (optionnel)</SectionTitle>
        <StyledInput
          value={p.tagline}
          onChange={v => set('tagline', v)}
          placeholder="Ex: Entrepreneur & mentor · Diaspora Antilles"
          maxLength={60}
        />
      </div>
    </div>
  );
}

function StepAPropos({ p, set }: { p: SocialProfile; set: (k: keyof SocialProfile, v: unknown) => void }) {
  const toggleTag = (tag: string) => {
    if (p.tags.includes(tag)) {
      set('tags', p.tags.filter(t => t !== tag));
    } else if (p.tags.length < 3) {
      set('tags', [...p.tags, tag]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <SectionTitle>Votre bio</SectionTitle>
        <StyledInput
          value={p.bio}
          onChange={v => set('bio', v)}
          placeholder="Décrivez-vous en quelques mots — votre parcours, vos ambitions..."
          maxLength={140}
          multiline
        />
      </div>

      <div>
        <SectionTitle>Domaine d'activité</SectionTitle>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 7,
        }}>
          {DOMAINES.map(d => (
            <button
              key={d}
              onClick={() => set('domaine', d === p.domaine ? '' : d)}
              style={{
                padding: '8px 14px', borderRadius: 20, cursor: 'pointer',
                background: p.domaine === d ? `${TEAL}30` : CARD,
                border: `1.5px solid ${p.domaine === d ? TEAL : BORDER}`,
                color: p.domaine === d ? '#fff' : 'rgba(255,255,255,0.60)',
                fontSize: 12.5, fontWeight: 500, transition: 'all 0.2s',
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Compétences & intérêts (3 max)</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {ALL_TAGS.map(tag => {
            const selected = p.tags.includes(tag);
            const disabled = !selected && p.tags.length >= 3;
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                disabled={disabled}
                style={{
                  padding: '7px 13px', borderRadius: 20, cursor: disabled ? 'not-allowed' : 'pointer',
                  background: selected ? `${GOLD}25` : CARD,
                  border: `1.5px solid ${selected ? GOLD : BORDER}`,
                  color: selected ? '#FFE57A' : disabled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.60)',
                  fontSize: 12.5, fontWeight: selected ? 600 : 400,
                  transition: 'all 0.2s', opacity: disabled ? 0.5 : 1,
                }}
              >
                {selected && '✓ '}{tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepObjectifs({ p, set }: { p: SocialProfile; set: (k: keyof SocialProfile, v: unknown) => void }) {
  const toggleObj = (id: string) => {
    if (p.objectifs.includes(id)) {
      set('objectifs', p.objectifs.filter(o => o !== id));
    } else {
      set('objectifs', [...p.objectifs, id]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <SectionTitle>Que recherchez-vous ?</SectionTitle>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5, margin: '0 0 14px', lineHeight: 1.5 }}>
          Sélectionnez tout ce qui vous correspond. Cela aide la communauté à vous trouver.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {OBJECTIFS.map(obj => {
            const selected = p.objectifs.includes(obj.id);
            return (
              <button
                key={obj.id}
                onClick={() => toggleObj(obj.id)}
                style={{
                  padding: '14px 12px', borderRadius: 16, cursor: 'pointer',
                  background: selected ? `${TERRA}22` : CARD,
                  border: `1.5px solid ${selected ? TERRA : BORDER}`,
                  color: '#fff', fontSize: 13, fontWeight: selected ? 600 : 400,
                  transition: 'all 0.2s', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>{obj.emoji || obj.icon}</span>
                <span>{obj.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionTitle>Localisation affichée</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { v: 'ville', label: 'Afficher ma ville', desc: 'Ex: Paris, France' },
            { v: 'pays', label: 'Afficher mon pays uniquement', desc: 'Ex: France' },
            { v: 'masquer', label: 'Masquer ma localisation', desc: 'Aucun lieu affiché' },
          ].map(opt => (
            <button
              key={opt.v}
              onClick={() => set('locationDisplay', opt.v)}
              style={{
                padding: '12px 16px', borderRadius: 14, cursor: 'pointer',
                background: p.locationDisplay === opt.v ? `${TEAL}22` : CARD,
                border: `1.5px solid ${p.locationDisplay === opt.v ? TEAL : BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.2s', textAlign: 'left',
              }}
            >
              <div>
                <p style={{ color: '#fff', fontSize: 13, fontWeight: 500, margin: 0 }}>{opt.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 11.5, margin: '2px 0 0' }}>{opt.desc}</p>
              </div>
              {p.locationDisplay === opt.v && (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: TEAL,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check style={{ width: 11, height: 11, color: '#fff' }} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepConfidentialite({ p, set }: { p: SocialProfile; set: (k: keyof SocialProfile, v: unknown) => void }) {
  const VisibilityRow = ({
    label, desc, value, onChange, icon: Icon, color,
  }: {
    label: string; desc: string; value: boolean;
    onChange: (v: boolean) => void; icon: React.ElementType; color: string;
  }) => (
    <div style={{
      background: CARD, borderRadius: 16, padding: '16px',
      border: `1px solid ${value ? 'rgba(255,165,100,0.25)' : BORDER}`,
      transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `${color}20`,
            border: `1px solid ${color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon style={{ width: 15, height: 15, color }} />
          </div>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>{label}</p>
        </div>
        <Toggle on={value} onChange={onChange} accent="#FDA07A" />
      </div>
      <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12, margin: 0, paddingLeft: 44, lineHeight: 1.5 }}>
        {value ? '🚫 Votre profil est masqué dans cet espace.' : desc}
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <SectionTitle>Mode invisible</SectionTitle>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5, margin: '0 0 12px', lineHeight: 1.5 }}>
          Activez le mode invisible pour disparaître d'un espace sans quitter KAURI.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <VisibilityRow
            label="Rencontres"
            desc="Vous apparaissez dans les suggestions et pouvez recevoir des connexions."
            value={p.invisibleRencontres}
            onChange={v => set('invisibleRencontres', v)}
            icon={EyeOff}
            color={TERRA}
          />
          <VisibilityRow
            label="Discussions"
            desc="Votre statut en ligne et votre profil sont visibles dans les salons."
            value={p.invisibleDiscussions}
            onChange={v => set('invisibleDiscussions', v)}
            icon={MessageCircle}
            color={TEAL}
          />
        </div>
      </div>

      <div>
        <SectionTitle>Qui peut vous écrire ?</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { v: 'tous', label: 'Tout le monde', icon: '🌍', desc: 'Toute la communauté KAURI' },
            { v: 'connexions', label: 'Mes connexions uniquement', icon: '🤝', desc: 'Personnes avec qui vous avez matché' },
            { v: 'personne', label: 'Personne', icon: '🔒', desc: 'Vous ne recevrez aucun message' },
          ].map(opt => (
            <button
              key={opt.v}
              onClick={() => set('messagerie', opt.v)}
              style={{
                padding: '12px 16px', borderRadius: 14, cursor: 'pointer',
                background: p.messagerie === opt.v ? `${TEAL}18` : CARD,
                border: `1.5px solid ${p.messagerie === opt.v ? TEAL : BORDER}`,
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#fff', fontSize: 13, fontWeight: p.messagerie === opt.v ? 600 : 400, margin: 0 }}>
                  {opt.label}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5, margin: '2px 0 0' }}>{opt.desc}</p>
              </div>
              {p.messagerie === opt.v && (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: TEAL, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check style={{ width: 11, height: 11, color: '#fff' }} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div style={{
        background: 'rgba(212,175,55,0.08)', borderRadius: 14,
        padding: '12px 14px',
        border: '1px solid rgba(212,175,55,0.18)',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <Shield style={{ width: 14, height: 14, color: GOLD, flexShrink: 0, marginTop: 1 }} />
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5, margin: 0, lineHeight: 1.55 }}>
          Ces paramètres s'appliquent uniquement au Hub Social. Vos données financières restent strictement privées et séparées.
        </p>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function SocialProfilSetupScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.isEditing === true;

  const [step, setStep] = useState(isEditing ? 1 : 0); // 0 = welcome splash
  const [profile, setProfile] = useState<SocialProfile>(() => {
    try {
      const saved = localStorage.getItem('kauri_social_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch { return DEFAULT_PROFILE; }
  });
  const [showPreview, setShowPreview] = useState(false);

  const setField = (k: keyof SocialProfile, v: unknown) => {
    setProfile(prev => ({ ...prev, [k]: v }));
  };

  const handleNext = () => {
    if (step < STEPS.length) setStep(s => s + 1);
    else setShowPreview(true);
  };

  const handleSave = () => {
    localStorage.setItem('kauri_social_profile', JSON.stringify(profile));
    localStorage.setItem('kauri_social_profile_setup_done', '1');
    navigate('/kauri/social-hub-gateway');
  };

  const handleBack = () => {
    if (showPreview) { setShowPreview(false); return; }
    if (step > 1) { setStep(s => s - 1); return; }
    if (step === 1 && !isEditing) { setStep(0); return; }
    navigate('/kauri/social-hub-gateway');
  };

  // ── Welcome splash ────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div style={{
        minHeight: '100dvh', backgroundColor: BG,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', maxWidth: 430, margin: '0 auto',
      }}>
        {/* Glow orb */}
        <motion.div
          style={{
            width: 120, height: 120, borderRadius: '50%',
            background: `radial-gradient(circle, ${TERRA}55 0%, transparent 70%)`,
            position: 'absolute', top: '18%',
            filter: 'blur(30px)', pointerEvents: 'none',
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <motion.div
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Icon */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `linear-gradient(135deg, ${TERRA} 0%, #8B3E24 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: `0 16px 48px ${TERRA}60`,
          }}>
            <User style={{ width: 36, height: 36, color: '#fff' }} />
          </div>

          <p style={{
            color: GOLD, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            margin: '0 0 10px',
          }}>Hub Social · KAURI</p>

          <h1 style={{
            color: '#fff', fontSize: 28, fontWeight: 900,
            margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-0.025em',
          }}>
            Créez votre<br />profil social
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.58)', fontSize: 14, lineHeight: 1.65,
            margin: '0 0 40px', maxWidth: 300,
          }}>
            Votre profil social est distinct de votre compte financier — choisissez ce que vous partagez avec la communauté.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300, margin: '0 auto' }}>
            {[
              { icon: '👤', text: 'Identité & avatar personnalisés' },
              { icon: '🔒', text: 'Contrôle total de votre visibilité' },
              { icon: '🤝', text: 'Connexions & objectifs ciblés' },
            ].map(item => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: CARD, borderRadius: 12,
                padding: '10px 14px',
                border: `1px solid ${BORDER}`,
                textAlign: 'left',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          onClick={() => setStep(1)}
          style={{
            position: 'fixed', bottom: 36, left: '50%', transform: 'translateX(-50%)',
            padding: '16px 48px', borderRadius: 20,
            background: `linear-gradient(135deg, ${TERRA}, #8B3E24)`,
            color: '#fff', fontSize: 15, fontWeight: 700,
            border: 'none', cursor: 'pointer',
            boxShadow: `0 8px 28px ${TERRA}60`,
            display: 'flex', alignItems: 'center', gap: 10,
            whiteSpace: 'nowrap',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
        >
          Commencer
          <ArrowRight style={{ width: 18, height: 18 }} />
        </motion.button>
      </div>
    );
  }

  // ── Preview screen ────────────────────────────────────────────────────────
  if (showPreview) {
    return (
      <div style={{
        minHeight: '100dvh', backgroundColor: BG,
        display: 'flex', flexDirection: 'column',
        maxWidth: 430, margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}>
          <button onClick={handleBack} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: CARD, border: `1px solid ${BORDER}`,
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </button>
          <div>
            <p style={{ color: GOLD, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Aperçu</p>
            <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 800, margin: 0 }}>Votre carte profil</h2>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 120px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ProfilePreviewCard profile={profile} />
          </motion.div>

          <p style={{
            color: 'rgba(255,255,255,0.38)', fontSize: 12, textAlign: 'center',
            margin: '20px 0 0', lineHeight: 1.55,
          }}>
            Voilà comment la communauté vous verra.<br />Vous pourrez modifier cela à tout moment.
          </p>
        </div>

        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430,
          padding: '16px 20px 32px',
          background: `linear-gradient(to top, ${BG} 75%, transparent)`,
          display: 'flex', gap: 10,
        }}>
          <button onClick={handleBack} style={{
            flex: 1, padding: '14px', borderRadius: 16,
            background: CARD, border: `1px solid ${BORDER}`,
            color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Modifier
          </button>
          <button onClick={handleSave} style={{
            flex: 2, padding: '14px', borderRadius: 16,
            background: `linear-gradient(135deg, ${TERRA}, #8B3E24)`,
            border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
            boxShadow: `0 6px 20px ${TERRA}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Check style={{ width: 16, height: 16 }} />
            {isEditing ? 'Sauvegarder' : 'Valider mon profil'}
          </button>
        </div>
      </div>
    );
  }

  // ── Step screens ──────────────────────────────────────────────────────────
  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  const stepContent: Record<number, React.ReactNode> = {
    1: <StepIdentite p={profile} set={setField} />,
    2: <StepAPropos p={profile} set={setField} />,
    3: <StepObjectifs p={profile} set={setField} />,
    4: <StepConfidentialite p={profile} set={setField} />,
  };

  return (
    <div style={{
      minHeight: '100dvh', backgroundColor: BG,
      display: 'flex', flexDirection: 'column',
      maxWidth: 430, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 0', flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          <button onClick={handleBack} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: CARD, border: `1px solid ${BORDER}`,
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </button>

          {/* Step label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: `${TERRA}25`, border: `1.5px solid ${TERRA}60`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <StepIcon style={{ width: 13, height: 13, color: TERRA }} />
            </div>
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{currentStep.label}</span>
          </div>

          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{step} / {STEPS.length}</span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, borderRadius: 2,
          background: 'rgba(255,255,255,0.08)',
          marginBottom: 24,
          overflow: 'hidden',
        }}>
          <motion.div
            style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${TERRA}, #D4AF37)` }}
            animate={{ width: `${(step / STEPS.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 140px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '16px 20px 32px',
        background: `linear-gradient(to top, ${BG} 75%, transparent)`,
      }}>
        <button
          onClick={handleNext}
          style={{
            width: '100%', padding: '16px', borderRadius: 18,
            background: `linear-gradient(135deg, ${TERRA}, #8B3E24)`,
            border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: 'pointer',
            boxShadow: `0 8px 28px ${TERRA}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          {step < STEPS.length ? (
            <>Continuer <ArrowRight style={{ width: 18, height: 18 }} /></>
          ) : (
            <>Aperçu de mon profil <Eye style={{ width: 18, height: 18 }} /></>
          )}
        </button>
      </div>
    </div>
  );
}
