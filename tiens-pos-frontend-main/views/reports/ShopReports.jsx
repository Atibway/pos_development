"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../axios-instance"
import InputField from "../../components/InputField"
import Button from "../../components/Button"
import Loader from "../../components/Loader"
import PrintFunc from "../../hooks/print"
import formatNumber from "../../utils/formateNumber"

const ShopReports = () => {
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [issuedStocks, setIssuedStocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [modal, setModal] = useState(false)

  const { handlePrint, printRef } = PrintFunc()

  const openModal = () => setModal(true)
  const closeModal = () => {
    setModal(false)
    setSelectedShop(null)
    setIssuedStocks([])
  }

  const fetchShops = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get("/shops")
      let shopsData = res.data.payload || []

      // Apply search filter
      if (search) {
        shopsData = shopsData.filter(
          (shop) =>
            shop.name?.toLowerCase().includes(search.toLowerCase()) ||
            shop.location?.toLowerCase().includes(search.toLowerCase()) ||
            shop.contact?.toLowerCase().includes(search.toLowerCase()),
        )
      }

      setShops(shopsData)
    } catch (error) {
      console.error("Error fetching shops:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchIssuedStock = async (shop) => {
    try {
      setSelectedShop(shop)
      openModal()
      const res = await axiosInstance.get(`/shops/${shop.id}/stocks`)
      if (res.data.status) {
        setIssuedStocks(res.data.payload || [])
      }
    } catch (error) {
      console.error("Error fetching issued stock:", error)
    }
  }

  useEffect(() => {
    fetchShops()
  }, [search])

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50">
      <div className="h-full bg-white rounded-lg shadow-sm flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Shop Report</h1>
            <div className="flex gap-4">
              <InputField
                placeholder="Search shops..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-600">Total Shops</h3>
              <p className="text-2xl font-bold text-blue-900">{shops.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium text-green-600">Active Shops</h3>
              <p className="text-2xl font-bold text-green-900">{shops.filter((shop) => shop.isActive).length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-sm font-medium text-purple-600">Total Stock Issues</h3>
              <p className="text-2xl font-bold text-purple-900">
                {shops.reduce((sum, shop) => sum + (shop.issuedStocks?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Table Container - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      S/N
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Shop Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Stock Issues
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shops.length > 0 ? (
                    shops.map((shop, index) => (
                      <tr
                        key={shop.id}
                        className={`hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                        onClick={() => fetchIssuedStock(shop)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                          <div className="font-medium">{shop.name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">{shop.location}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">{shop.contact}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center border-r border-gray-200">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {shop.issuedStocks?.length || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <button className="text-blue-600 hover:text-blue-900 font-medium">View Details</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <p className="text-lg font-medium">No shops found</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal for Shop Details */}
        {modal && selectedShop && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Issued Stock Report - {selectedShop.name}</h2>
                <div className="flex gap-2">
                  <Button value="Print Report" onClick={handlePrint} />
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div ref={printRef} className="flex-1 flex flex-col print:h-auto">
                  {/* Print Header */}
                  <div className="hidden print:block mb-6 p-4">
                    <div className="text-center mb-4">
                      <h2 className="text-2xl font-bold text-black tracking-wide uppercase">TIENS HEALTH PRODUCTS</h2>
                      <p className="text-lg font-semibold mt-2">SHOP STOCK REPORT</p>
                      <p className="text-sm mt-1">Shop: {selectedShop.name}</p>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0 print:bg-white print:border-b-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Shop Name</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedShop.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Location</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedShop.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contact</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedShop.contact}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Serial Number</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedShop.serialNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Table Area */}
                  <div className="flex-1 overflow-auto max-h-[65vh] print:overflow-visible">
                    <table className="min-w-full divide-y divide-gray-200 print:text-xs">
                      <thead className="bg-gray-50 print:bg-gray-200 sticky top-0 z-10">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">S/N</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">Date</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">Code</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">Product Name</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">Qty</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">Price</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">PV</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">BV</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">Total PV</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 print:px-1 print:py-1 print:border print:border-gray-300">Total BV</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider print:px-1 print:py-1 print:border print:border-gray-300">Total Price</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedShop.issuedStocks && selectedShop.issuedStocks.length > 0 ? (
                          selectedShop.issuedStocks.map((stock, index) => {
                            const totalPV = (stock.qty || 0) * (stock.pv || 0)
                            const totalBV = (stock.qty || 0) * (stock.bv || 0)
                            const totalPrice = (stock.qty || 0) * (stock.price || 0);
                            return (
                              <tr
                                key={stock.id}
                                className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                              >
                                <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">{index + 1}</td>
                                <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">
                                  {new Date(stock.issuedAt || stock.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">{stock.productCode || "-"}</td>
                                <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">
                                  <div className="font-medium">{stock.name}</div>
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 text-right border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">
                                  {(stock.qty || 0).toLocaleString()}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 text-right border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">
                                  {formatNumber(stock.price || 0)}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 text-right border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">
                                  {formatNumber(stock.pv || 0)}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 text-right border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">
                                  {formatNumber(stock.bv || 0)}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 text-right border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">
                                  {totalPV.toLocaleString()}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 text-right border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">
                                  {totalBV.toLocaleString()}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 text-right print:px-1 print:py-1 print:text-xs print:border print:border-gray-300">
                                  {totalPrice.toLocaleString()}
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan="11" className="px-6 py-12 text-center text-gray-500">
                              <p className="text-lg font-medium">No stock issued to this shop</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                      
                      {/* Grand Totals - Inside same table for proper alignment */}
                      {selectedShop.issuedStocks && selectedShop.issuedStocks.length > 0 && (
                        <tfoot className="bg-gray-800 text-white font-bold  ">
                          <tr>
                            <td className="px-3 py-3 text-sm uppercase  border-gray-600 print:px-1 print:py-2 print:text-xs  "></td>
                            <td className="px-3 py-3 text-sm uppercase  border-gray-600 print:px-1 print:py-2 print:text-xs  ">GRAND</td>
                            <td className="px-3 py-3 text-sm uppercase  border-gray-600 print:px-1 print:py-2 print:text-xs  ">TOTALS</td>
                            <td className="px-3 py-3 text-sm uppercase border-r border-gray-600 print:px-1 print:py-2 print:text-xs  "></td>
                            <td className="px-3 py-3 text-sm text-right border-r border-gray-600 print:px-1 print:py-2 print:text-xs  ">
                              {selectedShop.issuedStocks.reduce((sum, stock) => sum + (stock.qty || 0), 0).toLocaleString()}
                            </td>
                            <td className="px-3 py-3 text-sm text-right border-r border-gray-600 print:px-1 print:py-2 print:text-xs  ">-</td>
                            <td className="px-3 py-3 text-sm text-right border-r border-gray-600 print:px-1 print:py-2 print:text-xs  ">
                              {selectedShop.issuedStocks.reduce((sum, stock) => sum + (stock.pv || 0), 0).toLocaleString()}
                            </td>
                            <td className="px-3 py-3 text-sm text-right border-r border-gray-600 print:px-1 print:py-2 print:text-xs  ">
                              {selectedShop.issuedStocks.reduce((sum, stock) => sum + (stock.bv || 0), 0).toLocaleString()}
                            </td>
                            <td className="px-3 py-3 text-sm text-right border-r border-gray-600 print:px-1 print:py-2 print:text-xs  ">
                              {selectedShop.issuedStocks.reduce((sum, stock) => sum + ((stock.qty || 0) * (stock.pv || 0)), 0).toLocaleString()}
                            </td>
                            <td className="px-3 py-3 text-sm text-right border-r border-gray-600 print:px-1 print:py-2 print:text-xs  ">
                              {selectedShop.issuedStocks.reduce((sum, stock) => sum + ((stock.qty || 0) * (stock.bv || 0)), 0).toLocaleString()}
                            </td>
                            <td className="px-3 py-3 text-sm text-right print:px-1 print:py-2 print:text-xs  ">
                              {selectedShop.issuedStocks.reduce((sum, stock) => sum + ((stock.qty || 0) * (stock.price || 0)), 0).toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>

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
        )}
      </div>
    </div>
  )
}

export default ShopReports
