"use client"

import { useEffect, useState } from "react"
import "../assets/styles/main.css"
import "../assets/styles/dashboard.css"
import { FaBoxOpen, FaUsers, FaExclamationTriangle } from "react-icons/fa"
import { TbReportMoney } from "react-icons/tb"
import { HiOutlineCurrencyDollar } from "react-icons/hi"
import { BsGraphUp } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getAllStock, getCustomers, getStaff, getTopStock, getSales } from "../store/slices/store" // Added getSales

import DashboardChart from "../components/dashboard/DashboardChart"
import PvBvChart from "../components/dashboard/PvBvChart"
import ClientTypeChart from "../components/dashboard/ClientTypeChart"

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { allStock, customers, topStock, staff, sales } = useSelector((state) => state.autocountStore) // Removed accounts
  const [warningStock, setWarningStock] = useState([])
  const [stocksWithHighestSales, setStocksWithHighestSales] = useState([])
  const [totalPv, setTotalPv] = useState(0)
  const [totalBv, setTotalBv] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [clientTypeData, setClientTypeData] = useState([])
  const [salesTrend, setSalesTrend] = useState([])

  // Fetch all required data
  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      dispatch(getAllStock()),
      dispatch(getCustomers()),
      dispatch(getTopStock()),
      dispatch(getStaff()),
      dispatch(getSales()), // Fetch sales data
    ]).then(() => {
      setIsLoading(false)
    })
  }, [dispatch])

  // Process warning stock (qty === 0)
  useEffect(() => {
    const warning = allStock.filter((stock) => {
      return stock.qty === 0
    })
    setWarningStock(warning)
  }, [allStock])

  // Process stocks with highest sales
  useEffect(() => {
    if (allStock.length > 0) {
      const allS = [...allStock]
      const stocksWithHighestSales = allS.sort((a, b) => {
        if ((a.sales?.length || 0) > (b.sales?.length || 0)) {
          return -1
        } else {
          return 1
        }
      })
      setStocksWithHighestSales(stocksWithHighestSales.slice(0, 5))
    }
  }, [allStock])

  // Calculate total PV and BV from all stock
  useEffect(() => {
    let pv = 0
    let bv = 0

    allStock.forEach((stock) => {
      pv += (stock.pv || 0) * (stock.qty || 0)
      bv += (stock.bv || 0) * (stock.qty || 0)
    })

    setTotalPv(pv)
    setTotalBv(bv)
  }, [allStock])

  // Generate client type data for chart
  useEffect(() => {
    if (sales && sales.length > 0) {
      const clientTypes = {
        Member: { count: 0, value: 0, pv: 0, bv: 0 },
        "Non-Member": { count: 0, value: 0, pv: 0, bv: 0 },
        "Working Client": { count: 0, value: 0, pv: 0, bv: 0 },
        "HP Client": { count: 0, value: 0, pv: 0, bv: 0 },
      }

      sales.forEach((sale) => {
        const clientType = sale.clientType || "Non-Member"
        if (clientTypes[clientType]) {
          clientTypes[clientType].count += 1
          clientTypes[clientType].value += sale.price || 0
          clientTypes[clientType].pv += (sale.stock?.pv || 0) * (sale.quantity || 0)
          clientTypes[clientType].bv += (sale.stock?.bv || 0) * (sale.quantity || 0)
        }
      })

      setClientTypeData(
        Object.keys(clientTypes).map((key) => ({
          name: key,
          count: clientTypes[key].count,
          value: clientTypes[key].value,
          pv: clientTypes[key].pv,
          bv: clientTypes[key].bv,
        })),
      )
    }
  }, [sales])

  // Generate sales trend data for the last 7 days
  useEffect(() => {
    if (sales && sales.length > 0) {
      const salesByDate = {}
      sales.forEach((sale) => {
        const saleDate = new Date(sale.date)
        saleDate.setHours(0, 0, 0, 0) // Normalize date to start of day
        const dateKey = saleDate.toISOString().split("T")[0] // YYYY-MM-DD

        if (!salesByDate[dateKey]) {
          salesByDate[dateKey] = {
            total: 0,
            pv: 0,
            bv: 0,
            count: 0,
          }
        }
        salesByDate[dateKey].total += sale.price || 0
        salesByDate[dateKey].pv += (sale.stock?.pv || 0) * (sale.quantity || 0)
        salesByDate[dateKey].bv += (sale.stock?.bv || 0) * (sale.quantity || 0)
        salesByDate[dateKey].count += 1
      })

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const last7Days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        last7Days.push(d.toISOString().split("T")[0])
      }

      const trendData = last7Days.map((dateKey) => ({
        date: dateKey,
        total: salesByDate[dateKey]?.total || 0,
        pv: salesByDate[dateKey]?.pv || 0,
        bv: salesByDate[dateKey]?.bv || 0,
        count: salesByDate[dateKey]?.count || 0,
      }))

      setSalesTrend(trendData)
    } else {
      setSalesTrend([]) // Clear sales trend if no sales data
    }
  }, [sales])

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-[100vh] overflow-y-auto bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-primary mb-6">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Customers Card */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold">{customers?.length || 0}</p>
              <p className="text-xs text-green-500 mt-1">
                <span className="flex items-center">
                  <BsGraphUp className="mr-1" /> Active accounts
                </span>
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUsers className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate("/customers")}
              className="text-blue-500 text-sm hover:text-blue-700 transition-colors"
            >
              View all customers →
            </button>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-bold">{allStock?.length || 0}</p>
              <p className="text-xs text-green-500 mt-1">
                <span className="flex items-center">
                  <BsGraphUp className="mr-1" /> In inventory
                </span>
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaBoxOpen className="text-purple-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate("/stock")}
              className="text-purple-500 text-sm hover:text-purple-700 transition-colors"
            >
              View all products →
            </button>
          </div>
        </div>

        {/* PV Total Card */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total PV</p>
              <p className="text-2xl font-bold">{totalPv.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1">
                <span className="flex items-center">
                  <BsGraphUp className="mr-1" /> Current inventory
                </span>
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TbReportMoney className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate("/reports")}
              className="text-green-500 text-sm hover:text-green-700 transition-colors"
            >
              View reports →
            </button>
          </div>
        </div>

        {/* BV Total Card */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total BV</p>
              <p className="text-2xl font-bold">{totalBv.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1">
                <span className="flex items-center">
                  <BsGraphUp className="mr-1" /> Current inventory
                </span>
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <HiOutlineCurrencyDollar className="text-amber-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate("/reports")}
              className="text-amber-500 text-sm hover:text-amber-700 transition-colors"
            >
              View reports →
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        {" "}
        {/* Adjusted grid for 2 cards */}
        {/* Restock Warning Card */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Restock Needed (Zero Quantity)</p>
              <p className="text-2xl font-bold">{warningStock?.length || 0}</p>
              <p className="text-xs text-red-500 mt-1">
                <span className="flex items-center">
                  <FaExclamationTriangle className="mr-1" /> Products with 0 quantity
                </span>
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FaExclamationTriangle className="text-red-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate("/stock")}
              className="text-red-500 text-sm hover:text-red-700 transition-colors"
            >
              View low stock →
            </button>
          </div>
        </div>
        {/* Staff Card */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Staff Members</p>
              <p className="text-2xl font-bold">{staff?.length || 0}</p>
              <p className="text-xs text-indigo-500 mt-1">
                <span className="flex items-center">
                  <FaUsers className="mr-1" /> Active employees
                </span>
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <FaUsers className="text-indigo-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate("/users")}
              className="text-indigo-500 text-sm hover:text-indigo-700 transition-colors"
            >
              View all staff →
            </button>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-primary mb-4">Sales Trend (Last 7 Days)</h2>
          <div className="h-80">
            <DashboardChart salesTrend={salesTrend} />
          </div>
        </div>

        {/* PV/BV Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-primary mb-4">Top 5 Products PV/BV</h2>
          <div className="h-80">
            <PvBvChart stockData={stocksWithHighestSales} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Type Analysis */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-primary mb-4">Client Type Sales Analysis</h2>
          <div className="h-80">
            <ClientTypeChart clientTypeData={clientTypeData} />
          </div>
        </div>

        {/* Most Bought Items Table */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-primary mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Qty Sold
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    PV
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    BV
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stocksWithHighestSales.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.sales?.length || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{(product.pv || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{(product.bv || 0).toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
                {stocksWithHighestSales.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No top selling products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={() => navigate("/stock")}
              className="text-primary text-sm hover:text-blue-700 transition-colors"
            >
              View all products →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
