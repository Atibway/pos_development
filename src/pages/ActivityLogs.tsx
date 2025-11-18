import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar } from "lucide-react";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { ActivityLog } from "@/types/activityLog";
import { format } from "date-fns";

const ActivityLogs = () => {
  const { logs, loading, fetchLogs } = useActivityLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const filteredLogs = logs.filter((log: ActivityLog) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.staff.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.staff.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.staff.email.toLowerCase().includes(searchTerm.toLowerCase());

    const logDate = new Date(log.timestamp);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const withinDateRange =
      (!start || logDate >= start) && (!end || logDate <= end);

    return matchesSearch && withinDateRange;
  });

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM dd, yyyy HH:mm");
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Activity Logs</span>
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="w-40"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="w-40"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-semibold text-sm border-b">
              <div className="col-span-2">Date</div>
              <div className="col-span-3">User</div>
              <div className="col-span-2">Action</div>
              <div className="col-span-5">Description</div>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {filteredLogs.map((log: ActivityLog) => (
                <div
                  key={log.id}
                  className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50 transition-colors"
                >
                  <div className="col-span-2 text-sm">
                    {formatTimestamp(log.timestamp)}
                  </div>
                  <div className="col-span-3">
                    <p className="font-medium">
                      {log.staff.first_name} {log.staff.last_name}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {log.staff.email}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline">{log.action}</Badge>
                  </div>
                  <div className="col-span-5">
                    <p className="text-sm break-words">{log.description}</p>
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No activity logs found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;
