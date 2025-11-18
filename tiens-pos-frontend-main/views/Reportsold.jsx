import React, { useState, useEffect, useRef } from "react";
import InputField from "../components/InputField";
import Button2 from "../components/Button2";
import Button from "../components/Button";
import { BsSearch, BsTrash } from "react-icons/bs";
import ButtonAlt from "../components/ButtonAlt";
import ReStock from "../components/ReStock";
import { useDispatch, useSelector } from "react-redux";
import { getSales } from "../store/slices/store";
import axiosInstance from "../axios-instance";
import { useFeedback } from "../hooks/feedback";
import { usePrint } from "../hooks/print";
import Swal from "sweetalert2";

const Reports = () => {
  const dispatch = useDispatch();
  const { sales, loading } = useSelector((state) => state.autocountStore);
  const [filteredSales, setFilteredSales] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const { toggleFeedback } = useFeedback();
  const { printContent } = usePrint();
  const [page, setPage] = useState(1);
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    dispatch(getSales(page));
  }, [dispatch, page]);

  useEffect(() => {
    setFilteredSales(sales);
    setIsSearched(false);
  }, [sales]);

  async function searchSales() {
    try {
      setSearchLoading(true);
      const response = await axiosInstance.get(
        "/sales/search?search=" +
          search +
          "&startDate=" +
          startDate +
          "&endDate=" +
          endDate
      );
      const { status, payload } = response.data;
      if (status) {
        setFilteredSales(payload);
        setIsSearched(true);
      }
    } catch (error) {
      toggleFeedback("error", {
        title: "Error",
        text: error.message,
      });
    }
    setSearchLoading(false);
  }

  const deleteSale = (sale) => {
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
          let formData = {
            sale: sale.stock?.name,
          };
          const response = await axiosInstance.post(
            `/sales/${sale.id}`,
            formData
          );
          const { data } = response;
          const { status } = data;
          dispatch(getSales(page));
          if (status) {
            dispatch(getSales(page));
            Swal.fire({
              icon: "success",
              showConfirmButton: false,
              timer: 500,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="w-full bg-white rounded-md shadow p-2">
      <div className="flex w-full justify-between">
        <div>
          <div className="flex gap-2 mt-2">
            <p className=" font-semibold text-sm px-2 py-1 bg-gray2">Stock</p>
            <p className=" font-semibold text-sm px-2 py-1 bg-gray2">Shop Stock</p>
            <p className=" font-semibold text-sm px-2 py-1 bg-gray2">Sales</p>
            <h1 className="text-secondary font-semibold py-1 text-sm px-2 bg-gray2">
              Loans
            </h1>
          </div>
        </div>

        <div className="w-4/12 ">
          <InputField
            type="text"
            placeholder="Search For Sale..."
            name="lastName"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="flex mt-5">
          <div className="-mt-5">
            <InputField
              type="date"
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              placeholder={"Start Date"}
            />
          </div>
          <div className="-mt-5 mx-3">
            <InputField
              type="date"
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              placeholder={"End Date"}
            />
          </div>
          <div className="ml-2">
            {searchLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            ) : (
              <Button
                value={"Search"}
                onClick={() => {
                  searchSales();
                }}
              />
            )}
          </div>
          <div className="ml-2">
            <ReStock />
          </div>
          <div className="ml-2">
            <ButtonAlt
              value={"Print"}
              onClick={() => {
                printContent("sales-report");
              }}
            />
          </div>
        </div>
      </div>
      <div className="" id="sales-report">
        <div className="font-bold text-sm flex w-full border-b">
          <div className="p-3 w-2/12">Date</div>
          <div className="p-3 w-2/12">Product</div>
          <div className="p-3 w-2/12">Qty</div>
          <div className="py-3 w-2/12">Cost</div>
          <div className="py-3 w-2/12">Sale</div>
          <div className="py-3 w-2/12">Profit</div>
          <div className="py-3 w-2/12">#</div>
        </div>
        <div className="h-[calc(100vh-250px)] overflow-y-auto">
          {loading.sales && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {filteredSales?.map((sale) => {
            return (
              <div
                className="shadow-sm flex border-l border-gray1 cursor-pointer hover:shadow-md hover:border-l-primary hover:border-l-2  pl-2"
                key={sale.id}
              >
                <div className="py-3 w-2/12 text-xs text-gray5  ">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </div>
                <div className="py-3 text-xs text-gray5 w-2/12">
                  {sale.stock?.name}
                </div>
                <div className="py-3 text-xs text-gray5 w-2/12">
                  {sale.quantity}
                </div>
                <div className="py-3 text-xs text-gray5 w-2/12">
                  {(sale.stock?.unitCost * sale.quantity).toLocaleString()}
                </div>
                <div className="py-3 text-xs text-gray5 w-2/12">
                  {(sale.stock?.unitSell * sale.quantity).toLocaleString()}
                </div>
                <div className="py-3 text-xs text-gray5 w-2/12">
                  {(
                    sale.stock?.unitSell * sale.quantity -
                    sale.stock?.unitCost * sale.quantity
                  ).toLocaleString()}
                </div>
                <div className="py-3 text-xs text-gray5 w-2/12">
                  <BsTrash
                    onClick={() => deleteSale(sale)}
                    className="text-red"
                  />
                </div>
              </div>
            );
          })}

          {filteredSales.length === 0 && !loading.sales && (
            <div className="flex justify-center items-center h-full">
              <p className="text-xl font-semibold text-gray5">No Sales Found</p>
            </div>
          )}

          {/* Load more */}
          <div className="flex justify-center items-center">
            {filteredSales.length > 0 &&
              !loading.sales &&
              filteredSales.length % 10 === 0 && (
                <span
                  className="text-primary cursor-pointer underline"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  Next
                </span>
              )}
          </div>
        </div>
        <div>
          <div className="font-medium flex w-full bg-secondary text-white">
            <div className="p-3 w-2/12">Total</div>
            <div className="p-3 w-2/12"></div>
            <div className="p-3 w-2/12"></div>
            <div className="py-3 w-2/12">
              {filteredSales
                .reduce((a, b) => {
                  return a + b.stock.unitCost * b.quantity;
                }, 0)
                .toLocaleString()}
            </div>
            <div className="py-3 w-2/12">
              {filteredSales
                .reduce((a, b) => {
                  return a + b.stock.unitSell * b.quantity;
                }, 0)
                .toLocaleString()}
            </div>
            <div className="py-3 w-2/12">
              {filteredSales
                .reduce((a, b) => {
                  return (
                    a +
                    (b.stock.unitSell * b.quantity -
                      b.stock.unitCost * b.quantity)
                  );
                }, 0)
                .toLocaleString()}
            </div>
            <div className="py-3 w-2/12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
