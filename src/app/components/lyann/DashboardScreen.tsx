import { Eye, EyeOff, Users, TrendingUp, MessageCircle, Star, Bell, Settings, Globe, Shield, BookOpen, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function DashboardScreen() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#F59E0B] flex items-center justify-center text-white border-2 border-white">
              JD
            </div>
            <div>
              <h2 className="text-white">Jean Dupont</h2>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
                <span className="text-[#F1F5F9] text-xs ml-1">Trust Score</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#F1F5F9] text-sm">Wallet Balance</span>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-white"
            >
              {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <h1 className="text-white text-3xl mb-4">
            {balanceVisible ? '€2,450.00' : '••••••'}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/wallet')}
              className="flex-1 bg-white text-[#0D9488] py-3 rounded-xl text-sm"
            >
              Add Money
            </button>
            <button
              onClick={() => navigate('/wallet')}
              className="flex-1 bg-[#F59E0B] text-white py-3 rounded-xl text-sm"
            >
              Send Money
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
          <h3 className="text-[#0F172A] mb-3">Quick Access</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Users, label: 'Tontines', count: '3', color: '#0D9488' },
              { icon: TrendingUp, label: 'Invested', count: '2', color: '#F59E0B' },
              { icon: MessageCircle, label: 'Messages', count: '12', color: '#14B8A6' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <p className="text-xs text-[#64748B]">{item.label}</p>
                <p className="text-sm text-[#0F172A]">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-[#0F172A] mb-4">Your Financial Journey</h3>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/tontines')}
            className="w-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] rounded-2xl p-6 text-left shadow-lg active:scale-98 transition-transform"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                Active: 3
              </span>
            </div>
            <h3 className="text-white mb-1">Private Tontine</h3>
            <p className="text-[#F1F5F9] text-sm">Personal savings circles with trusted members</p>
          </button>

          <button
            onClick={() => navigate('/investments')}
            className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-2xl p-6 text-left shadow-lg active:scale-98 transition-transform"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                2 Projects
              </span>
            </div>
            <h3 className="text-white mb-1">Community Projects</h3>
            <p className="text-white/90 text-sm">Invest in diaspora-led businesses</p>
          </button>

          <button
            onClick={() => navigate('/feed')}
            className="w-full bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 text-left shadow-sm active:scale-98 transition-transform"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#0D9488]" />
              </div>
              <span className="px-3 py-1 bg-[#0D9488]/10 text-[#0D9488] text-xs rounded-full">
                New
              </span>
            </div>
            <h3 className="text-[#0F172A] mb-1">Fil KAURI</h3>
            <p className="text-[#64748B] text-sm">Actualités communautaires et réussites financières</p>
          </button>
        </div>

        <div className="mb-6 bg-gradient-to-r from-[#006D77] to-[#0D9488] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-7 h-7 text-white">
                <path
                  d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-white">Découvrez KAURI</h4>
              <p className="text-white/80 text-xs">L'expérience complète diaspora</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/kauri')}
            className="w-full bg-white text-[#006D77] py-3 rounded-xl text-sm"
          >
            Explorer KAURI →
          </button>
        </div>

        <h3 className="text-[#0F172A] mb-4">Premium Features</h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/global-wallet')}
            className="bg-gradient-to-br from-[#0A5C7A] to-[#0D9488] rounded-xl p-4 text-left hover:scale-105 transition-transform"
          >
            <Globe className="w-8 h-8 text-[#D4AF37] mb-2" />
            <h4 className="text-white text-sm mb-1">Global Wallet</h4>
            <p className="text-white/80 text-xs">Multi-currency</p>
          </button>

          <button
            onClick={() => navigate('/blockchain-tontine/1')}
            className="bg-gradient-to-br from-[#475569] to-[#64748B] rounded-xl p-4 text-left hover:scale-105 transition-transform"
          >
            <Shield className="w-8 h-8 text-[#D4AF37] mb-2" />
            <h4 className="text-white text-sm mb-1">Blockchain</h4>
            <p className="text-white/80 text-xs">Verified contracts</p>
          </button>

          <button
            onClick={() => navigate('/investor-academy')}
            className="bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-xl p-4 text-left hover:scale-105 transition-transform"
          >
            <BookOpen className="w-8 h-8 text-white mb-2" />
            <h4 className="text-white text-sm mb-1">Academy</h4>
            <p className="text-white/90 text-xs">Learn & earn badges</p>
          </button>

          <button
            onClick={() => navigate('/swap-marketplace')}
            className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-4 text-left hover:scale-105 transition-transform"
          >
            <RefreshCcw className="w-8 h-8 text-white mb-2" />
            <h4 className="text-white text-sm mb-1">Swap Market</h4>
            <p className="text-white/90 text-xs">Emergency swaps</p>
          </button>
        </div>
      </div>

    </div>
  );
}
