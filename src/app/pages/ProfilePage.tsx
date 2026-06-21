import { ArrowLeft, Star, Shield, Bell, Lock, CreditCard, Users, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('lyann_authenticated');
    navigate('/onboarding');
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: Shield, label: 'Identity Verification', value: 'Verified', color: '#0D9488' },
        { icon: Star, label: 'Trust Score', value: '5.0', color: '#F59E0B' },
        { icon: CreditCard, label: 'Payment Methods', value: '2 cards', color: '#64748B' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: 'On', color: '#64748B' },
        { icon: Lock, label: 'Privacy & Security', value: '', color: '#64748B' },
        { icon: Users, label: 'Connected Circles', value: '3 active', color: '#64748B' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6] px-6 pt-12 pb-20 rounded-b-[2rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#F59E0B] flex items-center justify-center text-white text-3xl border-4 border-white shadow-lg">
            JD
          </div>
          <h1 className="text-white text-2xl mb-1">Jean Dupont</h1>
          <p className="text-[#F1F5F9] text-sm mb-3">Premium Member</p>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
            ))}
          </div>
          <p className="text-[#F1F5F9] text-xs">Trust Score: Perfect</p>
        </div>
      </div>

      <div className="px-6 -mt-12 space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl text-[#0F172A] mb-1">3</p>
              <p className="text-xs text-[#64748B]">Active Tontines</p>
            </div>
            <div>
              <p className="text-2xl text-[#0F172A] mb-1">2</p>
              <p className="text-xs text-[#64748B]">Investments</p>
            </div>
            <div>
              <p className="text-2xl text-[#0F172A] mb-1">€2,450</p>
              <p className="text-xs text-[#64748B]">Wallet Balance</p>
            </div>
          </div>
        </div>

        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <h3 className="text-[#0F172A] text-sm">{section.title}</h3>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <span className="text-[#0F172A] text-sm">{item.label}</span>
                  </div>
                  {item.value && (
                    <span className="text-[#64748B] text-sm">{item.value}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="w-full bg-white border-2 border-[#EF4444] text-[#EF4444] py-4 rounded-xl flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
