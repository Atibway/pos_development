import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  BarChart3
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import DashboardChart from "@/components/dashboard/DashboardChart";
import PvBvChart from "@/components/dashboard/PvBvChart";
import ClientTypeChart from "@/components/dashboard/ClientTypeChart";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    stats,
    warningStock,
    topSellingProducts,
    salesTrend,
    clientTypeData,
    isLoading
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "blue",
      action: () => navigate("/customers"),
      description: "Active accounts"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "purple",
      action: () => navigate("/stock"),
      description: "In inventory"
    },
    {
      title: "Total PV",
      value: stats.totalPV.toLocaleString(),
      icon: BarChart3,
      color: "green",
      action: () => navigate("/reports"),
      description: "Current inventory"
    },
    {
      title: "Total BV",
      value: stats.totalBV.toLocaleString(),
      icon: DollarSign,
      color: "amber",
      action: () => navigate("/reports"),
      description: "Current inventory"
    }
  ];

  const secondaryCards = [
    {
      title: "Restock Needed",
      value: warningStock.length,
      icon: AlertTriangle,
      color: "red",
      action: () => navigate("/stock"),
      description: "Products with 0 quantity"
    },
    {
      title: "Staff Members",
      value: stats.totalStaff,
      icon: Users,
      color: "indigo",
      action: () => navigate("/users"),
      description: "Active employees"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: "bg-blue-100", text: "text-blue-500", border: "border-blue-500" },
      purple: { bg: "bg-purple-100", text: "text-purple-500", border: "border-purple-500" },
      green: { bg: "bg-green-100", text: "text-green-500", border: "border-green-500" },
      amber: { bg: "bg-amber-100", text: "text-amber-500", border: "border-amber-500" },
      red: { bg: "bg-red-100", text: "text-red-500", border: "border-red-500" },
      indigo: { bg: "bg-indigo-100", text: "text-indigo-500", border: "border-indigo-500" }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const colorClasses = getColorClasses(card.color);
          return (
            <Card key={index} className={`border-l-4 ${colorClasses.border} hover:shadow-lg transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {card.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${colorClasses.bg}`}>
                    <card.icon className={`h-6 w-6 ${colorClasses.text}`} />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="mt-4 p-0 h-auto text-sm hover:bg-transparent"
                  onClick={card.action}
                >
                  View details →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondaryCards.map((card, index) => {
          const colorClasses = getColorClasses(card.color);
          return (
            <Card key={index} className={`border-l-4 ${colorClasses.border} hover:shadow-lg transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className={`text-xs ${colorClasses.text} mt-1 flex items-center`}>
                      <card.icon className="h-3 w-3 mr-1" />
                      {card.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${colorClasses.bg}`}>
                    <card.icon className={`h-6 w-6 ${colorClasses.text}`} />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="mt-4 p-0 h-auto text-sm hover:bg-transparent"
                  onClick={card.action}
                >
                  View details →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <DashboardChart salesTrend={salesTrend} />
            </div>
          </CardContent>
        </Card>

        {/* PV/BV Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products PV/BV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <PvBvChart stockData={topSellingProducts} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Type Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Client Type Sales Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ClientTypeChart clientTypeData={clientTypeData} />
            </div>
          </CardContent>
        </Card>

        {/* Most Bought Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Qty Sold</th>
                    <th className="text-left p-4 font-medium">PV</th>
                    <th className="text-left p-4 font-medium">BV</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{product.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-muted-foreground">{product.salesCount || 0}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-muted-foreground">{(product.pv || 0).toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-muted-foreground">{(product.bv || 0).toLocaleString()}</div>
                      </td>
                    </tr>
                  ))}
                  {topSellingProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        No top selling products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Button
                variant="ghost"
                onClick={() => navigate("/stock")}
              >
                View all products →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
