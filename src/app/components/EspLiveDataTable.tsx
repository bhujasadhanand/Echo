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
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(new Date(t));
}

function badgeClass(fillLevel?: number): string {
  if (fillLevel === undefined || fillLevel === null) return 'bg-gray-100 text-gray-700';
  if (fillLevel >= 85) return 'bg-red-100 text-red-800';
  if (fillLevel >= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

function safeFill(fillLevel?: number): number {
  if (fillLevel === undefined || fillLevel === null) return 0;
  return Math.max(0, Math.min(100, Math.round(fillLevel)));
}

function statusFromFill(fillLevel?: number): { label: string; className: string } {
  if (fillLevel === undefined || fillLevel === null) {
    return { label: '-', className: 'bg-gray-100 text-gray-700' };
  }
  if (fillLevel <= 30) return { label: 'Empty', className: 'bg-green-100 text-green-800' };
  if (fillLevel <= 80) return { label: 'Half Filled', className: 'bg-yellow-100 text-yellow-800' };
  return { label: 'Full', className: 'bg-red-100 text-red-800' };
}

function isHighPriority(fillLevel?: number): boolean {
  if (fillLevel === undefined || fillLevel === null) return false;
  return fillLevel >= 85;
}

export function EspLiveDataTable({ data }: { data: EspTelemetryByNode }) {
  const a = data.A;
  const b = data.B;
  const c = data.C;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Bin</TableHead>
                <TableHead className="text-center">Fill Level</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Updated (IST)</TableHead>
                <TableHead className="text-right">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell>
                  <div className="font-medium text-gray-900">Bin A</div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-2 min-w-[220px]">
                    <div className="flex items-center gap-3 w-full">
                      <Progress value={safeFill(a?.fillLevel)} className="flex-1 bg-gray-300 [&>div]:bg-black" />
                      <span className="text-sm text-gray-700 min-w-[44px] text-right">
                        {a ? `${safeFill(a.fillLevel)}%` : '-'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={statusFromFill(a?.fillLevel).className}>
                    {statusFromFill(a?.fillLevel).label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600 text-right font-mono">{formatIst(a?.timestamp)}</div>
                </TableCell>
                <TableCell className="text-right">
                  {isHighPriority(a?.fillLevel) && (
                    <div className="flex items-center justify-end gap-1 text-red-600">
                      <AlertCircle className="size-4" />
                      <span className="text-sm font-medium">High</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell>
                  <div className="font-medium text-gray-900">Bin B</div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-2 min-w-[220px]">
                    <div className="flex items-center gap-3 w-full">
                      <Progress value={safeFill(b?.fillLevel)} className="flex-1 bg-gray-300 [&>div]:bg-black" />
                      <span className="text-sm text-gray-700 min-w-[44px] text-right">
                        {b ? `${safeFill(b.fillLevel)}%` : '-'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={statusFromFill(b?.fillLevel).className}>
                    {statusFromFill(b?.fillLevel).label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600 text-right font-mono">{formatIst(b?.timestamp)}</div>
                </TableCell>
                <TableCell className="text-right">
                  {isHighPriority(b?.fillLevel) && (
                    <div className="flex items-center justify-end gap-1 text-red-600">
                      <AlertCircle className="size-4" />
                      <span className="text-sm font-medium">High</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell>
                  <div className="font-medium text-gray-900">Bin C</div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-2 min-w-[220px]">
                    <div className="flex items-center gap-3 w-full">
                      <Progress value={safeFill(c?.fillLevel)} className="flex-1 bg-gray-300 [&>div]:bg-black" />
                      <span className="text-sm text-gray-700 min-w-[44px] text-right">
                        {c ? `${safeFill(c.fillLevel)}%` : '-'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={statusFromFill(c?.fillLevel).className}>
                    {statusFromFill(c?.fillLevel).label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600 text-right font-mono">{formatIst(c?.timestamp)}</div>
                </TableCell>
                <TableCell className="text-right">
                  {isHighPriority(c?.fillLevel) && (
                    <div className="flex items-center justify-end gap-1 text-red-600">
                      <AlertCircle className="size-4" />
                      <span className="text-sm font-medium">High</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
