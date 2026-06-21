import { Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back, investor</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#F59E0B] rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-800">John Investor</p>
            <p className="text-xs text-gray-500">Premium Member</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white">
            JI
          </div>
        </div>
      </div>
    </header>
  );
}
