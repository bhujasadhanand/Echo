import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Clock, CheckCircle2, Target } from "lucide-react";
import { useMemo } from "react";

const dailyFillData = [
  { day: "Mon", count: 34 },
  { day: "Tue", count: 42 },
  { day: "Wed", count: 38 },
  { day: "Thu", count: 45 },
  { day: "Fri", count: 52 },
  { day: "Sat", count: 48 },
  { day: "Sun", count: 41 },
];

export function Analytics({ bins = [] }) {
  const fullBins = useMemo(
    () => bins.filter((b) => b.status === "full").length,
    [bins],
  );
  const halfBins = useMemo(
    () => bins.filter((b) => b.status === "half").length,
    [bins],
  );
  const emptyBins = useMemo(
    () => bins.filter((b) => b.status === "empty").length,
    [bins],
  );
  const totalBins = bins.length || 1;

  const fillLevelDistribution = [
    { name: "Empty (0–30%)", value: emptyBins, color: "#22c55e" },
    { name: "Half (31–70%)", value: halfBins, color: "#eab308" },
    { name: "Full (71–100%)", value: fullBins, color: "#ef4444" },
  ];

  const efficiency = Math.round(((totalBins - fullBins) / totalBins) * 100);

  const metrics = [
    {
      label: "Today Collected",
      value: totalBins - fullBins,
      icon: CheckCircle2,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      label: "Pending",
      value: fullBins,
      icon: Clock,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      label: "Avg Response",
      value: "24 mins",
      icon: TrendingUp,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      label: "Efficiency",
      value: `${efficiency}%`,
      icon: Target,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, bg, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`${bg} rounded-lg p-2`}>
                <Icon className={`size-5 ${color}`} />
              </div>
              <div>
                <div className="text-xs text-gray-600">{label}</div>
                <div className="text-xl font-semibold text-gray-900">
                  {value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Bins Filled Per Day
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyFillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                name="Bins Filled"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Fill Level Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fillLevelDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                dataKey="value"
              >
                {fillLevelDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-4">
            {fillLevelDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">
                  {item.value} bins
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Efficiency Insight */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 rounded-lg p-3">
            <TrendingUp className="size-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-1">
              Collection Efficiency: {efficiency}%
            </div>
            <div className="text-sm text-gray-600">
              {efficiency >= 80
                ? "Great performance! Average response time has improved. Keep up the excellent work."
                : "Some bins need immediate attention. Prioritise full bins for collection."}
            </div>
            <div className="mt-3 flex gap-3">
              <div className="text-sm">
                <span className="text-gray-600">On-time collections:</span>
                <span className="font-medium text-green-600 ml-1">94%</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Bins serviced today:</span>
                <span className="font-medium text-blue-600 ml-1">
                  {totalBins - fullBins}/{totalBins}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
