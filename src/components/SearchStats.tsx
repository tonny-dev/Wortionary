import React from 'react';
import { TrendingUp, Users, BookOpen, Clock } from 'lucide-react';

export const SearchStats: React.FC = () => {
  const stats = [
    {
      icon: BookOpen,
      label: 'Total Words',
      value: '50,000+',
      color: 'text-blue-400',
    },
    {
      icon: TrendingUp,
      label: 'New This Week',
      value: '127',
      color: 'text-green-400',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: '12.5K',
      color: 'text-purple-400',
    },
    {
      icon: Clock,
      label: 'Searches Today',
      value: '2.3K',
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">
        Dictionary Stats
      </h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-gray-300 text-sm">{stat.label}</span>
              </div>
              <span className="text-white font-semibold">{stat.value}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="text-center">
          <p className="text-gray-400 text-xs">
            Updated every hour
          </p>
          <div className="flex justify-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
