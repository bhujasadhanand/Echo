import { Bell, ChevronDown, Settings, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { cities } from '../data/mockData';
import { toast } from 'sonner';
import { Alerts } from './Alerts';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function TopNav() {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Lifted state from App for simplicity; in a real app these would be passed down or via context
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [compactViewEnabled, setCompactViewEnabled] = useState(false);

  useEffect(() => {
    if (compactViewEnabled) {
      document.documentElement.classList.add('compact');
    } else {
      document.documentElement.classList.remove('compact');
    }
  }, [compactViewEnabled]);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded-lg p-2">
              <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h1 className="text-gray-900">Bin Monitoring</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* City Selector */}
          <Select defaultValue={cities[0]}>
            <SelectTrigger className="w-48 bg-white">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Notification Bell */}
          <Popover open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
            <PopoverTrigger asChild>
              <button
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
              >
                <Bell className="size-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white">
                  4
                </Badge>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={12} className="w-[420px] p-0 bg-white border border-gray-200 shadow-lg">
              <Alerts />
            </PopoverContent>
          </Popover>

          {/* Settings */}
          <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <PopoverTrigger asChild>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
                title="Settings"
              >
                <Settings className="size-5 text-gray-600" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={12} className="w-80 p-4 bg-white border border-gray-200 shadow-lg">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Settings</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="top-notifications" className="text-sm font-medium text-gray-700">
                    Enable Notifications
                  </Label>
                  <Switch
                    id="top-notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="top-auto-refresh" className="text-sm font-medium text-gray-700">
                    Auto-refresh Data
                  </Label>
                  <Switch
                    id="top-auto-refresh"
                    checked={autoRefreshEnabled}
                    onCheckedChange={setAutoRefreshEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="top-compact-view" className="text-sm font-medium text-gray-700">
                    Compact View
                  </Label>
                  <Switch
                    id="top-compact-view"
                    checked={compactViewEnabled}
                    onCheckedChange={setCompactViewEnabled}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile */}
          <button
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => toast('Profile menu is not connected yet')}
            type="button"
          >
            <div className="bg-blue-600 rounded-full p-1.5">
              <User className="size-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-900">Admin</div>
              <div className="text-xs text-gray-500">Supervisor</div>
            </div>
            <ChevronDown className="size-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
