import { ArrowLeft, Plus, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';

export function TontineListPage() {
  const navigate = useNavigate();

  const tontines = [
    {
      id: '1',
      name: 'Family Circle Tontine',
      members: 5,
      maxMembers: 5,
      monthlyAmount: 500,
      potValue: 2500,
      status: 'active',
      nextReceiver: 'Marie Laurent',
      nextDate: 'Oct 1, 2026',
    },
    {
      id: '2',
      name: 'Young Professionals Circle',
      members: 8,
      maxMembers: 10,
      monthlyAmount: 300,
      potValue: 2400,
      status: 'active',
      nextReceiver: 'André Charles',
      nextDate: 'Oct 10, 2026',
    },
    {
      id: '3',
      name: 'Neighborhood Friends',
      members: 6,
      maxMembers: 6,
      monthlyAmount: 200,
      potValue: 1200,
      status: 'active',
      nextReceiver: 'You',
      nextDate: 'Oct 15, 2026',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl mb-1">My Tontines</h1>
            <p className="text-[#F1F5F9] text-sm">{tontines.length} active circles</p>
          </div>
          <button className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {tontines.map((tontine) => (
          <button
            key={tontine.id}
            onClick={() => navigate(`/tontines/${tontine.id}`)}
            className="w-full bg-white rounded-2xl p-5 shadow-lg text-left hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[#0F172A] mb-1">{tontine.name}</h3>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Users className="w-4 h-4" />
                  <span>
                    {tontine.members}/{tontine.maxMembers} members
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#D1FAE5] text-[#0D9488] text-xs rounded-full">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#F8FAFC] rounded-xl p-3">
                <p className="text-xs text-[#64748B] mb-1">Monthly Amount</p>
                <p className="text-[#0F172A]">€{tontine.monthlyAmount}</p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-3">
                <p className="text-xs text-[#64748B] mb-1">Pot Value</p>
                <p className="text-[#0F172A]">€{tontine.potValue}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <div>
                <p className="text-xs text-[#64748B] mb-1">Next Receiver</p>
                <p className="text-[#0F172A] text-sm">{tontine.nextReceiver}</p>
              </div>
              <p className="text-xs text-[#64748B]">{tontine.nextDate}</p>
            </div>
          </button>
        ))}

        <button className="w-full border-2 border-dashed border-[#CBD5E1] text-[#64748B] py-6 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#0D9488] hover:text-[#0D9488] transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span>Create New Tontine</span>
        </button>
      </div>
    </div>
  );
}
