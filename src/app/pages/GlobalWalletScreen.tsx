import { ArrowLeft, RefreshCw, Send, ArrowDownToLine, TrendingUp, Globe } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function GlobalWalletScreen() {
  const navigate = useNavigate();
  const [liveRates, setLiveRates] = useState(true);

  const currencies = [
    { code: 'EUR', symbol: '€', balance: 2450.00, change: '+2.5%', color: '#0A5C7A' },
    { code: 'CAD', symbol: 'C$', balance: 3200.50, change: '+1.8%', color: '#D4AF37' },
    { code: 'USD', symbol: '$', balance: 1850.75, change: '-0.5%', color: '#475569' },
  ];

  const exchangeRates = [
    { from: 'EUR', to: 'CAD', rate: '1.45', trend: 'up' },
    { from: 'EUR', to: 'USD', rate: '1.08', trend: 'down' },
    { from: 'CAD', to: 'USD', rate: '0.74', trend: 'up' },
  ];

  const recentTransactions = [
    {
      type: 'send',
      amount: 150,
      currency: 'EUR',
      recipient: 'Marie (Haiti)',
      date: 'Apr 20',
      status: 'completed',
    },
    {
      type: 'receive',
      amount: 500,
      currency: 'CAD',
      from: 'Tontine Payout',
      date: 'Apr 18',
      status: 'completed',
    },
    {
      type: 'exchange',
      amount: 200,
      currency: 'USD→EUR',
      from: 'Currency Exchange',
      date: 'Apr 15',
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#0A5C7A] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-2xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl mb-1">Global Wallet</h1>
            <p className="text-[#E0F2FE] text-sm">Multi-currency dashboard</p>
          </div>
          <Globe className="w-8 h-8 text-[#D4AF37]" />
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#E0F2FE] text-xs uppercase tracking-wide">Total Value (EUR)</span>
            <button
              onClick={() => setLiveRates(!liveRates)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                liveRates ? 'bg-[#D4AF37] text-[#0A5C7A]' : 'bg-white/20 text-white'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${liveRates ? 'animate-spin' : ''}`} />
              <span>Live Rates</span>
            </button>
          </div>
          <h2 className="text-white text-4xl mb-1">€7,501.25</h2>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#34D399]" />
            <span className="text-[#34D399] text-sm">+3.2% this month</span>
          </div>
        </div>

        <button className="w-full bg-[#D4AF37] hover:bg-[#C9A02C] text-[#0A5C7A] py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all">
          <Send className="w-5 h-5" />
          <span>Send to the Islands</span>
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#D4AF37] rounded-full"></div>
            Currency Balances
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
                      <span className="text-xl" style={{ color: currency.color }}>
                        {currency.symbol}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#0F172A] mb-1">{currency.code}</p>
                      <p className="text-[#64748B] text-xs">Available Balance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0F172A] text-lg mb-1">
                      {currency.symbol}{currency.balance.toLocaleString()}
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

        <div>
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#0A5C7A] rounded-full"></div>
            Live Exchange Rates
          </h3>
          <div className="bg-white rounded-2xl p-5 shadow-md border border-[#E2E8F0]">
            <div className="space-y-4">
              {exchangeRates.map((rate, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-[#0F172A]">{rate.from}</span>
                      <span className="text-[#94A3B8]">→</span>
                      <span className="text-sm text-[#0F172A]">{rate.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#0F172A]">{rate.rate}</span>
                    <TrendingUp
                      className={`w-4 h-4 ${
                        rate.trend === 'up' ? 'text-[#0D9488] rotate-0' : 'text-[#F59E0B] rotate-180'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#475569] rounded-full"></div>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentTransactions.map((tx, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-[#E2E8F0]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'send'
                        ? 'bg-[#FEF3C7]'
                        : tx.type === 'receive'
                        ? 'bg-[#D1FAE5]'
                        : 'bg-[#E0F2FE]'
                    }`}
                  >
                    {tx.type === 'send' ? (
                      <Send className="w-5 h-5 text-[#D4AF37]" />
                    ) : tx.type === 'receive' ? (
                      <ArrowDownToLine className="w-5 h-5 text-[#0D9488]" />
                    ) : (
                      <RefreshCw className="w-5 h-5 text-[#0A5C7A]" />
                    )}
                  </div>
                  <div>
                    <p className="text-[#0F172A] text-sm mb-1">
                      {tx.type === 'send' ? tx.recipient : tx.from}
                    </p>
                    <p className="text-[#94A3B8] text-xs">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm mb-1 ${
                      tx.type === 'send' ? 'text-[#F59E0B]' : 'text-[#0D9488]'
                    }`}
                  >
                    {tx.type === 'send' ? '-' : '+'}
                    {tx.amount} {tx.currency}
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-[#D1FAE5] text-[#0D9488] text-xs rounded-full">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
