import { useState, useEffect, useMemo } from "react";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import axiosInstance from "../../axios-instance";
import Loader from "../../components/Loader";
import PrintFunc from "../../hooks/print";
import Select from "react-select";

const StockReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { handlePrint, printRef } = PrintFunc();

  const fetchStock = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/stock");
      setStock(data);
    } catch (error) {
      console.error("Error fetching stockm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);



  return (
    <div>
      <div className="flex w-full -mt-8 justify-between">
        <div className="w-[400px] mt-5">
          <h1 className="text-secondary font-semibold text-xl mt-5">
            Stock Report
          </h1>
        </div>

        <div className="w-[300px]">
          <InputField type="text" placeholder="Search For Sale..." />
        </div>

        <div className="flex">
          <div className="">
            <InputField
              type="date"
              placeholder="Start Date"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="mx-3">
            <InputField
              type="date"
              placeholder="End Date"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Button value="Print" onClick={handlePrint} />
          </div>
          
        </div>
      </div>

      <div className="h-[calc(100vh-180px)] p-2 overflow-y-auto" ref={printRef}>
        {/* Header */}
        <div className="font-medium text-sm flex w-full border-b text-black">
          {[
            "Date",
            "Product",
            "Qty",
            "Reduced By",
            "Cost",
            "Sale",
            "Profit",
            "Category",
            "Sub Category",
          ].map((title, idx) => (
            <div key={idx} className="p-3 w-2/12">
              {title}
            </div>
          ))}
        </div>

        {/* Loader */}
        {loading && <Loader />}

        {/* Rows */}
        {!loading &&
          filteredStock.map((item) => (
            <div
              key={item.id}
              className="shadow-sm flex border-l border-gray1 cursor-pointer hover:shadow-md hover:border-l-primary hover:border-l-2 pl-2"
            >
              <div className="py-3 w-2/12 text-xs text-gray5">{item.date}</div>
              <div className="py-3 text-xs text-gray5 w-2/12">{item.name}</div>
              <div className="py-3 text-xs text-gray5 w-2/12">
                {Number(item.qty).toLocaleString()}
              </div>
              <div className="py-3 text-xs text-gray5 w-2/12">
                {Number(item.reduced_by).toLocaleString()}
              </div>
              <div className="py-3 text-xs text-gray5 w-2/12">
                {Number(item.cost).toLocaleString()}
              </div>
              <div className="py-3 text-xs text-gray5 w-2/12">
                {Number(item.sale).toLocaleString()}
              </div>
              <div className="py-3 text-xs text-gray5 w-2/12">
                {Number(item.profit).toLocaleString()}
              </div>
              <div className="py-3 text-xs text-gray5 w-2/12">{item?.category?.type}</div>
              <div className="py-3 text-xs text-gray5 w-2/12">{item?.subCategory?.subcategory}</div>
            </div>
          ))}

        {/* Empty State */}
        {!loading && filteredStock.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-xl font-semibold text-gray5">No Stock Found</p>
          </div>
        )}

        {/* Totals */}
        <div className="font-medium flex w-full bg-secondary text-white">
          <div className="p-3 w-2/12">Total</div>
          <div className="p-3 w-2/12" />
          {["qty", "reduced_by", "cost", "sale", "profit"].map((key, idx) => (
            <div key={idx} className="py-3 w-2/12">
              {getTotal(key)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockReports;
