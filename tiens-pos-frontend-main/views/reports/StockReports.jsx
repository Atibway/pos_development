import { useState, useEffect } from "react"
import axiosInstance from "../../axios-instance"
import Button from "../../components/Button"
import Loader from "../../components/Loader"
import PrintFunc from "../../hooks/print"
import Select from "react-select"

const StockReports = () => {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [stockLevelFilter, setStockLevelFilter] = useState("")

  const { handlePrint, printRef } = PrintFunc()

  const stockLevelOptions = [
    { value: "", label: "All Stock Levels" },
    { value: "low", label: "Low Stock (< 10)" },
    { value: "medium", label: "Medium Stock (10-50)" },
    { value: "high", label: "High Stock (> 50)" },
    { value: "out", label: "Out of Stock (0)" },
  ]

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get("/stock")
      let stockData = res.data.payload || []

      // Apply search filter
      if (search) {
        stockData = stockData.filter(
          (stock) =>
            stock.name?.toLowerCase().includes(search.toLowerCase()) ||
            stock.productCode?.toLowerCase().includes(search.toLowerCase()) ||
            stock.description?.toLowerCase().includes(search.toLowerCase()),
        )
      }

      // Apply category filter
      if (categoryFilter) {
        stockData = stockData.filter((stock) =>
          stock.category?.name?.toLowerCase().includes(categoryFilter.toLowerCase()),
        )
      }

      // Filter by stock level if selected
      if (stockLevelFilter) {
        stockData = stockData.filter((stock) => {
          const qty = stock.qty || 0
          switch (stockLevelFilter) {
            case "low":
              return qty > 0 && qty < 10
            case "medium":
              return qty >= 10 && qty <= 50
            case "high":
              return qty > 50
            case "out":
              return qty === 0
            default:
              return true
          }
        })
      }

      setStocks(stockData)
    } catch (error) {
      console.error("Error fetching stocks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStocks()
  }, [search, categoryFilter, stockLevelFilter])

  const handleClearFilters = () => {
    setSearch("")
    setCategoryFilter("")
    setStockLevelFilter("")
    // Re-fetch stocks after clearing filters
    fetchStocks()
  }

  const totalValue = stocks.reduce((sum, stock) => sum + (stock.qty || 0) * (stock.price || 0), 0)
  const totalQty = stocks.reduce((sum, stock) => sum + (stock.qty || 0), 0)
  const totalPv = stocks.reduce((sum, stock) => sum + (stock.pv || 0) * (stock.qty || 0), 0)
  const totalBv = stocks.reduce((sum, stock) => sum + (stock.bv || 0) * (stock.qty || 0), 0)
  const lowStockItems = stocks.filter((stock) => (stock.qty || 0) < 10 && (stock.qty || 0) > 0).length
  const outOfStockItems = stocks.filter((stock) => (stock.qty || 0) === 0).length

  const getStockLevelBadge = (qty) => {
    if (qty === 0) {
      return (
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          Out of Stock
        </span>
      )
    } else if (qty < 10) {
      return (
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          Low Stock
        </span>
      )
    } else if (qty <= 50) {
      return (
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Medium Stock
        </span>
      )
    } else {
      return (
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          High Stock
        </span>
      )
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50">
      <div className="h-full bg-white rounded-lg shadow-sm flex flex-col">
        {/* Header */}
        <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900">Stock Report</h1>
            <Button value="Print Report" onClick={handlePrint} />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
            <input
                placeholder="Search by name or code"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className=" text-sm py-1 px-4 rounded-lg my-1 w-full bg-gray1  text-gray5 h-8 "
                
        />
            </div>
            <div>
           <Select
  options={stockLevelOptions}
  value={stockLevelOptions.find((option) => option.value === stockLevelFilter)}
  onChange={(option) => setStockLevelFilter(option?.value || "")}
  placeholder="All Stock Level"
  className="text-sm h-9"
  classNamePrefix="react-select"
  styles={{
    control: (base) => ({
      ...base,
      minHeight: "36px",
      height: "36px",
      zIndex: 100, // good to set here too for the control itself
      position: "relative", // ensure position context for menu
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999, // very high to overlap other elements like table header
    }),
    valueContainer: (base) => ({
      ...base,
      height: "36px",
      padding: "0 8px",
    }),
    input: (base) => ({
      ...base,
      margin: "0",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "36px",
    }),
  }}
/>

            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchStocks}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors h-9 text-sm"
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-600">Total Value</h3>
              <p className="text-xl font-bold text-blue-900">UGX {totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium text-green-600">Total Quantity</h3>
              <p className="text-xl font-bold text-green-900">{totalQty.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
              <h3 className="text-sm font-medium text-yellow-600">Low Stock Items</h3>
              <p className="text-xl font-bold text-yellow-900">{lowStockItems}</p>
            </div>
            <div className="bg-red-50 p-2 rounded-lg border border-red-200">
              <h3 className="text-sm font-medium text-red-600">Out of Stock</h3>
              <p className="text-xl font-bold text-red-900">{outOfStockItems}</p>
            </div>
            <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-200">
              <h3 className="text-sm font-medium text-indigo-600">Total PV</h3>
              <p className="text-xl font-bold text-indigo-900">{totalPv.toLocaleString()}</p>
            </div>
            <div className="bg-teal-50 p-2 rounded-lg border border-teal-200">
              <h3 className="text-sm font-medium text-teal-600">Total BV</h3>
              <p className="text-xl font-bold text-teal-900">{totalBv.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Table Container - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <div ref={printRef} className="h-full print:h-auto print:p-8">
            {/* Print Header */}
            <div className="hidden print:block mb-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-black tracking-wide uppercase">TIENS HEALTH PRODUCTS</h2>
                <p className="text-lg font-semibold mt-2">STOCK REPORT</p>
                <p className="text-sm mt-1">Generated on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Scrollable Table */}
            <div className="h-full overflow-auto print:overflow-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 print:bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      S/N
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Code
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Product Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Description
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Quantity
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Total Value
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      PV
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      BV
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : stocks.length > 0 ? (
                    <>
                      {stocks.map((stock, index) => {
                        const qty = stock.qty || 0
                        const price = stock.price || 0
                        const totalValueRow = qty * price
                        const rowPv = (stock.pv || 0) * qty
                        const rowBv = (stock.bv || 0) * qty

                        return (
                          <tr
                            key={stock.id}
                            className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                          >
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              {index + 1}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              {stock.productCode || "-"}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                              <div className="font-medium">{stock.name}</div>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                              <div className="max-w-xs truncate">{stock.description || "-"}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right border-r border-gray-200">
                              {qty.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right border-r border-gray-200">
                              {totalValueRow.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-blue-600 text-right border-r border-gray-200">
                              {rowPv.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600 text-right border-r border-gray-200">
                              {rowBv.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">{getStockLevelBadge(qty)}</td>
                          </tr>
                        )
                      })}
                      {/* Grand Total Row */}
                      <tr className="bg-gray-800 text-white font-bold sticky bottom-0">
                        <td colSpan="4" className="px-3 py-2 text-sm uppercase border-r border-gray-600">
                          GRAND TOTALS
                        </td>
                        <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
                          {totalQty.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
                          UGX {totalValue.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
                          {totalPv.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
                          {totalBv.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm">-</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-12 h-12 text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <p className="text-lg font-medium">No stock items found</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 pt-4 border-t border-gray-300">
              <div className="text-center text-xs text-gray-600">
                <p>
                  TIENS HEALTH PRODUCTS - 6th Floor, King Fahd Plaza, Plot 52 Kampala Rd - P.O.Box .... Kampala - Tel:
                  +256 (0) 702 794 458 | 0750 838 085 | 0773 662 136 - Generated on: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockReports
