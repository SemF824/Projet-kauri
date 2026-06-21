import { LayoutDashboard, Wallet, TrendingUp, User, Receipt } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-tontines', label: 'My Tontines', icon: Receipt },
    { id: 'invest', label: 'Invest in Projects', icon: TrendingUp },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'settings', label: 'Account Settings', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#0A2540] min-h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-xl">TontineHub</h1>
        </div>
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-[#10B981] text-white'
                  : 'text-gray-300 hover:bg-[#0F3554] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
