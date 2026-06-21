import { ArrowLeft, RefreshCcw, MessageCircle, Clock, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router';

export function SwapMarketplaceScreen() {
  const navigate = useNavigate();

  const swapRequests = [
    {
      requester: 'Marie Laurent',
      avatar: 'ML',
      trustScore: 5,
      currentPosition: 1,
      desiredPosition: 4,
      reason: 'Medical emergency - need funds earlier',
      urgency: 'high',
      tontine: 'Family Circle',
      potAmount: 2500,
      daysAgo: '2 hours ago',
    },
    {
      requester: 'Pierre Dubois',
      avatar: 'PD',
      trustScore: 4,
      currentPosition: 4,
      desiredPosition: 2,
      reason: 'Business opportunity in Martinique',
      urgency: 'medium',
      tontine: 'Young Professionals',
      potAmount: 2400,
      daysAgo: '1 day ago',
    },
    {
      requester: 'Sophie Martin',
      avatar: 'SM',
      trustScore: 5,
      currentPosition: 6,
      desiredPosition: 3,
      reason: 'Daughter\'s university fees due',
      urgency: 'high',
      tontine: 'Neighborhood Friends',
      potAmount: 1200,
      daysAgo: '3 days ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#475569] to-[#64748B] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-2xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl mb-1">Swap Marketplace</h1>
            <p className="text-white/80 text-sm">Emergency rotation exchanges</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <RefreshCcw className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-1">Active Requests</p>
              <p className="text-white text-2xl">{swapRequests.length}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs mb-1">Your Position</p>
              <p className="text-white text-lg">#3 in Family Circle</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#0F172A] flex items-center gap-2">
            <div className="w-1 h-5 bg-[#D4AF37] rounded-full"></div>
            Available Swaps
          </h3>
          <button className="text-[#0A5C7A] text-sm flex items-center gap-1">
            <span>Filter</span>
          </button>
        </div>

        <div className="space-y-4">
          {swapRequests.map((request, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border-2 border-[#E2E8F0] overflow-hidden hover:border-[#0A5C7A] transition-all"
            >
              <div
                className={`h-1 ${
                  request.urgency === 'high'
                    ? 'bg-gradient-to-r from-[#EF4444] to-[#F59E0B]'
                    : 'bg-gradient-to-r from-[#F59E0B] to-[#D4AF37]'
                }`}
              ></div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0A5C7A] to-[#0D9488] flex items-center justify-center text-white text-lg shadow-lg">
                      {request.avatar}
                    </div>
                    <div>
                      <p className="text-[#0F172A] mb-1">{request.requester}</p>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < request.trustScore
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : 'text-[#E2E8F0]'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-[#94A3B8]" />
                        <span className="text-xs text-[#94A3B8]">{request.daysAgo}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      request.urgency === 'high'
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}
                  >
                    {request.urgency === 'high' ? 'Urgent' : 'Medium'}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border-2 border-[#0A5C7A]">
                        <span className="text-lg text-[#0A5C7A]">#{request.currentPosition}</span>
                      </div>
                      <p className="text-xs text-[#64748B]">Current</p>
                    </div>

                    <RefreshCcw className="w-6 h-6 text-[#94A3B8]" />

                    <div className="text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border-2 border-[#D4AF37]">
                        <span className="text-lg text-[#D4AF37]">#{request.desiredPosition}</span>
                      </div>
                      <p className="text-xs text-[#64748B]">Desired</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-[#0F172A] mb-1">"{request.reason}"</p>
                    <p className="text-xs text-[#64748B]">{request.tontine} • €{request.potAmount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-white border-2 border-[#0A5C7A] text-[#0A5C7A] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-all">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Chat</span>
                  </button>
                  <button className="bg-gradient-to-r from-[#0A5C7A] to-[#0D9488] text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Agree to Swap</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#F59E0B]/10 rounded-2xl p-6 border-2 border-[#D4AF37]/30">
          <h4 className="text-[#0F172A] mb-2 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <RefreshCcw className="w-4 h-4 text-white" />
            </div>
            How Swaps Work
          </h4>
          <p className="text-[#64748B] text-sm mb-3">
            Swaps are smart contract-secured exchanges. Both parties must agree, and the blockchain
            automatically updates rotation positions.
          </p>
          <button className="text-[#0A5C7A] text-sm underline">Learn more about swap security</button>
        </div>
      </div>
    </div>
  );
}
