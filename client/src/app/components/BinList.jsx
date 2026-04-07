import { AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function BinList({ bins = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "empty":
        return "bg-green-100 text-green-800";
      case "half":
        return "bg-yellow-100 text-yellow-800";
      case "full":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "empty":
        return "Empty";
      case "half":
        return "Half Filled";
      case "full":
        return "Full";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bin List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bin ID</TableHead>
                <TableHead>Location / Area Name</TableHead>
                <TableHead>Fill Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bins.map((bin) => (
                <TableRow key={bin.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-medium text-gray-900">{bin.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-900">{bin.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[180px]">
                      <Progress
                        value={bin.fillLevel}
                        className="flex-1 bg-gray-300 [&>div]:bg-black"
                      />
                      <span className="text-sm text-gray-600 min-w-[40px]">
                        {bin.fillLevel}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(bin.status)}>
                      {getStatusLabel(bin.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Clock className="size-3" />
                      {bin.lastUpdated}
                    </div>
                  </TableCell>
                  <TableCell>
                    {bin.priority && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="size-4" />
                        <span className="text-sm font-medium">High</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
