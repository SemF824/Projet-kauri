import { ArrowLeft, Plus, Send, ArrowDownRight, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function WalletPage() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const transactions = [
    {
      type: 'deposit',
      description: 'Bank Transfer',
      amount: 500,
      date: 'Apr 20, 2026',
      time: '14:30',
      status: 'completed',
    },
    {
      type: 'withdrawal',
      description: 'Family Circle Tontine - Payment',
      amount: 500,
      date: 'Apr 18, 2026',
      time: '09:15',
      status: 'completed',
    },
    {
      type: 'deposit',
      description: 'Tontine Pot Received',
      amount: 2500,
      date: 'Apr 15, 2026',
      time: '10:00',
      status: 'completed',
    },
    {
      type: 'withdrawal',
      description: 'Investment: Manioc Cooperative',
      amount: 1000,
      date: 'Apr 10, 2026',
      time: '16:45',
      status: 'completed',
    },
    {
      type: 'deposit',
      description: 'Bank Transfer',
      amount: 200,
      date: 'Apr 5, 2026',
      time: '11:20',
      status: 'completed',
    },
  ];

  const balance = 2450;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#F1F5F9] text-sm">Available Balance</span>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-white"
            >
              {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          <h1 className="text-white text-4xl mb-6">
            {balanceVisible ? `€${balance.toLocaleString()}.00` : '••••••'}
          </h1>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white text-[#0D9488] py-3 rounded-xl text-sm flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Add Money</span>
            </button>
            <button className="bg-[#F59E0B] text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              <span>Send Money</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#0F172A]">Transaction History</h3>
          <button className="text-[#0D9488] text-sm">Filter</button>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'deposit'
                      ? 'bg-[#D1FAE5]'
                      : 'bg-[#FEF3C7]'
                  }`}
                >
                  {transaction.type === 'deposit' ? (
                    <ArrowDownRight className="w-5 h-5 text-[#0D9488]" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-[#F59E0B]" />
                  )}
                </div>
                <div>
                  <p className="text-[#0F172A] text-sm mb-1">{transaction.description}</p>
                  <p className="text-[#94A3B8] text-xs">
                    {transaction.date} • {transaction.time}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-sm mb-1 ${
                    transaction.type === 'deposit' ? 'text-[#0D9488]' : 'text-[#F59E0B]'
                  }`}
                >
                  {transaction.type === 'deposit' ? '+' : '-'}€{transaction.amount.toLocaleString()}
                </p>
                <span className="inline-block px-2 py-0.5 bg-[#D1FAE5] text-[#0D9488] text-xs rounded-full">
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
