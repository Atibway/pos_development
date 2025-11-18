
import { useState } from "react"
import StockReports from "./reports/StockReports"
import SalesReports from "./reports/SalesReports"
import ShopReports from "./reports/ShopReports"
import DailyShopSalesReports from "./reports/DailyShopSalesReports" // Import the new component
import DistributorSalesReports from "./reports/DistributorSalesReports"
import ProfitLossReports from "./reports/profitandlosses"
// import LoansReports from "./reports/LoansReports";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("store")

  return (
    <div className="w-full bg-white rounded-md shadow p-2 h-[calc(100vh-80px)]">
      {/* Tabs */}
      <div className="flex gap-2 pt-2 w-full text-sm font-semibold cursor-pointer overflow-x-auto pb-2">
        <p
          onClick={() => setActiveTab("store")}
          className={`px-3 py-1 rounded ${activeTab === "store" ? "bg-primary text-white" : "bg-gray1 text-black"}`}
        >
          Stock
        </p>
        <p
          onClick={() => setActiveTab("menu")}
          className={`px-3 py-1 rounded ${activeTab === "menu" ? "bg-primary text-white" : "bg-gray1 text-black"}`}
        >
          Shop
        </p>
        <p
          onClick={() => setActiveTab("sales")}
          className={`px-3 py-1 rounded ${activeTab === "sales" ? "bg-primary text-white" : "bg-gray1 text-black"}`}
        >
          Sales
        </p>
        <p
          onClick={() => setActiveTab("dailyShopSales")} // New tab for daily shop sales
          className={`px-3 py-1 rounded ${
            activeTab === "dailyShopSales" ? "bg-primary text-white" : "bg-gray1 text-black"
          }`}
        >
          Daily Shop Sales
        </p>
        <p
          onClick={() => setActiveTab("DistributorSales")} // New tab for daily shop sales
          className={`px-3 py-1 rounded ${
            activeTab === "DistributorSales" ? "bg-primary text-white" : "bg-gray1 text-black"
          }`}
        >
          Distributors reports
        </p>
        <p
          onClick={() => setActiveTab("profitsAndLosses")} // New tab for daily shop sales
          className={`px-3 py-1 rounded ${
            activeTab === "profitsAndLosses" ? "bg-primary text-white" : "bg-gray1 text-black"
          }`}
        >
          Profits and losses
        </p>
        
      </div>

      {/* Scrollable Tab Content */}
      <div className="h-[calc(100%-50px)] overflow-y-auto">
        {" "}
        {/* Adjusted height to account for tabs */}
        {activeTab === "store" && <StockReports />}
        {activeTab === "menu" && <ShopReports />}
        {activeTab === "sales" && <SalesReports />}
        {activeTab === "dailyShopSales" && <DailyShopSalesReports />} {/* New component for daily shop sales */}
        {activeTab === "DistributorSales" && <DistributorSalesReports />} {/* New component for daily shop sales */}
        {activeTab === "profitsAndLosses" && <ProfitLossReports/>} {/* New component for daily shop sales */}
      </div>
    </div>
  )
}

export default Reports
