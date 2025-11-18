import { useState, useEffect } from "react"
import axiosInstance from "../../axios-instance"
import { useFeedback } from "../../hooks/feedback"
import { format } from "date-fns"
import Loader from "../../components/Loader"
import PrintFunc from "../../hooks/print"
import { IoPrintOutline as Printer, IoClose as X } from "react-icons/io5"

const DailyShopSalesReports = () => {
  const [shops, setShops] = useState([])
  const [selectedShopForDailySales, setSelectedShopForDailySales] = useState(null)
  const [dailyShopSales, setDailyShopSales] = useState([])
  const [dailySalesLoading, setDailySalesLoading] = useState(false)
  const [showDailyShopSalesModal, setShowDailyShopSalesModal] = useState(false)
  const { toggleFeedback } = useFeedback()

  const { handlePrint: handlePrintDailySales, printRef: dailySalesPrintRef } = PrintFunc()

  const fetchShops = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("schoolSoftUser"))
      if (!user) throw new Error("User not logged in")

      // Fetch all shops, adjust endpoint if needed
      const res = await axiosInstance.get(`/shops`)
      const data = Array.isArray(res.data) ? res.data : res.data.payload || []
      setShops(data)
    } catch (error) {
      console.error("Failed to fetch shops:", error)
      toggleFeedback("error", {
        title: "Error",
        text: "Failed to load shops.",
      })
    }
  }

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchDailyShopSales = async (shop) => {
    if (!shop?.id) {
      toggleFeedback("error", { title: "Error", text: "Invalid shop selected." })
      return
    }
    setSelectedShopForDailySales(shop)
    setShowDailyShopSalesModal(true)
    setDailySalesLoading(true)
    try {
      const today = format(new Date(), "yyyy-MM-dd")
      const res = await axiosInstance.get(`/sales/by-shop-date?shopId=${shop.id}&date=${today}`)

      if (res.data.status) {
        setDailyShopSales(res.data.payload || [])
      } else {
        setDailyShopSales([])
        toggleFeedback("error", {
          title: "Error",
          text: res.data.payload || "Failed to fetch daily sales.",
        })
      }
    } catch (error) {
      console.error("Error fetching daily shop sales:", error)
      toggleFeedback("error", {
        title: "Error",
        text: error?.response?.data?.payload || error.message || "Failed to fetch daily sales for this shop.",
      })
      setDailyShopSales([])
    } finally {
      setDailySalesLoading(false)
    }
  }

  const closeDailyShopSalesModal = () => {
    setShowDailyShopSalesModal(false)
    setSelectedShopForDailySales(null)
    setDailyShopSales([])
  }

  return (
    <div className="p-4">
      <h1 className="text-secondary font-semibold text-xl mb-4">Daily Sales Reports by Shop</h1>

      {shops.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No shops available to display daily sales.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((shop) => (
            <div key={shop.id} className="border rounded-md p-4 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <p className="font-semibold text-lg text-primary">{shop.name}</p>
                <p className="text-sm text-gray5">{shop.location}</p>
              </div>
              <button
                onClick={() => fetchDailyShopSales(shop)}
                disabled={dailySalesLoading && selectedShopForDailySales?.id === shop.id}
                className={`mt-4 px-3 py-1 rounded-md text-sm self-start ${
                  dailySalesLoading && selectedShopForDailySales?.id === shop.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                View Daily Sales
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Daily Shop Sales Modal */}
      {showDailyShopSalesModal && selectedShopForDailySales && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                Daily Sales Report - {selectedShopForDailySales.name} ({format(new Date(), "PPP")})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintDailySales}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Report
                </button>
                <button
                  onClick={closeDailyShopSalesModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="flex-1 overflow-hidden">
  <div
    ref={dailySalesPrintRef}
    className="h-full print:h-auto print:p-8 flex flex-col"
  >
    {/* Print Header */}
    <div className="hidden print:block mb-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-black tracking-wide uppercase">
          TIENS HEALTH PRODUCTS
        </h2>
        <p className="text-lg font-semibold mt-2">DAILY SALES REPORT</p>
        <p className="text-sm mt-1">
          Shop: {selectedShopForDailySales.name} | Date: {format(new Date(), "PPP")}
        </p>
      </div>
    </div>

    {dailySalesLoading ? (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    ) : (
      <div className="flex-1 overflow-y-auto max-h-[65vh] print:max-h-none">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 print:bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                S/N
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Product
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Client Type
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Qty
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Price (UGX)
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Total (UGX)
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                PV
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
              Total  PV
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                BV
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total  BV
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dailyShopSales.length > 0 ? (
              <>
                {dailyShopSales.map((sale, index) => (
                
                  <tr
                    key={sale.id}
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                      <div className="font-medium">{sale.stock?.name || "N/A"}</div>
                      <div className="text-xs text-gray-500">{sale.stock?.productCode || "-"}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {sale.clientType || "N/A"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right border-r border-gray-200">
                      {sale.quantity}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right border-r border-gray-200">
                      {sale.unitPrice?.toLocaleString() || "N/A"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right border-r border-gray-200">
                      {(sale.unitPrice * sale.quantity).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-blue-600 text-right border-r border-gray-200">
                      {(sale.stock?.pv).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-blue-600 text-right border-r border-gray-200">
                      {(sale.stock?.pv * sale.quantity).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600 text-right">
                      {(sale.stock?.bv).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600 text-right">
                      {(sale.stock?.bv * sale.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
               {/* Grand Totals */}
<tr className="bg-gray-800 text-white font-bold sticky bottom-0">
  {/* Label */}
  <td colSpan="3" className="px-3 py-2 text-sm uppercase border-r border-gray-600">
    GRAND TOTALS
  </td>

  {/* Total Quantity */}
  <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
    {dailyShopSales
      .reduce((sum, sale) => sum + sale.quantity, 0)
      .toLocaleString()}
  </td>

  {/* Unit Price column — no total */}
  <td className="px-3 py-2 text-sm text-right border-r border-gray-600">-</td>

  {/* Total Amount */}
  <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
    UGX{" "}
    {dailyShopSales
      .reduce((sum, sale) => sum + sale.unitPrice * sale.quantity, 0)
      .toLocaleString()}
  </td>

  {/* Total PV */}
  <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
    {dailyShopSales
      .reduce((sum, sale) => sum + (sale.stock?.pv || 0), 0)
      .toLocaleString()}
  </td>

  {/* Total PV Value */}
  <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
    {dailyShopSales
      .reduce((sum, sale) => sum + (sale.stock?.pv || 0) * sale.quantity, 0)
      .toLocaleString()}
  </td>

  {/* Total BV */}
  <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
    {dailyShopSales
      .reduce((sum, sale) => sum + (sale.stock?.bv || 0), 0)
      .toLocaleString()}
  </td>

  {/* Total BV Value */}
  <td className="px-3 py-2 text-sm text-right">
    {dailyShopSales
      .reduce((sum, sale) => sum + (sale.stock?.bv || 0) * sale.quantity, 0)
      .toLocaleString()}
  </td>
</tr>

              </>
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg font-medium">No sales recorded for this shop today.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}

    {/* Print Footer */}
    <div className="hidden print:block mt-8 pt-4 border-t border-gray-300">
      <div className="text-center text-xs text-gray-600">
        <p>
          TIENS HEALTH PRODUCTS - 6th Floor, King Fahd Plaza, Plot 52 Kampala Rd - P.O.Box .... Kampala -
          Tel: +256 (0) 702 794 458 | 0750 838 085 | 0773 662 136 - Generated on:{" "}
          {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  </div>
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyShopSalesReports
