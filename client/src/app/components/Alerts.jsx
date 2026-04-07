import { AlertTriangle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { alertsApi } from "../api";

export function Alerts() {
  const [alerts, setAlerts] = useState([]);

  // Load from MongoDB on mount
  useEffect(() => {
    alertsApi
      .getAll()
      .then(setAlerts)
      .catch(() => setAlerts([]));
  }, []);

  const dismiss = async (id) => {
    try {
      await alertsApi.delete(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast("Alert dismissed");
    } catch {
      // Fallback: dismiss UI-only
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast("Alert dismissed");
    }
  };

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-orange-50">
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <AlertTriangle className="size-5" />
          Alerts &amp; Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {alerts.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              No active alerts 🎉
            </div>
          )}
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
                alert.severity === "critical"
                  ? "bg-red-50 border-red-500"
                  : "bg-yellow-50 border-yellow-500"
              }`}
            >
              <div className="mt-0.5">
                {alert.severity === "critical" ? (
                  <XCircle className="size-5 text-red-600" />
                ) : (
                  <AlertTriangle className="size-5 text-yellow-600" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div
                  className={`text-sm font-medium ${
                    alert.severity === "critical"
                      ? "text-red-900"
                      : "text-yellow-900"
                  }`}
                >
                  {alert.message}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="size-3" />
                  {alert.timestamp}
                </div>
              </div>

              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => dismiss(alert.id)}
                type="button"
                aria-label="Dismiss alert"
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">Total Active Alerts</div>
            <div className="font-semibold text-gray-900">
              {alerts.length} alerts
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
