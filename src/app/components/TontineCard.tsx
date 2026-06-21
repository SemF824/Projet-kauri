import { Users } from 'lucide-react';

interface TontineCardProps {
  name: string;
  totalGoal: number;
  currentAmount: number;
  participants: number;
  maxParticipants: number;
  status: string;
}

export function TontineCard({
  name,
  totalGoal,
  currentAmount,
  participants,
  maxParticipants,
  status,
}: TontineCardProps) {
  const percentage = Math.round((currentAmount / totalGoal) * 100);
  const progressHeight = `${percentage}%`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-48 bg-gray-100 rounded-lg relative overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#10B981] to-[#34D399] transition-all duration-500"
              style={{ height: progressHeight }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-gray-700 z-10">{percentage}%</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-gray-800 mb-2">{name}</h3>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Funding Progress</p>
              <p className="text-gray-800">
                {currentAmount.toLocaleString()}€ / {totalGoal.toLocaleString()}€
              </p>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {participants}/{maxParticipants} Participants
              </span>
            </div>

            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                status === 'Collecting Funds'
                  ? 'bg-[#DBEAFE] text-[#1E40AF]'
                  : 'bg-[#D1FAE5] text-[#065F46]'
              }`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
