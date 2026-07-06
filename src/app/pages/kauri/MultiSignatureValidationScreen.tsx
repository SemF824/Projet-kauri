import {
  ArrowLeft, Shield, Users, CheckCircle2, Clock, XCircle, Plus,
  ChevronRight, AlertTriangle, Banknote, Building2, FileText,
  Fingerprint, History, ArrowDownToLine, Sparkles, X, Pencil, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

// ── Types ────────────────────────────────────────────────────────────────────
type WithdrawStatus = 'en_cours' | 'valide' | 'rejete' | 'execute';
type FlowStep = 'liste' | 'initier' | 'detail';

interface Signataire {
  id: string;
  name: string;
  initials: string;
  role: string;
  status: 'approved' | 'pending' | 'rejected';
  time: string;
  isSelf?: boolean;
}

interface WithdrawalRequest {
  id: string;
  projet: string;
  montant: number;
  disponible: number;
  destination: string;
  iban: string;
  motif: string;
  date: string;
  expireIn: string;
  status: WithdrawStatus;
  signataires: Signataire[];
  requis: number;
}

// ── Données mock ─────────────────────────────────────────────────────────────
const PROJECTS_DISPO = [
  { id: '1', name: 'Lolo Moderne', disponible: 45000 },
  { id: '2', name: 'Coopérative Agricole', disponible: 32000 },
];

const INITIAL_REQUESTS: WithdrawalRequest[] = [
  {
    id: 'r1',
    projet: 'Lolo Moderne',
    montant: 12000,
    disponible: 45000,
    destination: 'Crédit Agricole Martinique',
    iban: 'FR76 1234 5678 9012 3456 789',
    motif: 'Achat équipements cuisine professionnelle',
    date: '4 juillet 2026',
    expireIn: '36h restantes',
    status: 'en_cours',
    requis: 3,
    signataires: [
      { id: 's1', name: 'Marie Laurent',    initials: 'ML', role: 'Gérante',        status: 'approved', time: 'Il y a 2h',   isSelf: true },
      { id: 's2', name: 'Jean-Pierre Louis', initials: 'JP', role: 'Co-fondateur',   status: 'pending',  time: 'En attente' },
      { id: 's3', name: 'Sophie Bernard',   initials: 'SB', role: 'Trésorière',     status: 'approved', time: 'Il y a 5h' },
    ],
  },
];

const HISTORIQUE: WithdrawalRequest[] = [
  {
    id: 'h1',
    projet: 'Lolo Moderne',
    montant: 8000,
    disponible: 0,
    destination: 'Crédit Agricole Martinique',
    iban: 'FR76 1234 5678 9012 3456 789',
    motif: 'Premier acompte local commercial',
    date: '18 juin 2026',
    expireIn: '',
    status: 'execute',
    requis: 3,
    signataires: [
      { id: 's1', name: 'Marie Laurent',    initials: 'ML', role: 'Gérante',      status: 'approved', time: '18 juin 14:30', isSelf: true },
      { id: 's2', name: 'Jean-Pierre Louis', initials: 'JP', role: 'Co-fondateur', status: 'approved', time: '18 juin 15:12' },
      { id: 's3', name: 'Sophie Bernard',   initials: 'SB', role: 'Trésorière',   status: 'approved', time: '18 juin 15:55' },
    ],
  },
  {
    id: 'h2',
    projet: 'Coopérative Agricole',
    montant: 5000,
    disponible: 0,
    destination: 'BNP Paribas Guadeloupe',
    iban: 'FR76 9876 5432 1098 7654 321',
    motif: 'Achat semences et matériel agricole',
    date: '2 juin 2026',
    expireIn: '',
    status: 'execute',
    requis: 3,
    signataires: [
      { id: 's1', name: 'Marie Laurent',    initials: 'ML', role: 'Gérante',      status: 'approved', time: '2 juin 10:00', isSelf: true },
      { id: 's2', name: 'Jean-Pierre Louis', initials: 'JP', role: 'Co-fondateur', status: 'approved', time: '2 juin 11:30' },
      { id: 's3', name: 'Sophie Bernard',   initials: 'SB', role: 'Trésorière',   status: 'approved', time: '2 juin 12:45' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusConfig: Record<WithdrawStatus, { label: string; color: string; bg: string }> = {
  en_cours: { label: 'En cours',  color: '#D97706', bg: 'bg-[#FEF3C7]' },
  valide:   { label: 'Validé',    color: '#006D77', bg: 'bg-[#D1FAE5]' },
  rejete:   { label: 'Rejeté',    color: '#EF4444', bg: 'bg-[#FEE2E2]' },
  execute:  { label: 'Exécuté',   color: '#64748B', bg: 'bg-[#F1F5F9]' },
};

export function MultiSignatureValidationScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [flow, setFlow]           = useState<FlowStep>('liste');
  const [detailId, setDetailId]   = useState<string | null>(null);
  const [showHisto, setShowHisto] = useState(false);
  const [requests, setRequests]   = useState<WithdrawalRequest[]>(INITIAL_REQUESTS);
  const [signConfirmId, setSignConfirmId] = useState<string | null>(null);
  const [signed, setSigned]       = useState<string[]>([]);
  const [executeConfirm, setExecuteConfirm] = useState<string | null>(null);
  const [executed, setExecuted]   = useState<string[]>([]);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [modifyId, setModifyId]   = useState<string | null>(null);
  const [modifyMontant, setModifyMontant] = useState('');

  // Form initier
  const [form, setForm] = useState({
    projetId: '', montant: '', destination: '', iban: '', motif: '',
  });
  const [formStep, setFormStep]   = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);

  const bg   = isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]';
  const card = isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]';
  const txt  = isDarkMode ? 'text-white'   : 'text-[#0F172A]';
  const sub  = isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const inp  = isDarkMode
    ? 'bg-[#0F172A] border-[#334155] text-white placeholder:text-white/30'
    : 'border-[#E2E8F0] text-[#0F172A]';

  const selectedProject = PROJECTS_DISPO.find(p => p.id === form.projetId);

  // Signer une demande
  const handleSign = (reqId: string) => {
    setRequests(rs => rs.map(r => {
      if (r.id !== reqId) return r;
      const updated = r.signataires.map(s =>
        s.isSelf ? { ...s, status: 'approved' as const, time: "À l'instant" } : s
      );
      const approvedCount = updated.filter(s => s.status === 'approved').length;
      return {
        ...r,
        signataires: updated,
        status: approvedCount >= r.requis ? 'valide' : 'en_cours',
      };
    }));
    setSigned(prev => [...prev, reqId]);
    setSignConfirmId(null);
  };

  // Annuler une demande
  const handleCancel = (reqId: string) => {
    setRequests(rs => rs.filter(r => r.id !== reqId));
    setCancelConfirmId(null);
  };

  // Modifier le montant d'une demande
  const handleModify = (reqId: string) => {
    const val = parseFloat(modifyMontant);
    if (!val || isNaN(val)) return;
    setRequests(rs => rs.map(r => r.id === reqId
      ? { ...r, montant: val, signataires: r.signataires.map(s => ({ ...s, status: 'pending' as const, time: 'En attente' })) }
      : r
    ));
    setSigned(prev => prev.filter(id => id !== reqId));
    setModifyId(null);
    setModifyMontant('');
  };

  // Exécuter un retrait validé
  const handleExecute = (reqId: string) => {
    setRequests(rs => rs.map(r => r.id === reqId ? { ...r, status: 'execute' } : r));
    setExecuted(prev => [...prev, reqId]);
    setExecuteConfirm(null);
  };

  // Soumettre une demande
  const handleSubmit = () => {
    const proj = PROJECTS_DISPO.find(p => p.id === form.projetId);
    if (!proj) return;
    const newReq: WithdrawalRequest = {
      id: `r${Date.now()}`,
      projet: proj.name,
      montant: parseFloat(form.montant),
      disponible: proj.disponible,
      destination: form.destination,
      iban: form.iban,
      motif: form.motif,
      date: '4 juillet 2026',
      expireIn: '48h restantes',
      status: 'en_cours',
      requis: 3,
      signataires: [
        { id: 's1', name: 'Marie Laurent',    initials: 'ML', role: 'Gérante',      status: 'approved', time: "À l'instant", isSelf: true },
        { id: 's2', name: 'Jean-Pierre Louis', initials: 'JP', role: 'Co-fondateur', status: 'pending',  time: 'En attente' },
        { id: 's3', name: 'Sophie Bernard',   initials: 'SB', role: 'Trésorière',   status: 'pending',  time: 'En attente' },
      ],
    };
    setRequests(rs => [newReq, ...rs]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFlow('liste'); setForm({ projetId:'', montant:'', destination:'', iban:'', motif:'' }); setFormStep(1); }, 2200);
  };

  const detail = requests.find(r => r.id === detailId);
  const allRequests = [...requests, ...HISTORIQUE];

  // ── VUE DÉTAIL ────────────────────────────────────────────────────────────
  if (flow === 'detail' && detail) {
    const approvedCount = detail.signataires.filter(s => s.status === 'approved').length;
    const pct = Math.round((approvedCount / detail.requis) * 100);
    const isValide   = detail.status === 'valide'  || approvedCount >= detail.requis;
    const isExecuted = detail.status === 'execute' || executed.includes(detail.id);
    const selfSigned = signed.includes(detail.id);
    const selfSig    = detail.signataires.find(s => s.isSelf);
    const canSign    = selfSig && selfSig.status === 'pending' && !selfSigned && !isValide && !isExecuted;

    return (
      <div className={`min-h-screen pb-28 ${bg}`}>
        {/* Header */}
        <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
          <button onClick={() => setFlow('liste')} className="mb-5 text-white/70 flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /><span className="text-sm">Retour</span>
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Demande de retrait</h1>
              <p className="text-white/60 text-xs">{detail.projet} · {detail.date}</p>
            </div>
          </div>
          {/* Progression */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">Signatures collectées</span>
              <span className="text-white font-bold">{approvedCount}/{detail.requis}</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-700 rounded-full"
                style={{ width: `${pct}%` }} />
            </div>
            {detail.expireIn && !isValide && !isExecuted && (
              <p className="text-white/50 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" /> Expire dans {detail.expireIn}
              </p>
            )}
            {(isValide || isExecuted) && (
              <p className="text-[#D4AF37] text-xs flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                {isExecuted ? 'Retrait exécuté' : 'Toutes les signatures reçues'}
              </p>
            )}
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Détails financiers */}
          <div className={`rounded-2xl border ${card} shadow-md overflow-hidden`}>
            <div className={`px-5 py-3 border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}>
              <p className={`text-sm font-semibold ${txt}`}>Détails du retrait</p>
            </div>
            {[
              { label: 'Montant demandé',   value: `${detail.montant.toLocaleString()} €`, bold: true, color: '#006D77' },
              { label: 'Projet source',     value: detail.projet },
              { label: 'Compte destination',value: detail.destination },
              { label: 'IBAN',              value: detail.iban },
              { label: 'Motif',             value: detail.motif },
            ].map((row, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-3 border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#F8FAFC]'} last:border-0`}>
                <span className={`text-xs ${sub}`}>{row.label}</span>
                <span className={`text-sm ${row.bold ? 'font-bold' : 'font-medium'} ${txt}`}
                  style={row.color ? { color: row.color } : {}}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Signataires */}
          <div className={`rounded-2xl border ${card} shadow-md overflow-hidden`}>
            <div className={`px-5 py-3 border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'} flex items-center gap-2`}>
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <p className={`text-sm font-semibold ${txt}`}>Co-signataires requis</p>
            </div>
            <div className="divide-y" style={{ borderColor: isDarkMode ? '#334155' : '#F8FAFC' }}>
              {detail.signataires.map((s) => {
                const isApproved = s.status === 'approved' || (s.isSelf && selfSigned);
                return (
                  <div key={s.id} className="flex items-center gap-3 px-5 py-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                      isApproved ? 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'
                      : s.status === 'rejected' ? 'bg-red-400'
                      : isDarkMode ? 'bg-[#334155]' : 'bg-[#E2E8F0]'
                    }`}>
                      {isApproved ? <CheckCircle2 className="w-5 h-5 text-white" /> : s.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm font-semibold truncate ${txt}`}>{s.name}</p>
                        {s.isSelf && <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded-full font-bold">Vous</span>}
                      </div>
                      <p className={`text-xs ${sub}`}>{s.role} · {isApproved ? (s.isSelf && selfSigned ? "À l'instant" : s.time) : s.time}</p>
                    </div>
                    <div>
                      {isApproved && <span className="text-xs font-semibold text-[#006D77] flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Signé</span>}
                      {!isApproved && s.status === 'pending' && !s.isSelf && <span className="text-xs text-[#D97706] flex items-center gap-1"><Clock className="w-4 h-4 animate-pulse" /> Attente</span>}
                      {!isApproved && s.status === 'rejected' && <span className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-4 h-4" /> Refusé</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerte sécurité */}
          <div className="bg-[#E0F2FE] rounded-xl p-4 border border-[#006D77]/30 flex gap-3">
            <Shield className="w-5 h-5 text-[#006D77] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#0369A1] leading-relaxed">
              <strong>Sécurité anti-fraude :</strong> Les {detail.requis} co-signataires doivent approuver avant que les fonds soient libérés. En cas de refus d'un signataire, la demande est annulée.
            </p>
          </div>

          {/* Actions */}
          {canSign && (
            <button
              onClick={() => setSignConfirmId(detail.id)}
              className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Fingerprint className="w-5 h-5" /> Apposer ma signature
            </button>
          )}

          {(isValide && !isExecuted) && (
            <button
              onClick={() => setExecuteConfirm(detail.id)}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowDownToLine className="w-5 h-5" /> Exécuter le retrait
            </button>
          )}

          {isExecuted && (
            <div className="bg-[#D1FAE5] rounded-2xl p-5 border-2 border-[#006D77] text-center">
              <CheckCircle2 className="w-12 h-12 text-[#006D77] mx-auto mb-2" />
              <p className="text-[#006D77] font-bold text-sm">Retrait exécuté</p>
              <p className="text-[#006D77] text-xs mt-1">Les fonds seront crédités sous 1–2 jours ouvrés.</p>
            </div>
          )}
        </div>

        {/* Modal signature */}
        {signConfirmId === detail.id && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSignConfirmId(null)} />
            <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
              <div className="w-16 h-16 bg-[#006D77]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fingerprint className="w-8 h-8 text-[#006D77]" />
              </div>
              <h3 className={`text-lg font-bold text-center mb-2 ${txt}`}>Confirmer ma signature</h3>
              <div className={`rounded-xl p-3 mb-4 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
                <p className={`text-xs text-center ${sub}`}>Retrait de</p>
                <p className="text-xl font-bold text-[#006D77] text-center">{detail.montant.toLocaleString()} €</p>
                <p className={`text-xs text-center ${sub} mt-1`}>{detail.motif}</p>
              </div>
              <p className={`text-xs text-center mb-5 ${sub}`}>
                En signant, vous confirmez avoir vérifié les détails de cette demande et en approuvez l'exécution.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setSignConfirmId(null)} className={`flex-1 py-3.5 rounded-xl text-sm font-medium border-2 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                  Annuler
                </button>
                <button onClick={() => handleSign(detail.id)} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white text-sm font-bold shadow-lg">
                  Signer ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal exécution */}
        {executeConfirm === detail.id && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExecuteConfirm(null)} />
            <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowDownToLine className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className={`text-lg font-bold text-center mb-1 ${txt}`}>Exécuter le retrait ?</h3>
              <p className={`text-2xl font-bold text-center text-[#006D77] mb-1`}>{detail.montant.toLocaleString()} €</p>
              <p className={`text-xs text-center mb-5 ${sub}`}>Vers {detail.destination}</p>
              <p className={`text-xs text-center mb-5 ${sub}`}>
                Toutes les signatures sont réunies. Les fonds seront transférés sous 1–2 jours ouvrés.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setExecuteConfirm(null)} className={`flex-1 py-3.5 rounded-xl text-sm font-medium border-2 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                  Annuler
                </button>
                <button onClick={() => handleExecute(detail.id)} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg">
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── FORMULAIRE INITIER ────────────────────────────────────────────────────
  if (flow === 'initier') {
    if (submitted) {
      return (
        <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-5 px-8`}>
          <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className={`text-xl font-bold text-center ${txt}`}>Demande envoyée !</h2>
          <p className={`text-sm text-center ${sub}`}>
            Les co-signataires ont été notifiés. Le retrait sera exécuté dès que les 3 signatures seront collectées.
          </p>
        </div>
      );
    }

    const FORM_STEPS = [
      { id: 1, label: 'Projet & Montant' },
      { id: 2, label: 'Compte bancaire' },
      { id: 3, label: 'Récapitulatif' },
    ];

    return (
      <div className={`min-h-screen pb-28 ${bg}`}>
        <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
          <button onClick={() => setFlow('liste')} className="mb-5 text-white/70 flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /><span className="text-sm">Retour</span>
          </button>
          <h1 className="text-white text-xl font-bold mb-1">Initier un retrait</h1>
          <p className="text-white/60 text-sm mb-5">Les fonds seront débloqués après 3 signatures</p>
          {/* Stepper */}
          <div className="flex items-center justify-between">
            {FORM_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all ${s.id < formStep ? 'bg-[#D4AF37]' : s.id === formStep ? 'bg-white' : 'bg-white/20'}`}>
                    {s.id < formStep
                      ? <CheckCircle2 className="w-4 h-4 text-white" />
                      : <span className={`text-xs font-bold ${s.id === formStep ? 'text-[#006D77]' : 'text-white/50'}`}>{s.id}</span>
                    }
                  </div>
                  <p className={`text-[10px] text-center ${s.id <= formStep ? 'text-white' : 'text-white/40'}`}>{s.label}</p>
                </div>
                {i < FORM_STEPS.length - 1 && <div className={`h-px flex-1 mx-2 mb-5 ${s.id < formStep ? 'bg-[#D4AF37]' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-5">
          <div className={`rounded-2xl border ${card} shadow-md p-5`}>

            {/* Étape 1 */}
            {formStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>Projet source <span className="text-red-500">*</span></label>
                  <div className="space-y-2">
                    {PROJECTS_DISPO.map(p => (
                      <button key={p.id} onClick={() => setForm({ ...form, projetId: p.id })}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${form.projetId === p.id ? 'border-[#006D77] bg-[#006D77]/5' : isDarkMode ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                        <div className="text-left">
                          <p className={`text-sm font-semibold ${txt}`}>{p.name}</p>
                          <p className={`text-xs ${sub}`}>Disponible</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#006D77]">{p.disponible.toLocaleString()} €</p>
                          {form.projetId === p.id && <CheckCircle2 className="w-4 h-4 text-[#006D77] ml-auto mt-1" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>Montant à retirer (€) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${sub}`}>€</span>
                    <input type="number" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })}
                      placeholder="Ex: 10 000"
                      className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/30 ${inp}`} />
                  </div>
                  {selectedProject && form.montant && parseFloat(form.montant) > selectedProject.disponible && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Dépasse le solde disponible ({selectedProject.disponible.toLocaleString()} €)
                    </p>
                  )}
                </div>

                <div>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>Motif du retrait <span className="text-red-500">*</span></label>
                  <input type="text" value={form.motif} onChange={e => setForm({ ...form, motif: e.target.value })}
                    placeholder="Ex: Achat équipements, loyer local..."
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/30 ${inp}`} />
                </div>
              </div>
            )}

            {/* Étape 2 */}
            {formStep === 2 && (
              <div className="space-y-5">
                <div className="bg-[#E0F2FE] rounded-xl p-3 border border-[#006D77]/30 flex gap-2">
                  <Building2 className="w-5 h-5 text-[#006D77] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#0369A1]">Les fonds seront virés sur le compte bancaire enregistré ci-dessous. Vérifiez l'IBAN avec soin.</p>
                </div>
                <div>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>Banque / Nom du compte <span className="text-red-500">*</span></label>
                  <input type="text" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })}
                    placeholder="Ex: Crédit Agricole Martinique"
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/30 ${inp}`} />
                </div>
                <div>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>IBAN <span className="text-red-500">*</span></label>
                  <input type="text" value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })}
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/30 font-mono ${inp}`} />
                </div>
              </div>
            )}

            {/* Étape 3 — Récapitulatif */}
            {formStep === 3 && (
              <div className="space-y-4">
                <p className={`text-sm font-semibold ${txt}`}>Vérifiez avant d'envoyer aux co-signataires</p>
                {[
                  { label: 'Projet source',      value: selectedProject?.name || '—' },
                  { label: 'Montant',            value: `${parseFloat(form.montant || '0').toLocaleString()} €`, bold: true, color: '#006D77' },
                  { label: 'Banque destination', value: form.destination },
                  { label: 'IBAN',               value: form.iban, mono: true },
                  { label: 'Motif',              value: form.motif },
                ].map((row, i) => (
                  <div key={i} className={`flex items-start justify-between p-3 rounded-xl ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
                    <span className={`text-xs ${sub}`}>{row.label}</span>
                    <span className={`text-sm text-right ml-4 ${row.bold ? 'font-bold' : 'font-medium'} ${row.mono ? 'font-mono' : ''} ${txt}`}
                      style={row.color ? { color: row.color } : {}}>
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-[#FEF9E7] border-[#D4AF37]/30'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#92400E]'}`}>
                    🔐 <strong>3 co-signataires</strong> seront notifiés et devront approuver avant l'exécution du virement.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation form */}
          <div className="flex gap-3 mt-5">
            {formStep > 1 && (
              <button onClick={() => setFormStep(s => (s - 1) as 1 | 2 | 3)}
                className={`flex-1 py-4 rounded-xl text-sm font-medium border-2 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                Précédent
              </button>
            )}
            {formStep < 3 ? (
              <button
                onClick={() => setFormStep(s => (s + 1) as 1 | 2 | 3)}
                disabled={
                  (formStep === 1 && (!form.projetId || !form.montant || !form.motif)) ||
                  (formStep === 2 && (!form.destination || !form.iban))
                }
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white text-sm font-bold shadow-lg disabled:opacity-40">
                Suivant
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg">
                Envoyer aux co-signataires
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── VUE LISTE ─────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen pb-28 ${bg}`}>
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-5 text-white/70 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /><span className="text-sm">Retour</span>
        </button>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-white text-xl font-bold">Retraits de fonds</h1>
            <p className="text-white/60 text-sm">Validation multi-signatures</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'En cours',  value: requests.filter(r => r.status === 'en_cours').length, color: '#D97706' },
            { label: 'Validés',   value: requests.filter(r => r.status === 'valide').length,   color: '#D4AF37' },
            { label: 'Exécutés', value: HISTORIQUE.length + executed.length,                   color: '#94A3B8' },
          ].map(k => (
            <div key={k.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
              <p className="text-white/50 text-[10px] mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Demandes actives */}
        <div className="flex items-center justify-between">
          <p className={`text-sm font-semibold ${txt}`}>Demandes en cours</p>
          <button onClick={() => setFlow('initier')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006D77] text-white text-xs font-bold rounded-full shadow">
            <Plus className="w-3.5 h-3.5" /> Nouveau retrait
          </button>
        </div>

        {requests.length === 0 && (
          <div className={`rounded-2xl border ${card} p-8 text-center`}>
            <Banknote className={`w-10 h-10 mx-auto mb-3 ${sub}`} />
            <p className={`text-sm ${sub}`}>Aucune demande en cours</p>
          </div>
        )}

        {requests.map(req => {
          const approved = req.signataires.filter(s => s.status === 'approved').length;
          const isExec   = executed.includes(req.id) || req.status === 'execute';
          const isValide = !isExec && (approved >= req.requis || req.status === 'valide');
          const status   = isExec ? 'execute' : (isValide ? 'valide' : req.status);
          const cfg      = statusConfig[status];
          const canModify = status === 'en_cours';
          const canCancel = status === 'en_cours' || isValide;

          return (
            <div key={req.id} className={`rounded-2xl border ${card} shadow-md overflow-hidden`}>
              {/* Corps cliquable → détail */}
              <button onClick={() => { setDetailId(req.id); setFlow('detail'); }}
                className="w-full p-5 text-left">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`text-sm font-bold ${txt}`}>{req.montant.toLocaleString()} €</p>
                    <p className={`text-xs ${sub} mt-0.5`}>{req.projet}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.bg}`} style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
                <p className={`text-xs ${sub} mb-3 truncate`}>{req.motif}</p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {req.signataires.map((s, i) => {
                      const ok = s.status === 'approved' || (s.isSelf && signed.includes(req.id));
                      return (
                        <div key={i} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white ${ok ? 'bg-[#006D77] border-white' : isDarkMode ? 'bg-[#334155] border-[#1E293B]' : 'bg-[#E2E8F0] border-white'}`}>
                          {ok ? '✓' : s.initials}
                        </div>
                      );
                    })}
                  </div>
                  <p className={`text-xs ${sub}`}>{approved}/{req.requis} signatures</p>
                  {req.expireIn && !isExec && status === 'en_cours' && (
                    <p className="text-[10px] text-[#D97706] ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {req.expireIn}
                    </p>
                  )}
                  <ChevronRight className={`w-4 h-4 ${sub} ml-auto`} />
                </div>
              </button>

              {/* Barre d'actions */}
              {(canModify || canCancel) && (
                <div className={`flex border-t ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}>
                  {canModify && (
                    <button
                      onClick={() => { setModifyId(req.id); setModifyMontant(String(req.montant)); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors border-r ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}
                    >
                      <Pencil className="w-3.5 h-3.5" /> Modifier
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => setCancelConfirmId(req.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Annuler
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Historique */}
        <button onClick={() => setShowHisto(!showHisto)}
          className={`w-full flex items-center justify-between py-3 ${sub} text-sm font-medium`}>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Historique des retraits ({HISTORIQUE.length + executed.length})
          </div>
          <ChevronRight className={`w-4 h-4 transition-transform ${showHisto ? 'rotate-90' : ''}`} />
        </button>

        {/* ── Modal Modifier montant ── */}
        {modifyId && (() => {
          const req = requests.find(r => r.id === modifyId);
          if (!req) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModifyId(null)} />
              <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${txt}`}>Modifier la demande</h3>
                  <button onClick={() => setModifyId(null)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-[#F1F5F9]'}`}>
                    <X className="w-4 h-4 text-[#64748B]" />
                  </button>
                </div>
                <p className={`text-xs mb-4 ${sub}`}>
                  Modifier le montant réinitialisera les signatures déjà collectées. Les co-signataires seront re-notifiés.
                </p>
                <div className={`rounded-xl p-3 mb-4 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
                  <p className={`text-xs ${sub} mb-0.5`}>Projet · {req.projet}</p>
                  <p className={`text-xs ${sub}`}>Disponible · {req.disponible.toLocaleString()} €</p>
                </div>
                <label className={`text-sm font-semibold mb-2 block ${txt}`}>Nouveau montant (€)</label>
                <div className="relative mb-4">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${sub}`}>€</span>
                  <input
                    type="number"
                    value={modifyMontant}
                    onChange={e => setModifyMontant(e.target.value)}
                    className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${isDarkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'border-[#E2E8F0]'}`}
                  />
                </div>
                {parseFloat(modifyMontant) > req.disponible && (
                  <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Dépasse le solde disponible
                  </p>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setModifyId(null)} className={`flex-1 py-3.5 rounded-xl text-sm font-medium border-2 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                    Annuler
                  </button>
                  <button
                    onClick={() => handleModify(req.id)}
                    disabled={!modifyMontant || parseFloat(modifyMontant) <= 0 || parseFloat(modifyMontant) > req.disponible}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg disabled:opacity-40"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Modal Annuler demande ── */}
        {cancelConfirmId && (() => {
          const req = requests.find(r => r.id === cancelConfirmId);
          if (!req) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCancelConfirmId(null)} />
              <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className={`text-lg font-bold text-center mb-2 ${txt}`}>Annuler cette demande ?</h3>
                <div className={`rounded-xl p-3 my-4 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'} text-center`}>
                  <p className="text-xl font-bold text-red-500">{req.montant.toLocaleString()} €</p>
                  <p className={`text-xs ${sub} mt-0.5`}>{req.motif}</p>
                </div>
                <p className={`text-xs text-center mb-5 ${sub}`}>
                  Les signatures déjà collectées seront perdues. Les co-signataires seront notifiés de l'annulation.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setCancelConfirmId(null)} className={`flex-1 py-3.5 rounded-xl text-sm font-medium border-2 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                    Conserver
                  </button>
                  <button onClick={() => handleCancel(req.id)} className="flex-1 py-3.5 rounded-xl bg-red-500 text-white text-sm font-bold shadow-lg">
                    Annuler la demande
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {showHisto && [...HISTORIQUE, ...requests.filter(r => executed.includes(r.id))].map(req => (
          <button key={req.id} onClick={() => { setDetailId(req.id); setFlow('detail'); }}
            className={`w-full rounded-2xl border ${card} shadow-sm p-4 text-left opacity-80`}>
            <div className="flex items-center justify-between mb-1">
              <p className={`text-sm font-bold ${txt}`}>{req.montant.toLocaleString()} €</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig.execute.bg}`} style={{ color: statusConfig.execute.color }}>
                Exécuté
              </span>
            </div>
            <p className={`text-xs ${sub}`}>{req.projet} · {req.date}</p>
            <p className={`text-xs ${sub} truncate mt-0.5`}>{req.motif}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
