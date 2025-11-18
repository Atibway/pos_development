"use client";

import { useState } from "react";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import PrintFunc from "../../hooks/print";
import axiosInstance from "../../axios-instance";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ProfitLossReports() {
  const [loading, setLoading] = useState(false);
  const [dailyData, setDailyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Print hook
  const { handlePrint, printRef } = PrintFunc();

  const fetchDaily = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/sales/profit-loss/daily?date=${selectedDate}`);
      setDailyData(res.data.payload);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthly = async () => {
    if (!selectedMonth) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/sales/profit-loss/monthly?month=${selectedMonth}`);
      setMonthlyData(res.data.payload);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const dailyChartData = dailyData
    ? [
        { label: "Revenue", value: dailyData.totalRevenue },
        { label: "Cost", value: dailyData.totalCost },
        { label: "Profit", value: dailyData.totalProfit },
      ]
    : [];

  const monthlyChartData = monthlyData
    ? [
        { label: "Revenue", value: monthlyData.totalRevenue },
        { label: "Cost", value: monthlyData.totalCost },
        { label: "Profit", value: monthlyData.totalProfit },
      ]
    : [];

  return (
    <div className="relative p-6 bg-gray-50 min-h-screen">
      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Profit & Loss Reports</h1>
<div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow-sm">
  <h3 className="text-sm font-semibold text-yellow-800 mb-1">How Profit & Loss is Calculated</h3>
  <p className="text-xs text-yellow-900">
    - <strong>Total Revenue:</strong> Sum of all sales amounts (selling price × quantity).<br/>
    - <strong>Total Cost:</strong> Sum of all purchase costs for sold products (purchase price × quantity).<br/>
    - <strong>Profit:</strong> Total Revenue − Total Cost.<br/>
    - This summary is based on sales data fetched from the system for the selected day or month.
  </p>
</div>

      {/* Daily Section */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-2">Daily Summary</h2>
        <div className="flex gap-2 mb-4">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
          <Button onClick={fetchDaily}>Load Daily</Button>
          <Button onClick={handlePrint}>Print Daily</Button>
        </div>

        {dailyData && (
          <div ref={printRef} className="bg-white shadow rounded-lg p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-600">Revenue</h3>
                <p className="text-xl font-bold text-blue-900">{dailyData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-sm font-medium text-red-600">Cost</h3>
                <p className="text-xl font-bold text-red-900">{dailyData.totalCost.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-600">Profit</h3>
                <p className="text-xl font-bold text-green-900">{dailyData.totalProfit.toLocaleString()}</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Section */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-2">Monthly Summary</h2>
        <div className="flex gap-2 mb-4">
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border p-2 rounded" />
          <Button onClick={fetchMonthly}>Load Monthly</Button>
          <Button onClick={handlePrint}>Print Monthly</Button>
        </div>

        {monthlyData && (
          <div ref={printRef} className="bg-white shadow rounded-lg p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-600">Revenue</h3>
                <p className="text-xl font-bold text-blue-900">{monthlyData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-sm font-medium text-red-600">Cost</h3>
                <p className="text-xl font-bold text-red-900">{monthlyData.totalCost.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-600">Profit</h3>
                <p className="text-xl font-bold text-green-900">{monthlyData.totalProfit.toLocaleString()}</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
