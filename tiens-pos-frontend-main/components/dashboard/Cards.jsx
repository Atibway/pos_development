import { FaUsers, FaBoxOpen, FaExclamationTriangle } from "react-icons/fa"
import { TbReportMoney } from "react-icons/tb" // Changed from TbZoomMoney
import { HiOutlineCurrencyDollar } from "react-icons/hi"

function Cards({ allStock, warningStock, customers, staff }) {
  // Removed accounts, unsettledAccounts
  // Calculate total PV and BV
  const totalPv = allStock.reduce((sum, stock) => sum + (stock.pv || 0) * (stock.qty || 0), 0)
  const totalBv = allStock.reduce((sum, stock) => sum + (stock.bv || 0) * (stock.qty || 0), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Customers Card */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Customers</p>
            <p className="text-2xl font-bold">{customers?.length || 0}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <FaUsers className="text-blue-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Products Card */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-2xl font-bold">{allStock?.length || 0}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <FaBoxOpen className="text-purple-500 text-xl" />
          </div>
        </div>
      </div>

      {/* PV Total Card */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total PV</p>
            <p className="text-2xl font-bold">{totalPv.toLocaleString()}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <TbReportMoney className="text-green-500 text-xl" />
          </div>
        </div>
      </div>

      {/* BV Total Card */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total BV</p>
            <p className="text-2xl font-bold">{totalBv.toLocaleString()}</p>
          </div>
          <div className="bg-amber-100 p-3 rounded-full">
            <HiOutlineCurrencyDollar className="text-amber-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Restock Warning Card */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Restock Needed (Zero Quantity)</p>
            <p className="text-2xl font-bold">{warningStock?.length || 0}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <FaExclamationTriangle className="text-red-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Staff Card */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Staff Members</p>
            <p className="text-2xl font-bold">{staff?.length || 0}</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-full">
            <FaUsers className="text-indigo-500 text-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cards
