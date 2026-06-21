import { ArrowLeft, Download, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function TontineDetailScreen() {
  const navigate = useNavigate();
  const members = [
    { name: 'Jean Dupont', status: 'paid', avatar: 'JD' },
    { name: 'Marie Laurent', status: 'paid', avatar: 'ML' },
    { name: 'Pierre Dubois', status: 'pending', avatar: 'PD' },
    { name: 'Sophie Martin', status: 'paid', avatar: 'SM' },
    { name: 'André Charles', status: 'received', avatar: 'AC' },
  ];

  const rotationSchedule = [
    { name: 'André Charles', date: 'Sep 15, 2026', status: 'completed' },
    { name: 'Marie Laurent', date: 'Oct 1, 2026', status: 'next' },
    { name: 'Jean Dupont', date: 'Oct 15, 2026', status: 'upcoming' },
    { name: 'Sophie Martin', date: 'Nov 1, 2026', status: 'upcoming' },
    { name: 'Pierre Dubois', date: 'Nov 15, 2026', status: 'upcoming' },
  ];

  const totalPot = 2500;
  const collected = 2000;
  const percentage = Math.round((collected / totalPot) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-6">
      <div className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Family Circle Tontine</h1>
        <p className="text-[#F1F5F9] text-sm mb-6">5 Members • Monthly Rotation</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#F1F5F9] text-sm">Current Pot Progress</span>
            <span className="text-white">{percentage}%</span>
          </div>

          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white text-lg">€{collected.toLocaleString()}</span>
            <span className="text-[#F1F5F9] text-sm">of €{totalPot.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0F172A]">Members Status</h3>
            <button className="text-[#0D9488] text-sm flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>Debt Charter</span>
            </button>
          </div>

          <div className="space-y-3">
            {members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white text-sm">
                    {member.avatar}
                  </div>
                  <span className="text-[#0F172A] text-sm">{member.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {member.status === 'paid' && (
                    <div className="flex items-center gap-1 text-[#0D9488]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs">Paid</span>
                    </div>
                  )}
                  {member.status === 'pending' && (
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Pending</span>
                    </div>
                  )}
                  {member.status === 'received' && (
                    <div className="px-3 py-1 bg-[#0D9488] text-white text-xs rounded-full">
                      Received Pot
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#0D9488]" />
            <h3 className="text-[#0F172A]">Rotation Schedule</h3>
          </div>

          <div className="space-y-0">
            {rotationSchedule.map((item, index) => (
              <div key={index} className="relative">
                {index !== rotationSchedule.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-[#E2E8F0]"></div>
                )}

                <div className="flex items-start gap-3 pb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.status === 'completed'
                        ? 'bg-[#D1FAE5] text-[#0D9488]'
                        : item.status === 'next'
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#F1F5F9] text-[#94A3B8]'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[#0F172A] text-sm">{item.name}</p>
                      {item.status === 'next' && (
                        <span className="px-2 py-1 bg-[#FEF3C7] text-[#D97706] text-xs rounded-full">
                          Next
                        </span>
                      )}
                    </div>
                    <p className="text-[#64748B] text-xs mt-1">{item.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
