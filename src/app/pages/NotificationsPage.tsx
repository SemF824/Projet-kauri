import { ArrowLeft, Bell, TrendingUp, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NotificationsPage() {
  const navigate = useNavigate();

  const notifications = [
    {
      icon: DollarSign,
      color: '#0D9488',
      title: 'Payment Received',
      message: 'Marie Laurent paid €500 to Family Circle Tontine',
      time: '2 hours ago',
      unread: true,
    },
    {
      icon: TrendingUp,
      color: '#F59E0B',
      title: 'Investment Update',
      message: 'Manioc Cooperative Farm reached 70% funding',
      time: '5 hours ago',
      unread: true,
    },
    {
      icon: Users,
      color: '#14B8A6',
      title: 'New Tontine Invitation',
      message: 'Sophie Bernard invited you to join "Young Professionals Circle"',
      time: '1 day ago',
      unread: false,
    },
    {
      icon: CheckCircle2,
      color: '#0D9488',
      title: 'Tontine Pot Ready',
      message: 'Your turn to receive the pot is on Oct 15, 2026',
      time: '2 days ago',
      unread: false,
    },
    {
      icon: Bell,
      color: '#64748B',
      title: 'Trust Score Updated',
      message: 'Your trust score increased to 5.0 stars',
      time: '3 days ago',
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6] px-6 pt-12 pb-8 rounded-b-[2rem] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl mb-1">Notifications</h1>
            <p className="text-[#F1F5F9] text-sm">2 new updates</p>
          </div>
          <button className="px-4 py-2 bg-white/20 text-white text-sm rounded-lg">
            Mark all read
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-3">
        {notifications.map((notification, index) => (
          <button
            key={index}
            className={`w-full bg-white rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow ${
              notification.unread ? 'border-2 border-[#0D9488]' : 'border border-[#E2E8F0]'
            }`}
          >
            <div className="flex gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${notification.color}15` }}
              >
                <notification.icon className="w-6 h-6" style={{ color: notification.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-[#0F172A] text-sm">{notification.title}</h4>
                  {notification.unread && (
                    <div className="w-2 h-2 rounded-full bg-[#0D9488] flex-shrink-0 mt-1"></div>
                  )}
                </div>
                <p className="text-[#64748B] text-sm mb-2">{notification.message}</p>
                <p className="text-[#94A3B8] text-xs">{notification.time}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
