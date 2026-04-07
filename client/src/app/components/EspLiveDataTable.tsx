import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AlertCircle } from 'lucide-react';

type NodeKey = 'A' | 'B' | 'C';

export type EspTelemetryByNode = Partial<Record<NodeKey, { fillLevel: number; timestamp?: string }>>;

function formatIst(timestamp?: string): string {
  if (!timestamp) return '-';
  const t = Date.parse(timestamp);
  if (Number.isNaN(t)) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  }).format(new Date(t));
}

function safeFill(fillLevel?: number): number {
  if (fillLevel === undefined || fillLevel === null) return 0;
  return Math.max(0, Math.min(100, Math.round(fillLevel)));
}

function statusFromFill(fillLevel?: number): { label: string; className: string } {
  if (fillLevel === undefined || fillLevel === null) return { label: '-', className: 'bg-gray-100 text-gray-700' };
  if (fillLevel <= 30) return { label: 'Empty',       className: 'bg-green-100 text-green-800' };
  if (fillLevel <= 80) return { label: 'Half Filled', className: 'bg-yellow-100 text-yellow-800' };
  return { label: 'Full', className: 'bg-red-100 text-red-800' };
}

const isHighPriority = (fillLevel?: number) =>
  fillLevel !== undefined && fillLevel !== null && fillLevel >= 85;

const NODES: { key: NodeKey; label: string }[] = [
  { key: 'A', label: 'Bin A (BIN-001)' },
  { key: 'B', label: 'Bin B (BIN-002)' },
  { key: 'C', label: 'Bin C (BIN-003)' },
];

export function EspLiveDataTable({ data }: { data: EspTelemetryByNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live ESP32 Node Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Bin</TableHead>
                <TableHead className="text-center">Fill Level</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Updated (IST)</TableHead>
                <TableHead className="text-right">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NODES.map(({ key, label }) => {
                const node = data[key];
                const fill = node?.fillLevel;
                const status = statusFromFill(fill);
                return (
                  <TableRow key={key} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-gray-900">{label}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <Progress value={safeFill(fill)} className="flex-1 bg-gray-300 [&>div]:bg-black" />
                        <span className="text-sm text-gray-700 min-w-[44px] text-right">
                          {node ? `${safeFill(fill)}%` : '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={status.className}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 text-right font-mono">{formatIst(node?.timestamp)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      {isHighPriority(fill) && (
                        <div className="flex items-center justify-end gap-1 text-red-600">
                          <AlertCircle className="size-4" />
                          <span className="text-sm font-medium">High</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
