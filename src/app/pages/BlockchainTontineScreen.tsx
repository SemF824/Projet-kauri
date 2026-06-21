import { ArrowLeft, Shield, RefreshCcw, Star, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';

export function BlockchainTontineScreen() {
  const navigate = useNavigate();

  const members = [
    { name: 'Jean Dupont', position: 3, status: 'paid', trustScore: 5, avatar: 'JD', isYou: true },
    { name: 'Marie Laurent', position: 1, status: 'next', trustScore: 5, avatar: 'ML', isYou: false },
    { name: 'Pierre Dubois', position: 4, status: 'paid', trustScore: 4, avatar: 'PD', isYou: false },
    { name: 'Sophie Martin', position: 2, status: 'paid', trustScore: 5, avatar: 'SM', isYou: false },
    { name: 'André Charles', position: 5, status: 'received', trustScore: 5, avatar: 'AC', isYou: false },
  ];

  const contractDetails = {
    address: '0x742d...3f9a',
    network: 'Ethereum',
    verified: true,
    totalPot: 2500,
    collected: 2500,
    nextPayout: 'Oct 1, 2026',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#0A5C7A] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-2xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl mb-1">Family Circle</h1>
            <p className="text-[#E0F2FE] text-sm">Blockchain-secured tontine</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs">Smart Contract Verified</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-[#E0F2FE] text-xs mb-1">Current Pot</p>
              <p className="text-white text-2xl">€{contractDetails.collected.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[#E0F2FE] text-xs mb-1">Next Payout</p>
              <p className="text-white text-lg">{contractDetails.nextPayout}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#E0F2FE]">Contract: {contractDetails.address}</span>
              <span className="text-[#D4AF37]">{contractDetails.network}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#D4AF37] rounded-full"></div>
            Rotation Schedule
          </h3>

          <div className="space-y-3">
            {members
              .sort((a, b) => a.position - b.position)
              .map((member, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-5 shadow-md border-2 transition-all ${
                    member.isYou
                      ? 'border-[#D4AF37] bg-gradient-to-r from-[#FEF3C7] to-white'
                      : 'border-[#E2E8F0] hover:border-[#0A5C7A]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0A5C7A] to-[#0D9488] flex items-center justify-center text-white shadow-lg">
                          {member.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs text-[#0A5C7A]">#{member.position}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[#0F172A]">{member.name}</p>
                          {member.isYou && (
                            <span className="px-2 py-0.5 bg-[#D4AF37] text-white text-xs rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < member.trustScore
                                  ? 'fill-[#D4AF37] text-[#D4AF37]'
                                  : 'text-[#E2E8F0]'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-[#64748B] ml-1">Trust Score</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {member.status === 'next' && (
                        <div className="flex items-center gap-1 text-[#0D9488]">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Next</span>
                        </div>
                      )}
                      {member.status === 'paid' && (
                        <CheckCircle2 className="w-5 h-5 text-[#0D9488]" />
                      )}
                      {member.status === 'received' && (
                        <span className="px-3 py-1 bg-[#D1FAE5] text-[#0D9488] text-xs rounded-full">
                          Received
                        </span>
                      )}
                    </div>
                  </div>

                  {member.isYou && (
                    <button
                      onClick={() => navigate('/swap-marketplace')}
                      className="w-full bg-gradient-to-r from-[#0A5C7A] to-[#0D9488] text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      <span>Swap My Turn</span>
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#475569] to-[#64748B] rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white mb-1">Smart Contract Details</h3>
              <p className="text-white/80 text-sm">Blockchain-secured agreement</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center pb-3 border-b border-white/20">
              <span className="text-white/80">Monthly Contribution</span>
              <span className="text-white">€500</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/20">
              <span className="text-white/80">Total Members</span>
              <span className="text-white">5</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/20">
              <span className="text-white/80">Rotation Type</span>
              <span className="text-white">Monthly</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Contract Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#34D399] rounded-full animate-pulse"></div>
                <span className="text-[#34D399]">Active</span>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 bg-white/10 border border-white/20 text-white py-3 rounded-xl text-sm hover:bg-white/20 transition-all">
            View Full Contract on Etherscan
          </button>
        </div>
      </div>
    </div>
  );
}
