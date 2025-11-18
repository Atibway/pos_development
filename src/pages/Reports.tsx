import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Calendar } from "lucide-react";
import { useReports } from "@/hooks/useReports";

const Reports = () => {
  const {
    salesReport,
    expenseReport,
    stockReport,
    loading,
    dateRange,
    setDateRange,
    reportType,
    setReportType,
    fetchReports
  } = useReports();

  const [activeTab, setActiveTab] = useState<"sales" | "expenses" | "stock">("sales");

  useEffect(() => {
    fetchReports();
  }, [fetchReports, dateRange, reportType]);

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log("Exporting report...");
  };

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reports</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  className="w-40"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  className="w-40"
                />
              </div>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <Button
              variant={activeTab === "sales" ? "default" : "ghost"}
              onClick={() => setActiveTab("sales")}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Sales Report
            </Button>
            <Button
              variant={activeTab === "expenses" ? "default" : "ghost"}
              onClick={() => setActiveTab("expenses")}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Expenses Report
            </Button>
            <Button
              variant={activeTab === "stock" ? "default" : "ghost"}
              onClick={() => setActiveTab("stock")}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Stock Report
            </Button>
          </div>

          {/* Sales Report */}
          {activeTab === "sales" && salesReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Total Sales</div>
                    <div className="text-2xl font-bold">{salesReport.totalSales}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                    <div className="text-2xl font-bold">{formatCurrency(salesReport.totalRevenue)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Total Profit</div>
                    <div className="text-2xl font-bold">{formatCurrency(salesReport.totalProfit)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Avg Order Value</div>
                    <div className="text-2xl font-bold">{formatCurrency(salesReport.averageOrderValue)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity Sold</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesReport.topProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{product.productName}</TableCell>
                          <TableCell>{product.quantitySold}</TableCell>
                          <TableCell>{formatCurrency(product.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Expenses Report */}
          {activeTab === "expenses" && expenseReport && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-center mb-4">
                    Total Expenses: {formatCurrency(expenseReport.totalExpenses)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Total Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseReport.expensesByCategory.map((category, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{category.category}</TableCell>
                          <TableCell>{category.count}</TableCell>
                          <TableCell>{formatCurrency(category.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stock Report */}
          {activeTab === "stock" && stockReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Total Products</div>
                    <div className="text-2xl font-bold">{stockReport.totalProducts}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Inventory Value</div>
                    <div className="text-2xl font-bold">{formatCurrency(stockReport.totalValue)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Low Stock Items</div>
                    <div className="text-2xl font-bold">{stockReport.lowStockItems.length}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Min Stock Level</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockReport.lowStockItems.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.minStockLevel}</TableCell>
                          <TableCell>
                            <Badge variant={product.quantity === 0 ? "destructive" : "secondary"}>
                              {product.quantity === 0 ? "Out of Stock" : "Low Stock"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
