import { Outlet, NavLink } from 'react-router';
import { LayoutDashboard, TrendingUp, MessageCircle, User } from 'lucide-react';

export function MainLayout() {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/investments', icon: TrendingUp, label: 'Invest' },
    { to: '/feed', icon: MessageCircle, label: 'Feed' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative">
      <Outlet />

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-6 py-4 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 ${
                  isActive ? 'text-[#0D9488]' : 'text-[#94A3B8]'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
