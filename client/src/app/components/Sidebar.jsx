import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  History,
  LayoutDashboard,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
  { id: "status", label: "Bin Status", icon: Trash2 },
  { id: "map", label: "Map View", icon: MapPin },
  { id: "workers", label: "Worker Assignment", icon: Users },
  { id: "history", label: "Collection History", icon: History },
  { id: "analytics", label: "Reports & Analytics", icon: BarChart3 },
];

export function Sidebar({ onNavigate }) {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const handleNavigation = (itemId) => {
    setActiveItem(itemId);
    onNavigate(itemId);
  };

  return (
    <div
      className={`${collapsed ? "w-16" : "w-64"} bg-gray-900 h-screen flex flex-col transition-[width] duration-200 ease-in-out`}
    >
      <div
        className={`${collapsed ? "p-3" : "p-6"} flex items-center justify-between`}
      >
        <div
          className={`text-white text-sm font-medium ${collapsed ? "hidden" : "block"}`}
        >
          Menu
        </div>
        <button
          type="button"
          className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg p-2 transition-colors"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-5" />
          ) : (
            <ChevronLeft className="size-5" />
          )}
        </button>
      </div>

      <nav className={`flex-1 ${collapsed ? "px-2" : "px-3"}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              type="button"
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-3"} py-3 mb-1 rounded-lg transition-colors ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="size-5" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400 text-center">
          {!collapsed && "Smart Waste v2.0"}
        </div>
      </div>
    </div>
  );
}
