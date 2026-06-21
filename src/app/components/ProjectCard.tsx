import { TrendingUp, Tag } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  category: string;
  roi: string;
  fundingNeeded: number;
  description: string;
}

export function ProjectCard({
  title,
  category,
  roi,
  fundingNeeded,
  description,
}: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-800 flex-1">{title}</h3>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E0F2FE] text-[#0369A1] rounded-full text-xs">
          <Tag className="w-3 h-3" />
          {category}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 flex-1">{description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Estimated ROI</span>
          <span className="text-sm text-[#10B981] flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {roi}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Funding Needed</span>
          <span className="text-sm text-gray-800">{fundingNeeded.toLocaleString()}€</span>
        </div>

        <button className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white py-3 rounded-lg hover:shadow-md transition-shadow mt-2">
          Create Tontine
        </button>
      </div>
    </div>
  );
}
