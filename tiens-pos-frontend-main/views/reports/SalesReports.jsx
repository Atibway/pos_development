"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../../axios-instance";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import PrintFunc from "../../hooks/print";
import Select from "react-select";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";

const SalesReports = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // Product search
  const [shopSearch, setShopSearch] = useState(""); // Shop search
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState("");
const [distributorSearch, setDistributorSearch] = useState(""); 
  const { handlePrint, printRef } = PrintFunc();

  const clientTypeOptions = [
    { value: "", label: "All Client Types" },
    { value: "Member", label: "Member" },
    { value: "Non-Member", label: "Non-Member" },
    // { value: "Working Client", label: "Working Client" },
    { value: "Half-Price (HP) Client", label: "Half-Price (HP) Client" },
  ];

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (shopSearch) params.shop = shopSearch;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (distributorSearch) params.distributor = distributorSearch;

      const res = await axiosInstance.get("/sales/search", { params });
      let salesData = res.data.payload || [];

      // Filter client type locally if selected
      if (clientTypeFilter) {
        salesData = salesData.filter((sale) => sale.clientType === clientTypeFilter);
      }

      setSales(salesData);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [search, shopSearch, startDate, endDate, clientTypeFilter, distributorSearch]);

  const handleClearFilters = () => {
    setSearch("");
    setShopSearch("");
    setStartDate("");
    setEndDate("");
    setClientTypeFilter("");
    setDistributorSearch("");
    fetchSales();
  };

  const totalQty = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const totalAmount = sales.reduce(
    (sum, s) => sum + s.quantity * (s.unitPrice || s.stock?.price || 0),
    0
  );
  const totalPv = sales.reduce((sum, s) => sum + (s.stock?.pv || 0) * (s.quantity || 0), 0);
  const totalBv = sales.reduce((sum, s) => sum + (s.stock?.bv || 0) * (s.quantity || 0), 0);

  const getClientTypeBadge = (clientType) => {
    const colors = {
      Member: "bg-green-100 text-green-800 border-green-200",
      "Non-Member": "bg-gray-100 text-gray-800 border-gray-200",
      "Working Client": "bg-blue-100 text-blue-800 border-blue-200",
      "Half-Price (HP) Client": "bg-purple-100 text-purple-800 border-purple-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium border ${
          colors[clientType] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {clientType || "Unknown"}
      </span>
    );
  };

  const deleteSales = (sale) => {
  console.log("Deleting sale:", sale);

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/sales/${sale.id}`);
        const { data } = response;
        console.log("Delete response:", data);
        
        if (data.status) {
          fetchSales();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: `Sale has been deleted.`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error("Failed to delete sale", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong!",
        });
      }
    }
  });
};

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50">
      <div className="h-full bg-white rounded-lg shadow-sm flex flex-col">
        {/* Header */}
        <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900">Sales Report</h1>
            <Button value="Print Report" onClick={handlePrint} />
          </div>
        </div>

        {/* Filters */}
        <div className="px-2 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="grid lg:grid-cols-7 gap-2 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700">Search Product</label>
              <input
                placeholder="Search by Product Name"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                 className=" text-sm py-1 px-4 rounded-lg my-1 w-full bg-gray1  text-gray5 h-8 "
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Search Shop</label>
              <input
                placeholder="Search by Shop Name"
                type="text"
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                 className=" text-sm py-1 px-4 rounded-lg my-1 w-full bg-gray1  text-gray5 h-8 "
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Search Distributor</label>
              <input
                placeholder="Search by Distributor Name"
                type="text"
                value={distributorSearch}
                onChange={(e) => setDistributorSearch(e.target.value)}
                 className=" text-sm py-1 px-4 rounded-lg my-1 w-full bg-gray1  text-gray5 h-8 "
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                placeholder="Search by Distributor Name"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                 className=" text-sm py-1 px-4 rounded-lg my-1 w-full bg-gray1  text-gray5 h-8 "
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                 className=" text-sm py-1 px-4 rounded-lg my-1 w-full bg-gray1  text-gray5 h-8 "
              />
            </div>

            {/* <div>
              <label className="block text-xs font-medium text-gray-700">Client Type</label>
              <div className="h-9 z-50">
                <Select
                  options={clientTypeOptions}
                  value={clientTypeOptions.find((option) => option.value === clientTypeFilter)}
                  onChange={(option) => setClientTypeFilter(option?.value || "")}
                  placeholder="All Types"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: "36px",
                      minHeight: "36px",
                      fontSize: "0.875rem",
                      zIndex: "180",
                    }),
                  }}
                />
              </div>
            </div> */}

            <div>
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors h-9 text-sm"
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
              <p className="text-xl font-bold text-blue-900">UGX {totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium text-green-600">Total Quantity</h3>
              <p className="text-xl font-bold text-green-900">{totalQty.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
              <h3 className="text-sm font-medium text-purple-600">Total Records</h3>
              <p className="text-xl font-bold text-purple-900">{sales.length.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
              <h3 className="text-sm font-medium text-yellow-600">Total PV</h3>
              <p className="text-xl font-bold text-yellow-900">{totalPv.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-2 rounded-lg border border-red-200">
              <h3 className="text-sm font-medium text-red-600">Total BV</h3>
              <p className="text-xl font-bold text-red-900">{totalBv.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden">
          <div ref={printRef} className="h-full print:h-auto print:p-8">
            {/* Print Header */}
            <div className="hidden print:block mb-6 text-center">
              <h2 className="text-2xl font-bold">TIENS HEALTH PRODUCTS</h2>
              <p className="text-lg font-semibold mt-2">SALES REPORT</p>
              {(startDate || endDate) && (
                <p className="text-sm mt-1">
                  Period: {startDate || "Start"} to {endDate || "End"}
                </p>
              )}
            </div>

            {/* Scrollable Table */}
            <div className="h-full overflow-auto print:overflow-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">S/N</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Shop</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase text-right">Qty</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase text-right">Total</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase text-right">PV</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase text-right">Total PV</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase text-right">BV</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase text-right">Total BV</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Distributor</th>
                   <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase print:hidden">
      Actions
    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="text-center py-6">
                        <Loader />
                      </td>
                    </tr>
                  ) : sales.length > 0 ? (
                    sales.map((sale, index) => {
                      const unitPrice = sale.unitPrice || sale.stock?.price || 0;
                      const total = sale.quantity * unitPrice;
                      const rowPv = (sale.stock?.pv || 0) * (sale.quantity || 0);
                      const rowBv = (sale.stock?.bv || 0) * (sale.quantity || 0);

                      return (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{index + 1}</td>
                          <td className="px-3 py-2">{new Date(sale.date || sale.createdAt).toLocaleDateString()}</td>
                          <td className="px-3 py-2">{sale.stock?.name || "N/A"}</td>
                          <td className="px-3 py-2">{sale.shop?.name || "N/A"}</td>
                          <td className="px-3 py-2">{unitPrice}</td>
                          <td className="px-3 py-2 text-right">{sale.quantity}</td>
                          <td className="px-3 py-2 text-right">{total.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right">{sale.stock?.pv}</td>
                          <td className="px-3 py-2 text-right">{rowPv.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right">{sale.stock?.bv}</td>
                          <td className="px-3 py-2 text-right">{rowBv.toLocaleString()}</td>
                          <td className="px-3 py-2">{sale.customer?.name || "Walk-in"}</td>
                          <td className="px-3 py-2 print:hidden">
                            <MdDeleteOutline
                  onClick={() => deleteSales(sale)}
                  className="text-xl cursor-pointer hover:text-red"
                />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-6 text-gray-500">
                        No sales found. Adjust your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs">
              TIENS HEALTH PRODUCTS - Generated on: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;
