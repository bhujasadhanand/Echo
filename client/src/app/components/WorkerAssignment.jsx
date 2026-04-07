import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Route, UserCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { workersApi } from "../api";

export function WorkerAssignment({ bins = [], onCollectionComplete }) {
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(undefined);
  const [selectedBinIds, setSelectedBinIds] = useState(() => new Set());
  const [assigning, setAssigning] = useState(false);

  const fullBins = useMemo(
    () => bins.filter((b) => b.status === "full"),
    [bins],
  );

  // Load workers from MongoDB
  useEffect(() => {
    workersApi
      .getAll()
      .then(setWorkers)
      .catch(() => setWorkers([]));
  }, []);

  // Pre-select from session storage
  useEffect(() => {
    let preselectBinId = null;
    try {
      preselectBinId = sessionStorage.getItem(
        "workerAssignment.preselectBinId",
      );
      if (preselectBinId)
        sessionStorage.removeItem("workerAssignment.preselectBinId");
    } catch {
      /* ignore */
    }

    if (!preselectBinId) return;
    if (!fullBins.some((b) => b.id === preselectBinId)) return;
    setSelectedBinIds(new Set([preselectBinId]));
  }, [fullBins]);

  const selectedWorker = useMemo(
    () => workers.find((w) => w.id === selectedWorkerId),
    [workers, selectedWorkerId],
  );

  const selectedBins = useMemo(
    () => fullBins.filter((b) => selectedBinIds.has(b.id)),
    [fullBins, selectedBinIds],
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return "Available";
      case "assigned":
        return "Assigned";
      case "in-progress":
        return "In Progress";
      default:
        return status;
    }
  };

  const handleAssign = async () => {
    if (!selectedWorkerId || !selectedWorker) {
      toast.error("Please choose a worker");
      return;
    }
    if (selectedBins.length === 0) {
      toast.error("Please select at least one full bin");
      return;
    }
    setAssigning(true);
    try {
      await workersApi.assign(selectedWorkerId, [...selectedBinIds]);
      // Refresh workers
      const updated = await workersApi.getAll();
      setWorkers(updated);
      toast.success(
        `Assigned ${selectedBins.length} bin(s) to ${selectedWorker.name}`,
      );
      setSelectedBinIds(new Set());
      setSelectedWorkerId(undefined);
    } catch (err) {
      toast.error(
        `Assignment failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedWorkerId || !selectedWorker) {
      toast.error("Please choose a worker");
      return;
    }
    if (selectedBins.length === 0) {
      toast.error("Please select at least one bin");
      return;
    }
    setAssigning(true);
    try {
      const res = await workersApi.complete(selectedWorkerId, [
        ...selectedBinIds,
      ]);
      toast.success(res.message);
      const updated = await workersApi.getAll();
      setWorkers(updated);
      setSelectedBinIds(new Set());
      setSelectedWorkerId(undefined);
      onCollectionComplete?.();
    } catch (err) {
      toast.error(
        `Failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="size-5" />
          Worker Assignment Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Worker Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select Worker / Collection Team
          </label>
          <div className="border border-gray-200 rounded-lg max-h-[200px] overflow-y-auto">
            {workers.map((worker) => {
              const isSelected = selectedWorkerId === worker.id;
              return (
                <div
                  key={worker.id}
                  className={`flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 ${isSelected ? "bg-gray-50" : "hover:bg-gray-50"} cursor-pointer`}
                  onClick={() =>
                    setSelectedWorkerId((prev) =>
                      prev === worker.id ? undefined : worker.id,
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        setSelectedWorkerId(checked ? worker.id : undefined)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />

                    <span className="text-sm font-medium text-gray-900">
                      {worker.name}
                    </span>
                  </div>
                  <Badge className={`${getStatusColor(worker.status)} text-xs`}>
                    {getStatusLabel(worker.status)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Bins Pending Collection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Full Bins Pending Collection
            </label>
            <Badge variant="destructive" className="text-black">
              {fullBins.length} bins
            </Badge>
          </div>
          <div className="border border-gray-200 rounded-lg max-h-[200px] overflow-y-auto">
            {fullBins.length === 0 && (
              <div className="p-4 text-sm text-gray-500 text-center">
                No full bins right now 🎉
              </div>
            )}
            {fullBins.map((bin) => {
              const isChecked = selectedBinIds.has(bin.id);
              return (
                <div
                  key={bin.id}
                  className={`flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${isChecked ? "bg-blue-50" : ""}`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{bin.id}</div>
                    <div className="text-sm text-gray-600">{bin.location}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-red-600 font-medium">
                      {bin.fillLevel}%
                    </div>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={isChecked}
                      onChange={(e) => {
                        setSelectedBinIds((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) next.add(bin.id);
                          else next.delete(bin.id);
                          return next;
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Route Optimization */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Route className="size-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-blue-900 mb-1">
                Optimized Route Preview
              </div>
              <div className="text-sm text-blue-700">
                System will calculate the most efficient route based on selected
                bins and current traffic conditions.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            type="button"
            disabled={assigning}
            onClick={handleAssign}
          >
            {assigning ? "Assigning…" : "Assign Task"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            type="button"
            disabled={assigning}
            onClick={handleComplete}
          >
            {assigning ? "Completing…" : "Mark Complete"}
          </Button>
        </div>

        {/* Current Assignments */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Current Assignments
          </div>
          {workers
            .filter((w) => w.status !== "available")
            .map((worker) => (
              <div
                key={worker.id}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{worker.name}</div>
                  <Badge className={getStatusColor(worker.status)}>
                    {getStatusLabel(worker.status)}
                  </Badge>
                </div>
                {worker.assignedBins && worker.assignedBins.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Assigned bins: {worker.assignedBins.join(", ")}
                  </div>
                )}
              </div>
            ))}
          {workers.filter((w) => w.status !== "available").length === 0 && (
            <div className="text-sm text-gray-500 text-center py-2">
              All workers are available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
