import { ArrowLeft, Send, Scan, Clock, User, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';

interface RecentRecipient {
  name: string;
  avatar: string;
  lastDate: string;
}

export function SendMoneyScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user, profile } = useAuth();
  const supabase = getSupabase();

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [recentContacts, setRecentContacts] = useState<RecentRecipient[]>([]);

  // Charger les destinataires récents depuis les transactions réelles
  useEffect(() => {
    if (!user) return;
    const fetchRecents = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('description, created_at')
          .eq('user_id', user.id)
          .eq('type', 'transfer')
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data) {
          const recentsMap = new Map<string, string>();
          data.forEach((tx) => {
            if (tx.description) {
              const match = tx.description.match(/(?:vers|à|→)\s+([^,\.]+)/i);
              const targetName = match ? match[1].trim() : null;
              if (targetName && !recentsMap.has(targetName)) {
                recentsMap.set(targetName, tx.created_at);
              }
            }
          });

          const list: RecentRecipient[] = Array.from(recentsMap.entries()).map(([name, dateStr]) => {
            const date = new Date(dateStr);
            const initials = name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || 'KB';

            return {
              name,
              avatar: initials,
              lastDate: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            };
          });

          setRecentContacts(list.slice(0, 5));
        }
      } catch (err) {
        console.error('Erreur chargement récents:', err);
      }
    };

    fetchRecents();
  }, [user]);

  return (
    <div
      className={`min-h-screen pb-24 transition-colors ${
        isDarkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]'
      }`}
    >
      <div
        className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]'
            : 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'
        }`}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <h1 className="text-white text-2xl font-bold mb-1">Envoyer de l'argent</h1>
        <p className="text-white/80 text-sm">
          Solde disponible : <strong className="text-white">{(profile?.balance ?? 0).toFixed(2)} €</strong>
        </p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div
          className={`rounded-2xl p-6 shadow-xl border ${
            isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}
        >
          <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Montant du transfert
          </label>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              min="0.5"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`flex-1 text-3xl font-bold bg-transparent border-0 focus:outline-none ${
                isDarkMode ? 'text-white placeholder-[#64748B]' : 'text-[#0F172A] placeholder-[#94A3B8]'
              }`}
            />
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>€</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-5">
            {['10', '25', '50', '100'].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-2 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                  amount === val
                    ? 'bg-[#006D77] text-white shadow-md'
                    : isDarkMode
                    ? 'bg-[#334155] text-white'
                    : 'bg-[#F1F5F9] text-[#0F172A]'
                }`}
              >
                +{val}€
              </button>
            ))}
          </div>

          <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Destinataire (Numéro de téléphone ou Nom)
          </label>
          <div className="relative mb-4">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="+33 6... ou Nom complet"
              className={`w-full py-3.5 px-4 pr-11 rounded-xl border text-sm ${
                isDarkMode
                  ? 'bg-[#334155] border-[#475569] text-white placeholder-[#64748B]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8]'
              } focus:outline-none focus:border-[#006D77]`}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-1">
              <Scan className="w-5 h-5 text-[#006D77]" />
            </button>
          </div>

          <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Motif / Libellé (optionnel)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: Participation repas, loyer, remboursement..."
            rows={2}
            className={`w-full py-3 px-4 rounded-xl border text-sm ${
              isDarkMode
                ? 'bg-[#334155] border-[#475569] text-white placeholder-[#64748B]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8]'
            } focus:outline-none focus:border-[#006D77] resize-none`}
          ></textarea>
        </div>

        {recentContacts.length > 0 && (
          <div>
            <h3 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Contacts récents
            </h3>
            <div className="space-y-2">
              {recentContacts.map((contact, index) => (
                <button
                  key={index}
                  onClick={() => setRecipient(contact.name)}
                  className={`w-full rounded-2xl p-4 flex items-center justify-between border cursor-pointer text-left ${
                    recipient === contact.name
                      ? 'border-[#006D77] bg-[#006D77]/5'
                      : isDarkMode
                      ? 'bg-[#1E293B] border-[#334155]'
                      : 'bg-white border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white text-xs font-bold">
                      {contact.avatar}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                        {contact.name}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                        Dernier transfert le {contact.lastDate}
                      </p>
                    </div>
                  </div>
                  <Clock className={`w-4 h-4 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          disabled={!amount || !recipient || parseFloat(amount) <= 0}
          onClick={() => {
            if (!amount || !recipient) return;
            navigate('/kauri/transfer-confirm', { state: { amount, recipient, message } });
          }}
          className={`w-full py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 border-none font-bold text-sm cursor-pointer transition-all ${
            amount && recipient && parseFloat(amount) > 0
              ? 'bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white hover:opacity-95'
              : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          <span>Continuer vers la confirmation ({amount ? `${parseFloat(amount).toFixed(2)} €` : '0.00 €'})</span>
        </button>
      </div>
    </div>
  );
}
