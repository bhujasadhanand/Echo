import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, CheckCircle2, Target } from 'lucide-react';
import { dailyFillData, fillLevelDistribution, collectionEfficiency } from '../data/mockData';

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <CheckCircle2 className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Today Collected</div>
                <div className="text-xl font-semibold text-gray-900">
                  {collectionEfficiency.todayCollected}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 rounded-lg p-2">
                <Clock className="size-5 text-orange-600" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Pending</div>
                <div className="text-xl font-semibold text-gray-900">
                  {collectionEfficiency.pendingCollection}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-lg p-2">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Avg Response</div>
                <div className="text-xl font-semibold text-gray-900">
                  {collectionEfficiency.avgResponseTime}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-lg p-2">
                <Target className="size-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Efficiency</div>
                <div className="text-xl font-semibold text-gray-900">
                  {collectionEfficiency.efficiency}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bins Filled Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyFillData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Bins Filled" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Fill Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fillLevelDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fillLevelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex flex-col gap-2 mt-4">
              {fillLevelDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value} bins</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Insight */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 rounded-lg p-3">
              <TrendingUp className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1">
                Collection Efficiency: {collectionEfficiency.efficiency}%
              </div>
              <div className="text-sm text-gray-600">
                Great performance this week! Average response time has improved by 15% compared to last week.
                Keep up the excellent work maintaining efficient collection schedules.
              </div>
              <div className="mt-3 flex gap-3">
                <div className="text-sm">
                  <span className="text-gray-600">On-time collections:</span>
                  <span className="font-medium text-green-600 ml-1">94%</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Bins serviced today:</span>
                  <span className="font-medium text-blue-600 ml-1">28/32</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
