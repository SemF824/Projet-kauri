import { ArrowLeft, RefreshCw, Send, ArrowDownToLine, TrendingUp, Globe } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSupabase } from '../../utils/supabase';

interface Transaction {
  type: 'deposit' | 'withdrawal' | 'tontine_pay' | 'tontine_payout' | 'swap_fee' | 'transfer';
  amount: number;
  currency: string;
  description: string | null;
  created_at: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export function GlobalWalletScreen() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [liveRates, setLiveRates] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);

  const balanceEur = profile?.balance ?? 2450.00;
  const balanceXof = profile?.balanceXof ?? 1600000;
  const balanceUsdt = profile?.balanceUsdt ?? 1250;

  // Calcul du solde global en EUR (Taux convertis)
  const eurToXofRate = 655.957;
  const usdtToEurRate = 0.92;
  const totalValueEur = balanceEur + (balanceXof / eurToXofRate) + (balanceUsdt * usdtToEurRate);

  const currencies = [
    { code: 'EUR', symbol: '€', balance: balanceEur, change: '+2.5%', color: '#0A847E' },
    { code: 'XOF', symbol: 'F CFA', balance: balanceXof, change: 'Stable', color: '#D4A373' },
    { code: 'USDT', symbol: '$', balance: balanceUsdt, change: '+0.2%', color: '#16A34A' },
  ];

  const exchangeRates = [
    { from: 'EUR', to: 'XOF', rate: '655.96', trend: 'stable' },
    { from: 'USDT', to: 'EUR', rate: '0.92', trend: 'up' },
    { from: 'EUR', to: 'USDT', rate: '1.08', trend: 'down' },
  ];

  // 1. Récupération des transactions de la table Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data) {
          setTransactions(data as any[]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des transactions:', err);
      } finally {
        setLoadingTx(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const handleRefresh = async () => {
    await refreshProfile();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#0A847E] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-2xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2 border-none bg-transparent cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl mb-1">Global Wallet</h1>
            <p className="text-[#E0F2FE] text-sm">Tableau de bord multi-devises</p>
          </div>
          <Globe className="w-8 h-8 text-[#D4A373]" />
        </div>

        {/* VALEUR TOTALE */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#E0F2FE] text-xs uppercase tracking-wide">Valeur Totale Équivalente (EUR)</span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all bg-white/20 text-white border-none cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Actualiser</span>
            </button>
          </div>
          <h2 className="text-white text-4xl mb-1 font-black">
            {totalValueEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </h2>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#34D399]" />
            <span className="text-[#34D399] text-sm">+3.2% ce mois-ci</span>
          </div>
        </div>

        <button className="w-full bg-[#D4A373] hover:bg-[#C9A02C] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl border-none font-bold cursor-pointer transition-all">
          <Send className="w-5 h-5" />
          <span>Transférer à l'international</span>
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* SOLDES PAR DEVISE */}
        <div>
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2 font-bold">
            <div className="w-1 h-5 bg-[#D4A373] rounded-full"></div>
            Vos Soldes
          </h3>
          <div className="space-y-3">
            {currencies.map((currency, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-md border border-[#E2E8F0] hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${currency.color}15` }}
                    >
                      <span className="text-lg font-bold" style={{ color: currency.color }}>
                        {currency.symbol}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#0F172A] font-bold mb-1">{currency.code}</p>
                      <p className="text-[#64748B] text-xs">Solde Disponible</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0F172A] text-lg font-black mb-1">
                      {currency.balance.toLocaleString('fr-FR', {
                        minimumFractionDigits: currency.code === 'XOF' ? 0 : 2,
                        maximumFractionDigits: currency.code === 'XOF' ? 0 : 2,
                      })} {currency.code === 'XOF' ? 'F CFA' : currency.symbol}
                    </p>
                    <span
                      className={`text-xs ${
                        currency.change.startsWith('+') ? 'text-[#0D9488]' : 'text-[#F59E0B]'
                      }`}
                    >
                      {currency.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TAUX DE CHANGE */}
        <div>
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2 font-bold">
            <div className="w-1 h-5 bg-[#0A847E] rounded-full"></div>
            Taux de change en direct
          </h3>
          <div className="bg-white rounded-2xl p-5 shadow-md border border-[#E2E8F0]">
            <div className="space-y-4">
              {exchangeRates.map((rate, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-medium">
                      <span className="text-sm text-[#0F172A]">{rate.from}</span>
                      <span className="text-[#94A3B8]">→</span>
                      <span className="text-sm text-[#0F172A]">{rate.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-[#0F172A]">{rate.rate}</span>
                    <TrendingUp
                      className={`w-4 h-4 ${
                        rate.trend === 'up' ? 'text-[#0D9488]' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIVITÉ RÉCENTE */}
        <div>
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2 font-bold">
            <div className="w-1 h-5 bg-[#475569] rounded-full"></div>
            Activité Récente
          </h3>
          <div className="space-y-3">
            {loadingTx ? (
              <p className="text-center text-xs text-[#94A3B8]">Chargement de vos transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center text-xs text-[#94A3B8]">Aucune transaction récente.</p>
            ) : (
              transactions.map((tx, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-[#E2E8F0]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' || tx.type === 'tontine_payout'
                          ? 'bg-emerald-50 text-emerald-500'
                          : 'bg-rose-50 text-rose-500'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'tontine_payout' ? (
                        <ArrowDownToLine className="w-5 h-5" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-[#0F172A] text-sm font-bold mb-1">
                        {tx.description || tx.type.replace('_', ' ')}
                      </p>
                      <p className="text-[#94A3B8] text-xs">
                        {new Date(tx.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold mb-1 ${
                        tx.type === 'deposit' || tx.type === 'tontine_payout' ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'tontine_payout' ? '+' : '-'}
                      {tx.amount.toLocaleString()} {tx.currency}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full font-bold">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}