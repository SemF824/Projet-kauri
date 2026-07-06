import {
  ArrowLeft, Building, FileText, Shield, Users, ChevronRight,
  CreditCard, Settings, X, CheckCircle2, Plus, Trash2,
  AlertTriangle, Pencil, Lock, Sliders, Webhook, Key, Upload
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

// ── Types ─────────────────────────────────────────────────────────────────────
type Panel =
  | 'raison-sociale' | 'siret' | 'signataires'
  | 'carte' | 'multi-sig' | 'documents' | 'avances'
  | null;

interface Signataire {
  id: string;
  nom: string;
  role: string;
  actif: boolean;
}

const DEFAULT_SIGNATAIRES: Signataire[] = [
  { id: 's1', nom: 'Marie Céleste',    role: 'Gérante',      actif: true  },
  { id: 's2', nom: 'Jean-Pierre Louis', role: 'Co-fondateur', actif: true  },
  { id: 's3', nom: 'Sophie Bernard',   role: 'Trésorière',   actif: true  },
];

const DEFAULT_DOCS = [
  { id: 'd1', nom: 'Kbis.pdf',            statut: 'validé',    date: '12 jan. 2026' },
  { id: 'd2', nom: 'Statuts_SARL.pdf',    statut: 'validé',    date: '12 jan. 2026' },
  { id: 'd3', nom: 'CNI_Gerant.pdf',      statut: 'validé',    date: '15 jan. 2026' },
  { id: 'd4', nom: 'Rapport_Q2_2026.pdf', statut: 'en_attente', date: 'À soumettre'  },
];

export function ProManageAccountScreen() {
  const navigate  = useNavigate();
  const { isDarkMode } = useDarkMode();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [panel,       setPanel]       = useState<Panel>(null);
  const [toast,       setToast]       = useState('');
  const [signataires, setSignataires] = useState<Signataire[]>(DEFAULT_SIGNATAIRES);
  const [docs,        setDocs]        = useState(DEFAULT_DOCS);

  // Raison sociale
  const [raisonSociale, setRaisonSociale] = useState('SARL Innovation Caraïbes');
  const [raisonDraft,   setRaisonDraft]   = useState('');

  // Multi-sig
  const [seuilMultiSig, setSeuilMultiSig] = useState(10000);
  const [sigRequises,   setSigRequises]   = useState(2);
  const [sigTotal,      setSigTotal]      = useState(3);
  const [seuilDraft,    setSeuilDraft]    = useState({ seuil: '10000', requis: '2', total: '3' });

  // Signataire nouveau
  const [newSig, setNewSig] = useState({ nom: '', role: '' });

  // Paramètres avancés
  const [apiEnabled,     setApiEnabled]     = useState(false);
  const [webhookUrl,     setWebhookUrl]     = useState('');
  const [webhookDraft,   setWebhookDraft]   = useState('');
  const [notifEmail,     setNotifEmail]     = useState(true);
  const [notifSMS,       setNotifSMS]       = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const bg   = isDarkMode ? 'bg-[#0F172A]'  : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]';
  const card = isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]';
  const txt  = isDarkMode ? 'text-white'     : 'text-[#0F172A]';
  const sub  = isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const inp  = isDarkMode
    ? 'bg-[#0F172A] border-[#334155] text-white placeholder:text-white/30'
    : 'border-[#E2E8F0] text-[#0F172A]';

  // ── Helpers ────────────────────────────────────────────────────────────────
  const Row = ({ icon: Icon, color, bg: rowBg, label, value, onClick, badge }: {
    icon: React.ElementType; color: string; bg: string; label: string; value: string;
    onClick: () => void; badge?: React.ReactNode;
  }) => (
    <button onClick={onClick} className={`w-full rounded-xl p-4 flex items-center justify-between border ${card}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: rowBg }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="text-left">
          <p className={`text-sm font-medium ${txt}`}>{label}</p>
          <p className={`text-xs ${sub}`}>{value}</p>
        </div>
      </div>
      {badge ?? <ChevronRight className={`w-4 h-4 ${sub}`} />}
    </button>
  );

  const PanelWrap = ({ title, sub: subtitle, children }: { title: string; sub?: string; children: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPanel(null)} />
      <div className={`relative rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
        </div>
        <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}>
          <div>
            <h2 className={`font-bold text-base ${txt}`}>{title}</h2>
            {subtitle && <p className={`text-xs mt-0.5 ${sub}`}>{subtitle}</p>}
          </div>
          <button onClick={() => setPanel(null)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-[#F1F5F9]'}`}>
            <X className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-5">{children}</div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-24 transition-colors ${bg}`}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-[#006D77] text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* HEADER */}
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>
        <h1 className="text-white text-2xl font-bold mb-1">Gérer mon entreprise</h1>
        <p className="text-white/80 text-sm">Paramètres & configurations professionnelles</p>
      </div>

      <div className="px-6 py-6 space-y-6">

        {/* ── Informations Entreprise ── */}
        <div>
          <p className={`text-sm font-semibold mb-3 ${txt}`}>Informations Entreprise</p>
          <div className="space-y-2.5">
            <Row icon={Building}  color="#D4AF37" bg="#D4AF3715" label="Raison Sociale" value={raisonSociale}
              onClick={() => { setRaisonDraft(raisonSociale); setPanel('raison-sociale'); }} />
            <Row icon={FileText}  color="#006D77" bg="#006D7715" label="SIRET"           value="123 456 789 00012"
              onClick={() => setPanel('siret')} />
            <Row icon={Users}     color="#0D9488" bg="#0D948815" label="Signataires autorisés" value={`${signataires.filter(s => s.actif).length} membres actifs`}
              onClick={() => setPanel('signataires')} />
          </div>
        </div>

        {/* ── Moyens de Paiement ── */}
        <div>
          <p className={`text-sm font-semibold mb-3 ${txt}`}>Moyens de Paiement</p>
          <div className={`rounded-2xl p-5 border mb-2.5 ${card}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${txt}`}>Carte Business</p>
                  <p className={`text-xs ${sub}`}>**** **** **** 5678</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 bg-[#D1FAE5] text-[#059669] rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-xs ${sub}`}>Plafond mensuel</p>
              <span className={`text-sm font-semibold ${txt}`}>50 000 €</span>
            </div>
          </div>
          <button
            onClick={() => setPanel('carte')}
            className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl shadow-lg font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Commander une carte Pro
          </button>
        </div>

        {/* ── Sécurité & Conformité ── */}
        <div>
          <p className={`text-sm font-semibold mb-3 ${txt}`}>Sécurité & Conformité</p>
          <div className="space-y-2.5">
            <Row icon={Shield}    color="#006D77" bg="#006D7715"
              label="Validation Multi-Signatures"
              value={`Seuil : ${seuilMultiSig.toLocaleString()} € (${sigRequises}/${sigTotal} signatures)`}
              onClick={() => { setSeuilDraft({ seuil: String(seuilMultiSig), requis: String(sigRequises), total: String(sigTotal) }); setPanel('multi-sig'); }} />
            <Row icon={FileText}  color="#F59E0B" bg="#F59E0B15"
              label="Documents KYB"
              value={`${docs.filter(d => d.statut === 'validé').length}/${docs.length} documents validés`}
              onClick={() => setPanel('documents')}
              badge={docs.some(d => d.statut === 'en_attente')
                ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">Action requise</span>
                : <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#059669]">✓ Vérifié</span>
              }
            />
            <Row icon={Settings}  color="#B05B3B" bg="#B05B3B15"
              label="Paramètres avancés"
              value="API, webhooks, notifications"
              onClick={() => { setWebhookDraft(webhookUrl); setPanel('avances'); }} />
          </div>
        </div>
      </div>

      {/* ══════════ PANELS ══════════ */}

      {/* Raison Sociale */}
      {panel === 'raison-sociale' && (
        <PanelWrap title="Raison Sociale" sub="Nom légal de votre entreprise">
          <div className="space-y-4">
            <div className={`rounded-xl p-4 border flex gap-3 ${isDarkMode ? 'bg-[#0F172A] border-[#334155]' : 'bg-[#FEF9E7] border-[#D4AF37]/30'}`}>
              <AlertTriangle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <p className={`text-xs ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#92400E]'}`}>
                La raison sociale doit correspondre exactement à votre Kbis. Une modification déclenche une re-vérification KYB sous 48h.
              </p>
            </div>
            <div>
              <label className={`text-sm font-semibold mb-2 block ${txt}`}>Raison sociale actuelle</label>
              <input
                value={raisonDraft}
                onChange={e => setRaisonDraft(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${inp}`}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPanel(null)} className={`flex-1 py-4 rounded-xl border-2 text-sm font-medium ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>Annuler</button>
              <button onClick={() => { setRaisonSociale(raisonDraft); setPanel(null); showToast('Raison sociale mise à jour'); }}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg">
                Enregistrer
              </button>
            </div>
          </div>
        </PanelWrap>
      )}

      {/* SIRET */}
      {panel === 'siret' && (
        <PanelWrap title="Numéro SIRET" sub="Identifiant légal de votre établissement">
          <div className="space-y-4">
            <div className={`rounded-xl p-5 border text-center ${isDarkMode ? 'bg-[#0F172A] border-[#334155]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
              <p className={`text-2xl font-bold font-mono tracking-widest mb-1 ${txt}`}>123 456 789 00012</p>
              <p className={`text-xs ${sub}`}>SARL Innovation Caraïbes</p>
            </div>
            <div className={`rounded-xl p-4 border flex gap-3 ${isDarkMode ? 'bg-[#0F172A] border-[#334155]' : 'bg-[#E0F2FE] border-[#006D77]/30'}`}>
              <Lock className="w-4 h-4 text-[#006D77] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#0369A1]">
                Le numéro SIRET est verrouillé et ne peut être modifié qu'à travers une nouvelle procédure de vérification KYB. Contactez <strong>support@kauri.fr</strong> pour toute modification.
              </p>
            </div>
            <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <p className={`text-xs font-semibold mb-2 ${sub}`}>Informations liées</p>
              {[
                { label: 'Forme juridique', value: 'SARL' },
                { label: 'Date création',   value: '15 mars 2022' },
                { label: 'Code APE',        value: '6419Z — Banques' },
                { label: 'TVA intracommunautaire', value: 'FR12 123456789' },
              ].map(({ label, value }) => (
                <div key={label} className={`flex justify-between py-2 border-b last:border-0 ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}>
                  <span className={`text-xs ${sub}`}>{label}</span>
                  <span className={`text-xs font-medium ${txt}`}>{value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPanel(null)} className={`w-full py-4 rounded-xl border-2 text-sm font-medium ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>Fermer</button>
          </div>
        </PanelWrap>
      )}

      {/* Signataires */}
      {panel === 'signataires' && (
        <PanelWrap title="Signataires autorisés" sub="Membres pouvant approuver les transactions">
          <div className="space-y-4">
            <div className="space-y-2">
              {signataires.map((s) => (
                <div key={s.id} className={`flex items-center gap-3 p-4 rounded-xl border ${card}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${s.actif ? 'bg-gradient-to-br from-[#006D77] to-[#0D9488]' : 'bg-[#94A3B8]'}`}>
                    {s.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${txt}`}>{s.nom}</p>
                    <p className={`text-xs ${sub}`}>{s.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.actif ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                      {s.actif ? 'Actif' : 'Inactif'}
                    </span>
                    <button
                      onClick={() => setSignataires(prev => prev.map(p => p.id === s.id ? { ...p, actif: !p.actif } : p))}
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-[#F1F5F9]'}`}
                    >
                      <Pencil className={`w-3.5 h-3.5 ${sub}`} />
                    </button>
                    {s.id !== 's1' && (
                      <button
                        onClick={() => setSignataires(prev => prev.filter(p => p.id !== s.id))}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#0F172A] border-[#334155]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
              <p className={`text-xs font-semibold mb-3 ${txt}`}>Ajouter un signataire</p>
              <div className="space-y-2">
                <input value={newSig.nom} onChange={e => setNewSig({ ...newSig, nom: e.target.value })}
                  placeholder="Nom complet"
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none ${inp}`} />
                <input value={newSig.role} onChange={e => setNewSig({ ...newSig, role: e.target.value })}
                  placeholder="Rôle (ex: Directeur financier)"
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none ${inp}`} />
                <button
                  disabled={!newSig.nom.trim() || !newSig.role.trim()}
                  onClick={() => {
                    setSignataires(prev => [...prev, { id: `s${Date.now()}`, nom: newSig.nom, role: newSig.role, actif: true }]);
                    setNewSig({ nom: '', role: '' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#006D77] text-white text-sm font-semibold disabled:opacity-40"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <button onClick={() => { setPanel(null); showToast('Signataires mis à jour'); }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg">
              Enregistrer
            </button>
          </div>
        </PanelWrap>
      )}

      {/* Commander carte */}
      {panel === 'carte' && (
        <PanelWrap title="Commander une carte Pro" sub="Carte physique Mastercard Business">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-widest">KAURI Pro</p>
                  <p className="font-bold mt-0.5">{raisonSociale}</p>
                </div>
                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="font-mono text-lg tracking-widest text-white/70">•••• •••• •••• ????</p>
              <div className="flex justify-between mt-4 text-xs text-white/50">
                <span>Marie Céleste</span>
                <span>Mastercard Business</span>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Type', value: 'Mastercard Business Platinum' },
                { label: 'Plafond mensuel', value: "Jusqu'à 100 000 €" },
                { label: 'Retrait ATM', value: '5 000 € / jour' },
                { label: 'Délai livraison', value: '5–7 jours ouvrés' },
                { label: 'Coût annuel', value: 'Offert (KAURI Pro)' },
              ].map(({ label, value }) => (
                <div key={label} className={`flex justify-between px-4 py-3 rounded-xl ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
                  <span className={`text-xs ${sub}`}>{label}</span>
                  <span className={`text-xs font-semibold ${txt}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPanel(null)} className={`flex-1 py-4 rounded-xl border-2 text-sm font-medium ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>Annuler</button>
              <button onClick={() => { setPanel(null); showToast('Demande de carte envoyée !'); }}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white text-sm font-bold shadow-lg">
                Commander
              </button>
            </div>
          </div>
        </PanelWrap>
      )}

      {/* Multi-Signatures */}
      {panel === 'multi-sig' && (
        <PanelWrap title="Seuil Multi-Signatures" sub="Transactions nécessitant plusieurs validations">
          <div className="space-y-5">
            <div className={`rounded-xl p-4 border flex gap-3 ${isDarkMode ? 'bg-[#0F172A] border-[#334155]' : 'bg-[#E0F2FE] border-[#006D77]/30'}`}>
              <Shield className="w-4 h-4 text-[#006D77] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#0369A1]">
                Toute transaction dépassant ce seuil déclenchera automatiquement une validation multi-signatures avant exécution.
              </p>
            </div>

            <div>
              <label className={`text-sm font-semibold mb-2 block ${txt}`}>Seuil de déclenchement (€)</label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${sub}`}>€</span>
                <input type="number" value={seuilDraft.seuil} onChange={e => setSeuilDraft({ ...seuilDraft, seuil: e.target.value })}
                  className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/30 ${inp}`} />
              </div>
              <p className={`text-xs mt-1 ${sub}`}>Actuel : {seuilMultiSig.toLocaleString()} €</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-sm font-semibold mb-2 block ${txt}`}>Signatures requises</label>
                <select value={seuilDraft.requis} onChange={e => setSeuilDraft({ ...seuilDraft, requis: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/30 ${inp}`}>
                  {['1', '2', '3'].map(v => <option key={v} value={v}>{v} signature{v !== '1' ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className={`text-sm font-semibold mb-2 block ${txt}`}>Sur X signataires</label>
                <select value={seuilDraft.total} onChange={e => setSeuilDraft({ ...seuilDraft, total: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/30 ${inp}`}>
                  {['2', '3', '4', '5'].map(v => <option key={v} value={v}>{v} signataires</option>)}
                </select>
              </div>
            </div>

            <div className={`rounded-xl p-4 text-center ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'} rounded-xl`}>
              <p className={`text-xs ${sub} mb-1`}>Configuration résultante</p>
              <p className={`text-sm font-bold ${txt}`}>
                Transactions ≥ {parseInt(seuilDraft.seuil || '0').toLocaleString()} € → {seuilDraft.requis}/{seuilDraft.total} signatures requises
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPanel(null)} className={`flex-1 py-4 rounded-xl border-2 text-sm font-medium ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>Annuler</button>
              <button onClick={() => {
                setSeuilMultiSig(parseInt(seuilDraft.seuil) || seuilMultiSig);
                setSigRequises(parseInt(seuilDraft.requis));
                setSigTotal(parseInt(seuilDraft.total));
                setPanel(null);
                showToast('Seuil multi-signatures mis à jour');
              }} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white text-sm font-bold shadow-lg">
                Enregistrer
              </button>
            </div>
          </div>
        </PanelWrap>
      )}

      {/* Documents KYB */}
      {panel === 'documents' && (
        <PanelWrap title="Documents KYB" sub="Justificatifs de votre entreprise">
          <div className="space-y-4">
            <div className="space-y-2">
              {docs.map(doc => (
                <div key={doc.id} className={`flex items-center gap-3 p-4 rounded-xl border ${card}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.statut === 'validé' ? 'bg-[#D1FAE5]' : 'bg-[#FEF3C7]'}`}>
                    <FileText className={`w-4 h-4 ${doc.statut === 'validé' ? 'text-[#059669]' : 'text-[#D97706]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${txt}`}>{doc.nom}</p>
                    <p className={`text-xs ${sub}`}>{doc.date}</p>
                  </div>
                  {doc.statut === 'validé'
                    ? <span className="text-[10px] font-bold px-2 py-0.5 bg-[#D1FAE5] text-[#059669] rounded-full">✓ Validé</span>
                    : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-bold px-2 py-1 bg-[#FEF3C7] text-[#D97706] rounded-full flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" /> Soumettre
                      </button>
                    )
                  }
                </div>
              ))}
            </div>

            {/* Input file caché pour les docs */}
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
              onChange={e => {
                if (e.target.files?.[0]) {
                  const f = e.target.files[0];
                  setDocs(prev => prev.map(d =>
                    d.statut === 'en_attente' && prev.find(x => x.statut === 'en_attente')?.id === d.id
                      ? { ...d, nom: f.name, statut: 'validé', date: 'À l\'instant' }
                      : d
                  ));
                  showToast('Document soumis avec succès');
                }
                e.target.value = '';
              }}
            />

            <button
              onClick={() => { setPanel(null); }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg"
            >
              Fermer
            </button>
          </div>
        </PanelWrap>
      )}

      {/* Paramètres avancés */}
      {panel === 'avances' && (
        <PanelWrap title="Paramètres avancés" sub="API, webhooks et notifications">
          <div className="space-y-5">

            {/* API */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Key className={`w-4 h-4 ${sub}`} />
                  <p className={`text-sm font-semibold ${txt}`}>Accès API</p>
                </div>
                <button
                  onClick={() => setApiEnabled(v => !v)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${apiEnabled ? 'bg-[#006D77]' : isDarkMode ? 'bg-[#334155]' : 'bg-[#E2E8F0]'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${apiEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              {apiEnabled && (
                <div className={`rounded-xl p-4 border font-mono text-xs ${isDarkMode ? 'bg-[#0F172A] border-[#334155] text-[#D4AF37]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#006D77]'} break-all`}>
                  sk_live_kauri_xxxxxxxxxxxxxxxxxxxxxxxx
                </div>
              )}
            </div>

            {/* Webhook */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Webhook className={`w-4 h-4 ${sub}`} />
                <p className={`text-sm font-semibold ${txt}`}>URL Webhook</p>
              </div>
              <input
                type="url"
                value={webhookDraft}
                onChange={e => setWebhookDraft(e.target.value)}
                placeholder="https://votre-app.com/webhook/kauri"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/30 ${inp}`}
              />
              <p className={`text-xs mt-1 ${sub}`}>Reçoit les événements : paiements, signatures, alertes.</p>
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sliders className={`w-4 h-4 ${sub}`} />
                <p className={`text-sm font-semibold ${txt}`}>Canaux de notification</p>
              </div>
              {[
                { label: 'Email', value: notifEmail, set: setNotifEmail },
                { label: 'SMS',   value: notifSMS,   set: setNotifSMS   },
              ].map(({ label, value, set }) => (
                <div key={label} className={`flex items-center justify-between px-4 py-3 rounded-xl mb-2 border ${card}`}>
                  <span className={`text-sm ${txt}`}>{label}</span>
                  <button onClick={() => set(v => !v)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-[#006D77]' : isDarkMode ? 'bg-[#334155]' : 'bg-[#E2E8F0]'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setPanel(null)} className={`flex-1 py-4 rounded-xl border-2 text-sm font-medium ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>Annuler</button>
              <button onClick={() => { setWebhookUrl(webhookDraft); setPanel(null); showToast('Paramètres enregistrés'); }}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#B05B3B] to-[#D4803A] text-white text-sm font-bold shadow-lg">
                Enregistrer
              </button>
            </div>
          </div>
        </PanelWrap>
      )}
    </div>
  );
}
