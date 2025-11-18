import React, { useState, useEffect, useCallback } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import ButtonSecondary from "../components/ButtonSecondary";
import ButtonLoader from "../components/ButtonLoader";
import Button2 from "../components/Button2";
import ButtonAlt from "../components/ButtonAlt";
import Select from "react-select";
import { BsSearch, BsPencilSquare } from "react-icons/bs";
import { MdDeleteOutline, MdClear } from "react-icons/md";
import axiosInstance from "../axios-instance";
import Loader from "../components/Loader";
import { useFeedback } from "../hooks/feedback";
import formatNumber from "../utils/formateNumber";
import Category from "../components/Category";
import Swal from "sweetalert2";

const Stock = () => {
  const { toggleFeedback } = useFeedback();

  // Modal states
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);

  // Stock fields
  const [productCode, setProductCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [qty, setQty] = useState(0);
  const [pv, setPv] = useState(0);
  const [bv, setBv] = useState(0);
  const [totalPv, setTotalPv] = useState(0);
  const [totalBv, setTotalBv] = useState(0);
  const [total, setTotal] = useState(0);
  const [stockDate, setStockDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState(null);
  const [halfPrice, setHalfPrice] = useState(false);

  // Loading & feedback states
  const [posting, setPosting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Data states
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [stockId, setStockId] = useState(null);
  const [showHalfPriceOnly, setShowHalfPriceOnly] = useState(false);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const [page, setPage] = useState(1);

  console.log(stocks);
  
  // Calculate totals when price, qty, pv or bv changes
  useEffect(() => {
    setTotal(price * qty);
    setTotalPv(pv * qty);
    setTotalBv(bv * qty);
  }, [price, qty, pv, bv]);

  // Fetch categories once
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch stocks on page change or modal close
  useEffect(() => {
    fetchStocks();
  }, [page, modal, modal2, showHalfPriceOnly]);

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm || selectedCategory || minPrice || maxPrice) {
        handleSearch();
      } else {
        fetchStocks();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, showHalfPriceOnly]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      if (res.status === 200) {
        const options = res.data.payload.map(cat => ({
          value: cat.id,
          label: cat.type,
        }));
        setCategoryOptions(options);
      }
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const endpoint = showHalfPriceOnly ? "/stock/halfprice" : "/stock";
      const res = await axiosInstance.get(endpoint);
      if (res.status === 200) {
        setStocks(res.data.payload);
      }
    } catch (error) {
      console.error("Error fetching stocks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setSearching(true);
      const params = new URLSearchParams();
      
      if (searchTerm.trim()) {
        params.append('searchTerm', searchTerm.trim());
      }
      
      if (selectedCategory) {
        params.append('categoryId', selectedCategory.toString());
      }
      
      if (minPrice) {
        params.append('minPrice', minPrice.toString());
      }
      
      if (maxPrice) {
        params.append('maxPrice', maxPrice.toString());
      }
      
      // Only search within the current view (half-price or regular)
      params.append('halfPrice', showHalfPriceOnly.toString());
      
      console.log('Searching with params:', params.toString());
      
      const res = await axiosInstance.get(`/stock/search?${params.toString()}`);
      if (res.status === 200) {
        console.log('Search results:', res.data.payload);
        setStocks(res.data.payload);
      }
    } catch (error) {
      console.error("Error searching stocks", error);
      toggleFeedback("error", { title: "Search Error", text: "Failed to search stocks." });
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
    fetchStocks();
  };

  const resetForm = () => {
    setProductCode("");
    setName("");
    setDescription("");
    setPrice(0);
    setPurchasePrice(0);
    setQty(0);
    setPv(0);
    setBv(0);
    setTotalPv(0);
    setTotalBv(0);
    setTotal(0);
    setCategoryId(null);
    setStockDate(new Date().toISOString().split("T")[0]);
    setStockId(null);
    setHalfPrice(false);
  };

  const deleteStock = (stock) => {
    console.log("Deleting stock:", stock);

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
          const response = await axiosInstance.delete(`/stock/${stock.id}`);
          const { data } = response;
          if (data.status) {
            // Refresh the current view (search results or regular list)
            if (searchTerm || selectedCategory || minPrice || maxPrice) {
              handleSearch();
            } else {
              fetchStocks();
            }
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: `${stock.name} has been deleted.`,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          console.error("Failed to delete stock", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong!",
          });
        }
      }
    });
  };

  const openAddModal = () => {
    resetForm();
    // Set half price based on current view
    setHalfPrice(showHalfPriceOnly);
    setModal(true);
  };

  const closeAddModal = () => {
    setModal(false);
    resetForm();
  };

  const openEditModal = (stock) => {
    setStockId(stock.id);
    setProductCode(stock.productCode);
    setName(stock.name);
    setDescription(stock.description);
    setPrice(stock.price);
    setPurchasePrice(stock.purchasePrice);
    setQty(stock.qty);
    setPv(stock.pv);
    setBv(stock.bv);
    setTotalPv(stock.totalPv);
    setTotalBv(stock.totalBv);
    setTotal(stock.total);
    setCategoryId(stock.category?.id || null);
    setStockDate(stock.date);
    setHalfPrice(stock.halfPrice || false);
    setModal2(true);
  };

  const closeEditModal = () => {
    setModal2(false);
    resetForm();
  };

  const handlePostStock = async () => {
    if (!productCode || !name || !description || !price || !qty || !pv || !bv || !categoryId || !purchasePrice) {
      return toggleFeedback("error", {
        title: "Missing Fields",
        text: "Please fill all required fields.",
      });
    }
    try {
      setPosting(true);
      const payload = {
        productCode,
        name,
        description,
        price,
        purchasePrice,
        qty,
        pv,
        bv,
        totalPv,
        totalBv,
        total,
        categoryId,
        date: stockDate,
        halfPrice,
      };
      await axiosInstance.post("/stock", payload);
      toggleFeedback("success", { title: "Success", text: "Stock added successfully." });
      closeAddModal();
      // Refresh the appropriate view
      if (searchTerm || selectedCategory || minPrice || maxPrice) {
        handleSearch();
      } else {
        fetchStocks();
      }
    } catch (error) {
      console.error("Error adding stock", error);
      toggleFeedback("error", { title: "Error", text: "Failed to add stock." });
    } finally {
      setPosting(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!stockId) return;
    try {
      setUpdating(true);
      const payload = {
        id: stockId,
        productCode,
        purchasePrice,
        name,
        description,
        price,
        qty,
        pv,
        bv,
        totalPv,
        totalBv,
        total,
        categoryId,
        date: stockDate,
        halfPrice,
      };
      await axiosInstance.put("/stock", payload);
      toggleFeedback("success", { title: "Success", text: "Stock updated successfully." });
      closeEditModal();
      // Refresh the appropriate view
      if (searchTerm || selectedCategory || minPrice || maxPrice) {
        handleSearch();
      } else {
        fetchStocks();
      }
    } catch (error) {
      console.error("Error updating stock", error);
      toggleFeedback("error", { title: "Error", text: "Failed to update stock." });
    } finally {
      setUpdating(false);
    }
  };

  const handleStockTypeToggle = () => {
    setShowHalfPriceOnly(!showHalfPriceOnly);
    // Clear search when switching between views
    setSearchTerm("");
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="w-full bg-white rounded-md shadow p-2">
      {/* Header and Controls */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-secondary">
            {showHalfPriceOnly ? "Half Price Stock" : "Regular Stock"}
          </h2>
          {showHalfPriceOnly && (
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              HP Only
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button2 
            value={showHalfPriceOnly ? "Show Regular Stock" : "Show Half Price Stock"}
            onClick={handleStockTypeToggle}
          />
          <Button2 value="Add Stock" onClick={openAddModal} />
          <Category />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <div className="relative">
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code, name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Select
              placeholder="Filter by category"
              options={categoryOptions}
              value={categoryOptions.find((c) => c.value === selectedCategory) || null}
              onChange={(option) => setSelectedCategory(option?.value || null)}
              isClearable
              className="text-sm"
            />
          </div>

          {/* Price Range */}
          <div>
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {(searchTerm || selectedCategory || minPrice || maxPrice) && (
              <button
                onClick={clearSearch}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Clear search"
              >
                <MdClear className="text-lg" />
              </button>
            )}
          </div>
        </div>
        
        {/* Search Results Info */}
        {(searchTerm || selectedCategory || minPrice || maxPrice) && (
          <div className="mt-3 text-sm text-gray-600">
            {searching ? (
              <span>Searching...</span>
            ) : (
              <span>Found {stocks.length} result(s)</span>
            )}
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-3/12" onClick={closeAddModal}></div>
          <div className="bg-white rounded-lg w-[900px]">
            <div className="rounded-lg bg-white mt-[2vh]">
              <div className="flex text-xl justify-between font-semibold text-primary p-2 bg-gray1">
                <p>Add {showHalfPriceOnly ? "Half Price" : "Regular"} Stock</p>
                <p onClick={closeAddModal} className="cursor-pointer">
                  X
                </p>
              </div>

              <div className="flex h-[75vh] overflow-y-auto">
                {/* LEFT COLUMN */}
                <div className="w-1/2 p-3 -mt-5">
                  {/* Half Price Checkbox - Top Priority */}
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={halfPrice}
                        onChange={(e) => setHalfPrice(e.target.checked)}
                        className="mr-3 w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-lg font-semibold text-orange-700">
                        Half Price Stock
                      </span>
                    </label>
                    {showHalfPriceOnly && (
                      <p className="text-sm text-orange-600 mt-1">
                        Currently viewing Half Price Stock - this will be marked as HP
                      </p>
                    )}
                  </div>

                  <InputField
                    label="Product Name *"
                    placeholder="Enter Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg"
                  />
                  <InputField
                    label="Product Code *"
                    placeholder="Enter Product Code"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                  />
                  <InputField
                    label="Description *"
                    value={description}
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <InputField
                        label="Purchase Price"
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-1/2">
                      <InputField
                        label="Selling Price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <InputField
                        label="Qty *"
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-1/3">
                      <InputField
                        label="PV *"
                        type="number"
                        value={pv}
                        onChange={(e) => setPv(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-1/3">
                      <InputField
                        label="BV *"
                        type="number"
                        value={bv}
                        onChange={(e) => setBv(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-1/2 p-3 -mt-5">
                  <div className="space-y-3 mt-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm font-semibold text-blue-700">Total PV: {formatNumber(totalPv)}</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm font-semibold text-green-700">Total BV: {formatNumber(totalBv)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="text-sm font-semibold text-gray-700">Total Price: UGX {formatNumber(total)}</p>
                    </div>
                  </div>
                  
                  <br />
                  <label className="text-gray5 font-semibold">Stock Date *</label>
                  <input
                    type="date"
                    value={stockDate}
                    onChange={(e) => setStockDate(e.target.value)}
                    className="w-full mt-2 border border-gray-300 rounded px-3 py-3 text-lg"
                  />
                  <br />
                  <br />
                  <label className="text-gray5 font-semibold">Category *</label>
                  <Select
                    className="w-full mt-2"
                    placeholder="Select Category"
                    options={categoryOptions}
                    value={categoryOptions.find((c) => c.value === categoryId) || null}
                    onChange={(e) => setCategoryId(e.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between text-primary p-2 bg-gray1">
                <div onClick={closeAddModal}>
                  <ButtonSecondary value="Close" />
                </div>
                <div className="w-36">
                  {posting ? (
                    <ButtonLoader />
                  ) : (
                    <div onClick={handlePostStock}>
                      <Button value="Add Stock" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/12" onClick={closeAddModal}></div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {modal2 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-3/12" onClick={closeEditModal}></div>
          <div className="bg-white rounded-lg w-[900px]">
            <div className="rounded-lg bg-white mt-[2vh]">
              <div className="flex text-xl justify-between font-semibold text-primary p-2 bg-gray1">
                <p>Edit Stock</p>
                <p onClick={closeEditModal} className="cursor-pointer">
                  X
                </p>
              </div>

              <div className="flex h-[75vh] overflow-y-auto">
                {/* LEFT COLUMN */}
                <div className="w-1/2 p-3 -mt-5">
                  {/* Half Price Checkbox - Top Priority */}
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={halfPrice}
                        onChange={(e) => setHalfPrice(e.target.checked)}
                        className="mr-3 w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-lg font-semibold text-orange-700">
                        Half Price Stock
                      </span>
                    </label>
                  </div>

                  <InputField
                    label="Product Name *"
                    placeholder="Enter Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg"
                  />
                  <InputField
                    label="Product Code *"
                    placeholder="Enter Product Code"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                  />
                  <InputField
                    label="Description *"
                    value={description}
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <InputField
                        label="Purchase Price"
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-1/2">
                      <InputField
                        label="Selling Price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <InputField
                        label="Qty *"
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-1/3">
                      <InputField
                        label="PV *"
                        type="number"
                        value={pv}
                        onChange={(e) => setPv(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-1/3">
                      <InputField
                        label="BV *"
                        type="number"
                        value={bv}
                        onChange={(e) => setBv(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-1/2 p-3 -mt-5">
                  <div className="space-y-3 mt-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm font-semibold text-blue-700">Total PV: {formatNumber(totalPv)}</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm font-semibold text-green-700">Total BV: {formatNumber(totalBv)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="text-sm font-semibold text-gray-700">Total Price: UGX {formatNumber(total)}</p>
                    </div>
                  </div>
                  
                  <br />
                  <label className="text-gray5 font-semibold">Stock Date *</label>
                  <input
                    type="date"
                    value={stockDate}
                    onChange={(e) => setStockDate(e.target.value)}
                    className="w-full mt-2 border border-gray-300 rounded px-3 py-3 text-lg"
                  />
                  <br />
                  <br />
                  <label className="text-gray5 font-semibold">Category *</label>
                  <Select
                    className="w-full mt-2"
                    placeholder="Select Category"
                    options={categoryOptions}
                    value={categoryOptions.find((c) => c.value === categoryId) || null}
                    onChange={(e) => setCategoryId(e.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between text-primary p-2 bg-gray1">
                <div onClick={closeEditModal}>
                  <ButtonSecondary value="Close" />
                </div>
                <div className="w-36">
                  {updating ? (
                    <ButtonLoader />
                  ) : (
                    <div onClick={handleUpdateStock}>
                      <Button value="Update Stock" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/12" onClick={closeEditModal}></div>
        </div>
      )}

      {/* Stock List */}
      <div>
        {/* Table Headers */}
        <div className="bg-gray1 grid grid-cols-12 border-b text-sm font-semibold text-black">
          {/* {!showHalfPriceOnly && <div className="p-2">Half Price</div>} */}
          <div className={`p-2 col-span-3`}>Name</div>
          <div className="p-2">Code</div>
          <div className="p-2">P.Price</div>
          <div className="p-2">S.Price</div>
          <div className="p-2">Qty</div>
          <div className="p-2">PV</div>
          <div className="p-2">T.PV</div>
          <div className="p-2">BV</div>
          <div className="p-2">T.BV</div>
          <div className="p-2">Actions</div>
        </div>

        {/* Table Content */}
        <div className="h-[calc(100vh-320px)] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader />
            </div>
          ) : stocks.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <div className="text-center">
                <p className="text-lg">No {showHalfPriceOnly ? 'half-price' : 'regular'} stock found</p>
                {(searchTerm || selectedCategory || minPrice || maxPrice) && (
                  <p className="text-sm mt-2">Try adjusting your search criteria</p>
                )}
              </div>
            </div>
          ) : (
            stocks.map((stock) => (
              <div
                key={stock.id}
                className="shadow-sm grid grid-cols-12 border-b border-gray1 cursor-pointer hover:shadow-md"
              >

                <div className={`text-sm p-3 text-gray5 col-span-3 font-medium`}>
                  {stock?.name || "-"}
                </div>
                <div className="text-sm p-3 text-gray5">{stock?.productCode || "-"}</div>
                <div className="text-sm p-3 text-gray5">{formatNumber(stock?.purchasePrice) || 0}</div>
                <div className="text-sm p-3 text-gray5">{formatNumber(stock?.price) || 0}</div>
                <div className="text-sm p-3 text-gray5">{stock?.qty || 0}</div>
                <div className="text-sm p-3 text-gray5">{formatNumber(stock?.pv) || 0}</div>
                <div className="text-sm p-3 text-gray5">{formatNumber(stock?.pv * stock?.qty) || 0}</div>
                <div className="text-sm p-3 text-gray5">{formatNumber(stock?.bv) || 0}</div>
                <div className="text-sm p-3 text-gray5">{formatNumber(stock?.bv * stock?.qty) || 0}</div>
                <div className="text-sm flex items-center justify-center gap-3 p-3">
                  <BsPencilSquare
                    onClick={() => openEditModal(stock)}
                    className="text-xl cursor-pointer hover:text-primary transition-colors"
                  />
                  <MdDeleteOutline
                    onClick={() => deleteStock(stock)}
                    className="text-xl cursor-pointer hover:text-red-500 transition-colors"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Stock;