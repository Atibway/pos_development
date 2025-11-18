"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { formatCurrency } from "../utils/formateNumber"
import Loader from "./Loader"

const ShopSalesReportModal = ({ shop, salesData, isOpen, onClose, loading }) => {
  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${shop?.name || "Shop"} Sales Report`,
  })

  if (!isOpen) return null

  const totalQuantity = salesData.reduce((sum, sale) => {
    return sum + sale.products.reduce((prodSum, prod) => prodSum + prod.quantity, 0)
  }, 0)

  const totalAmount = salesData.reduce((sum, sale) => sum + Number.parseFloat(sale.total), 0)
  const totalPv = salesData.reduce((sum, sale) => sum + Number.parseFloat(sale.totalPv), 0)
  const totalBv = salesData.reduce((sum, sale) => sum + Number.parseFloat(sale.totalBv), 0)

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl w-full">
        <div className="modal-header">
          <h2 className="text-2xl font-bold">Sales Report for {shop?.name}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div ref={componentRef} className="p-4 print-area">
            <h3 className="text-lg font-bold mb-4 text-center">
              Sales for {shop?.name} ({new Date().toLocaleDateString()})
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Sale ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Total Amount</th>
                    <th>Total PV</th>
                    <th>Total BV</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.length > 0 ? (
                    salesData.map((sale) => (
                      <tr key={sale.id}>
                        <td>{sale.id}</td>
                        <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                        <td>{sale.customer?.name || "N/A"}</td>
                        <td>{sale.products.map((p) => `${p.name} (x${p.quantity})`).join(", ")}</td>
                        <td>{formatCurrency(sale.total)}</td>
                        <td>{sale.totalPv.toFixed(2)}</td>
                        <td>{sale.totalBv.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No sales found for this shop in the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-bold text-lg">
              <div className="p-4 bg-blue-100 rounded-lg">
                <p>Total Quantity</p>
                <p>{totalQuantity}</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg">
                <p>Total Amount</p>
                <p>{formatCurrency(totalAmount)}</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-lg">
                <p>Total PV</p>
                <p>{totalPv.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-orange-100 rounded-lg">
                <p>Total BV</p>
                <p>{totalBv.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopSalesReportModal
