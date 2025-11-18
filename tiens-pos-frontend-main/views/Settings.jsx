import { useState } from "react";
import Users from "./Users";
import PackagesComp from "../components/PackagesComp";
import ShopComp from "../components/ShopComp";
import Customers from "./Customers/Customers";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("user");
  return (
    <div className="w-full bg-white rounded-md shadow p-2">
      <div className="flex gap-2 pt-2 text-sm font-semibold cursor-pointer">
        <p
          onClick={() => setActiveTab("user")}
          className={`px-3 py-1  ${
            activeTab === "user"
              ? "bg-primary text-white"
              : "bg-gray1 text-black"
          }`}
        >
          User
        </p>
        <p
          onClick={() => setActiveTab("packages")}
          className={`px-3 py-1  ${
            activeTab === "packages"
              ? "bg-primary text-white"
              : "bg-gray1 text-black"
          }`}
        >
          Packages
        </p>
        <p
          onClick={() => setActiveTab("distributors")}
          className={`px-3 py-1  ${
            activeTab === "distributors"
              ? "bg-primary text-white"
              : "bg-gray1 text-black"
          }`}
        >
          Distributors
        </p>
        <p
          onClick={() => setActiveTab("shops")}
          className={`px-3 py-1  ${
            activeTab === "shops"
              ? "bg-primary text-white"
              : "bg-gray1 text-black"
          }`}
        >
          Shops
        </p>
      </div>
      {activeTab === "user" && <Users />}
      {activeTab === "packages" && <PackagesComp />}
      {activeTab === "shops" && <ShopComp />}
      {activeTab === "distributors" && <Customers />}
    </div>
  );
};

export default Settings;
