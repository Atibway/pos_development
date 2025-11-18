"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../../axios-instance";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import PrintFunc from "../../hooks/print";

const DistributorSalesReports = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // Product search
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [distributorSearch, setDistributorSearch] = useState(""); // Distributor search
const [searchAll, setSearchAll] = useState("")

  const { handlePrint, printRef } = PrintFunc();

  // Fetch distributor sales
  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (distributorSearch) params.distributor = distributorSearch;

      const res = await axiosInstance.get("/sales/search", { params });
      if (res.data.status) {
        // Only include distributor-linked sales
        const distributorSales = (res.data.payload || []).filter((s) => s.customer);
        setSales(distributorSales);
      }
    } catch (error) {
      console.error("Error fetching distributor sales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [search, startDate, endDate, distributorSearch]);

  const handleClearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setDistributorSearch("");
    setDistributorIdSearch("");
    fetchSales();
  };

  const totalQty = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const totalAmount = sales.reduce(
    (sum, s) => sum + (s.quantity || 0) * (s.stock?.price || 0),
    0
  );
  const totalPv = sales.reduce(
    (sum, s) => sum + (s.stock?.pv || 0) * (s.quantity || 0),
    0
  );
  const totalBv = sales.reduce(
    (sum, s) => sum + (s.stock?.bv || 0) * (s.quantity || 0),
    0
  );

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50">
      <div className="h-full bg-white rounded-lg shadow-sm flex flex-col">
        {/* Header */}
        <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Distributor Sales Report
          </h1>
          <Button value="Print Report" onClick={handlePrint} />
        </div>

        {/* Filters */}
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Distributor
              </label>
              <InputField
                placeholder="Search by Distributor Name"
                type="text"
                value={distributorSearch}
                onChange={(e) => setDistributorSearch(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <InputField
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Date
              </label>
              <InputField
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="flex gap-x-2 my-5">
              <button
                onClick={fetchSales}
                disabled={loading}
                className=" flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors h-9 text-sm"
              >
                {loading ? "Loading..." : "Filter"}
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors h-9 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-600">Total Sales</h3>
              <p className="text-xl font-bold text-blue-900">
                UGX {totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium text-green-600">
                Total Quantity
              </h3>
              <p className="text-xl font-bold text-green-900">
                {totalQty.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
              <h3 className="text-sm font-medium text-purple-600">
                Distributor Count
              </h3>
              <p className="text-xl font-bold text-purple-900">
                {new Set(sales.map((s) => s.customer?.id)).size}
              </p>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
              <h3 className="text-sm font-medium text-yellow-600">Total PV</h3>
              <p className="text-xl font-bold text-yellow-900">
                {totalPv.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 p-2 rounded-lg border border-red-200">
              <h3 className="text-sm font-medium text-red-600">Total BV</h3>
              <p className="text-xl font-bold text-red-900">
                {totalBv.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden">
  <div ref={printRef} className="h-full print:h-auto print:p-8">
    <div className="h-full overflow-auto print:overflow-visible">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 print:bg-gray-100 sticky top-0 z-10">
    <tr>
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        S/N
      </th>
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Date
      </th>
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Distributor Name
      </th>
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Distributor Id
      </th>
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Distributor Phone
      </th>
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Product Code
      </th>
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Product Name
      </th>
      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Quantity
      </th>
      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Price
      </th>
      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Total Price
      </th>
      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        PV
      </th>
      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Total PV
      </th>
      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        BV
      </th>
      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
        Total BV
      </th>
    </tr>
  </thead>

  <tbody className="bg-white divide-y divide-gray-200">
    {loading ? (
      <tr>
        <td colSpan={14} className="px-6 py-12 text-center">
          <Loader />
        </td>
      </tr>
    ) : sales.length > 0 ? (
      sales.map((sale, idx) => {
        const unitPrice = sale.stock?.price || 0;
        const total = (sale.quantity || 0) * unitPrice;
        const rowPv = (sale.stock?.pv || 0) * (sale.quantity || 0);
        const rowBv = (sale.stock?.bv || 0) * (sale.quantity || 0);

        return (
          <tr
            key={sale.id}
            className={`hover:bg-gray-50 ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-25"
            }`}
          >
            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
              {idx + 1}
            </td>
            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
              {new Date(sale.date || sale.createdAt).toLocaleDateString()}
            </td>
            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
              {sale.customer?.name || "-"}
            </td>
            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
              {sale.customer?.email || "-"}
            </td>
            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
              {sale.customer?.phone || "-"}
            </td>
            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
              {sale.stock?.productCode || "-"}
            </td>
            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
              {sale.stock?.name || "N/A"}
            </td>
            <td className="px-3 py-2 text-sm text-right border-r border-gray-200">
              {(sale.quantity || 0).toLocaleString()}
            </td>
            <td className="px-3 py-2 text-sm text-right border-r border-gray-200">
              {sale.stock?.price}
            </td>
            <td className="px-3 py-2 text-sm text-right border-r border-gray-200">
              {total.toLocaleString()}
            </td>
            <td className="px-3 py-2 text-sm text-blue-600 text-right border-r border-gray-200">
              {sale.stock?.pv}
            </td>
            <td className="px-3 py-2 text-sm text-blue-600 text-right border-r border-gray-200">
              {rowPv.toLocaleString()}
            </td>
            <td className="px-3 py-2 text-sm text-green-600 text-right border-r border-gray-200">
              {sale.stock?.bv}
            </td>
            <td className="px-3 py-2 text-sm text-green-600 text-right border-r border-gray-200">
              {rowBv.toLocaleString()}
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={14} className="px-6 py-12 text-center text-gray-500">
          No distributor sales found
        </td>
      </tr>
    )}
  {/* Totals Row */}

          <tr  className="bg-gray-100 font-bold sticky bottom-0 z-10 ">
            <td colSpan={7} className="px-3 py-2 text-right text-gray-700 border-r border-gray-200">
              Grand Totals:
            </td>
            <td className="px-3 py-2 text-right border-r border-gray-200">
              {totalQty.toLocaleString()}
            </td>
            <td className="px-3 py-2 text-right border-r border-gray-200">-</td>
            <td className="px-3 py-2 text-right border-r border-gray-200">
              {totalAmount.toLocaleString()}
            </td>
            <td className="px-3 py-2 text-right border-r border-gray-200">-</td>
            <td className="px-3 py-2 text-right border-r border-gray-200">
              {totalPv.toLocaleString()}
            </td>
            <td className="px-3 py-2 text-right border-r border-gray-200">-</td>
            <td className="px-3 py-2 text-right border-r border-gray-200">
              {totalBv.toLocaleString()}
            </td>
          </tr>
       
  </tbody>

</table>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorSalesReports;
