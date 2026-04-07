import { Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { bins as defaultBins, type Bin } from '../data/mockData';

export function StatusCards({ bins = defaultBins }: { bins?: Bin[] }) {
  const emptyBins = bins.filter(b => b.status === 'empty').length;
  const halfBins = bins.filter(b => b.status === 'half').length;
  const fullBins = bins.filter(b => b.status === 'full').length;
  const totalBins = bins.length;

  const cards = [
    {
      title: 'Empty Bins',
      count: emptyBins,
      percentage: Math.round((emptyBins / totalBins) * 100),
      icon: Trash2,
      bgColor: 'bg-green-50',
      iconColor: 'bg-green-600',
      textColor: 'text-green-600',
      trend: 'down',
    },
    {
      title: 'Half-Filled Bins',
      count: halfBins,
      percentage: Math.round((halfBins / totalBins) * 100),
      icon: Trash2,
      bgColor: 'bg-yellow-50',
      iconColor: 'bg-yellow-600',
      textColor: 'text-yellow-600',
      trend: 'neutral',
    },
    {
      title: 'Completely Filled Bins',
      count: fullBins,
      percentage: Math.round((fullBins / totalBins) * 100),
      icon: Trash2,
      bgColor: 'bg-red-50',
      iconColor: 'bg-red-600',
      textColor: 'text-red-600',
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className={`${card.bgColor} border-none shadow-sm hover:shadow-md transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.iconColor} rounded-lg p-3`}>
                  <Icon className="size-6 text-white" />
                </div>
                {card.trend === 'up' ? (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <TrendingUp className="size-4" />
                    <span>Alert</span>
                  </div>
                ) : card.trend === 'down' ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <TrendingDown className="size-4" />
                    <span>Good</span>
                  </div>
                ) : null}
              </div>
              
              <div className="space-y-2">
                <div className="text-gray-600 text-sm">{card.title}</div>
                <div className="flex items-end gap-2">
                  <div className={`${card.textColor} text-3xl font-semibold`}>
                    {card.count}
                  </div>
                  <div className="text-gray-500 text-sm mb-1">
                    ({card.percentage}%)
                  </div>
                </div>
                
                {/* Fill animation bar */}
                <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${card.iconColor} rounded-full transition-all duration-1000`}
                    style={{ width: `${card.percentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
