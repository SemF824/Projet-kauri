import { ArrowLeft, Send, User, Scan, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export function SendMoneyScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const recentContacts = [
    { name: 'Marie C.', avatar: 'MC', lastTransaction: 'Il y a 2 jours' },
    { name: 'Pierre D.', avatar: 'PD', lastTransaction: 'Il y a 1 semaine' },
    { name: 'Sophie L.', avatar: 'SL', lastTransaction: 'Il y a 2 semaines' },
  ];

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Envoyer de l'argent</h1>
        <p className="text-white/90 text-sm">Transfert instantané et sécurisé</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className={`rounded-2xl p-6 shadow-xl border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
          <label className={`block text-sm mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Montant
          </label>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`flex-1 text-3xl bg-transparent border-0 focus:outline-none ${isDarkMode ? 'text-white placeholder-[#64748B]' : 'text-[#0F172A] placeholder-[#94A3B8]'}`}
            />
            <span className={`text-2xl ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>€</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {['10', '25', '50', '100'].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-2 rounded-lg text-sm ${isDarkMode ? 'bg-[#334155] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'}`}
              >
                +{val}€
              </button>
            ))}
          </div>

          <label className={`block text-sm mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Destinataire
          </label>
          <div className="relative mb-4">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Nom ou @pseudo"
              className={`w-full py-3 px-4 rounded-xl border ${isDarkMode ? 'bg-[#334155] border-[#475569] text-white placeholder-[#64748B]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8]'} focus:outline-none focus:border-[#006D77]`}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Scan className="w-5 h-5 text-[#006D77]" />
            </button>
          </div>

          <label className={`block text-sm mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Message (optionnel)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ajoutez une note..."
            rows={3}
            className={`w-full py-3 px-4 rounded-xl border ${isDarkMode ? 'bg-[#334155] border-[#475569] text-white placeholder-[#64748B]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8]'} focus:outline-none focus:border-[#006D77] resize-none`}
          ></textarea>
        </div>

        <div>
          <h3 className={`mb-3 text-sm ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Contacts récents</h3>
          <div className="space-y-2">
            {recentContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => setRecipient(contact.name)}
                className={`w-full rounded-xl p-4 flex items-center justify-between border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white text-sm">
                    {contact.avatar}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{contact.name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{contact.lastTransaction}</p>
                  </div>
                </div>
                <Clock className={`w-4 h-4 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`} />
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={!amount || !recipient}
          onClick={() => {
            if (!amount || !recipient) return;
            navigate('/kauri/transfer-confirm', { state: { amount, recipient, message } });
          }}
          className={`w-full py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 ${
            amount && recipient
              ? 'bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white'
              : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          <span>Envoyer {amount ? `${amount}€` : ''}</span>
        </button>

        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#FEF3C7]/10 border border-[#D4AF37]/30' : 'bg-[#FEF3C7] border border-[#D4AF37]/30'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-[#FDE68A]' : 'text-[#92400E]'}`}>
            💡 <strong>Frais :</strong> Transferts gratuits entre membres KAURI. 0,50€ vers comptes externes.
          </p>
        </div>
      </div>
    </div>
  );
}
