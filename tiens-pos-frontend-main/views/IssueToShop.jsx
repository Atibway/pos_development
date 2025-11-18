import { useState, useEffect } from "react"
import InputField from "../components/InputField"
import { BsPlus, BsSearch } from "react-icons/bs"
import { TbMinus } from "react-icons/tb"
import Select from "react-select"
import { useDispatch, useSelector } from "react-redux"
import { getCustomers, getStock } from "../store/slices/store"
import axiosInstance from "../axios-instance"
import { useFeedback } from "../hooks/feedback"
import Button2 from "../components/Button2"
import Button from "../components/Button"

const IssueToShop = () => {
  const dispatch = useDispatch()
  const { stock, customers, loading, allStock } = useSelector((state) => state.autocountStore)

  const { toggleFeedback } = useFeedback()

  const [cart, setCart] = useState([])
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [filteredStock, setFilteredStock] = useState([])
  const [loadingAssign, setLoadingAssign] = useState(false)
  const [showHalfPriceOnly, setShowHalfPriceOnly] = useState(false)
  const [halfPriceStock, setHalfPriceStock] = useState([])

  useEffect(() => {
    dispatch(getCustomers())
    dispatch(getStock(page))
  }, [dispatch, page])

  useEffect(() => {
    // Determine which stock array to use and filter based on half-price toggle
    let stockToFilter = []
    
    if (showHalfPriceOnly) {
      // Show only half-price products
      stockToFilter = halfPriceStock
    } else {
      // Show only NON-half-price products (regular products)
      stockToFilter = stock.filter((item) => !item.halfPrice)
    }
    
    // Filter out items with 0 quantity before displaying
    const availableStock = stockToFilter.filter((item) => item.qty > 0)
    
    if (search === "") {
      setFilteredStock(availableStock)
    } else {
      const filtered = availableStock.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      setFilteredStock(filtered)
    }
  }, [search, stock, halfPriceStock, showHalfPriceOnly])

  useEffect(() => {
    async function fetchShops() {
      try {
        const res = await axiosInstance.get("/shops")
        const data = Array.isArray(res.data) ? res.data : res.data.payload || []
        setShops(data)
      } catch (error) {
        toggleFeedback("error", {
          title: "Error",
          text: "Failed to fetch shops",
        })
      }
    }

    fetchShops()
  }, [])

  // Fetch half-price stock
  const fetchHalfPriceStock = async () => {
    try {
      const res = await axiosInstance.get("/stock/halfprice")
      if (res.status === 200) {
        setHalfPriceStock(res.data.payload || [])
      }
    } catch (error) {
      console.error("Error fetching half-price stock", error)
      toggleFeedback("error", {
        title: "Error",
        text: "Failed to fetch half-price stock",
      })
    }
  }

  // Fetch half-price stock when component mounts or when showHalfPriceOnly changes
  useEffect(() => {
    if (showHalfPriceOnly) {
      fetchHalfPriceStock()
    }
  }, [showHalfPriceOnly])

  const handleSelectShop = (shop) => {
    setSelectedShop(shop)
    localStorage.setItem("selectedShop", JSON.stringify(shop))
  }

  const addItemToCart = (item) => {
    const exists = cart.find((cartItem) => cartItem.id === item.id)

    // Don't exceed stock quantity
    if (exists && exists.quantity >= item.qty) return

    const updated = exists
      ? cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem))
      : [...cart, { ...item, quantity: 1 }]
    setCart(updated)
  }

  const decreaseItemqty = (item) => {
    const exists = cart.find((cartItem) => cartItem.id === item.id)
    if (exists?.quantity > 1) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem)),
      )
    } else {
      removeItemFromCart(item)
    }
  }

  const removeItemFromCart = (item) => {
    setCart(cart.filter((cartItem) => cartItem.id !== item.id))
  }

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const assignToShop = async () => {
    if (!selectedShop || !selectedShop.id || isNaN(Number(selectedShop.id))) {
      return toggleFeedback("error", {
        title: "Invalid Shop",
        text: "Please select a valid shop before assigning.",
      })
    }

    if (cart.length === 0) {
      return toggleFeedback("error", {
        title: "Empty Cart",
        text: "Please add items to assign.",
      })
    }

    try {
      setLoadingAssign(true)

      const stockItems = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }))

      const res = await axiosInstance.post("/shops/assign-stocks", {
        shopId: Number(selectedShop.id),
        stockItems,
      })

      const { status, payload } = res.data

      if (status) {
        toggleFeedback("success", {
          title: "Success",
          text: "Stock assigned successfully.",
        })
        setCart([])
        // Refresh stock data
        dispatch(getStock(page))
        if (showHalfPriceOnly) {
          fetchHalfPriceStock()
        }
      } else {
        toggleFeedback("error", {
          title: "Assignment Failed",
          text: payload || "Something went wrong during assignment.",
        })
      }
    } catch (error) {
      toggleFeedback("error", {
        title: "Server Error",
        text: error.response?.data?.message || error.message || "An unknown error occurred.",
      })
    } finally {
      setLoadingAssign(false)
    }
  }

  console.log(cart)

  const totalPV = cart.reduce((sum, item) => sum + (item.pv || 0) * item.quantity, 0)
  const totalBV = cart.reduce((sum, item) => sum + (item.bv || 0) * item.quantity, 0)
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex w-full">
      {/* Left Panel - Stock */}
      <div className="w-[40%] rounded-md shadow bg-white h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="w-full flex justify-between items-center p-3">
          <h1 className="text-secondary font-semibold text-xl">
            {showHalfPriceOnly ? "Half Price Products" : "Regular Products"}
          </h1>
          <div className="flex items-center gap-2">
            <Button 
              value={showHalfPriceOnly ? "Show Regular" : "Show Half Price"}
              onClick={() => setShowHalfPriceOnly(!showHalfPriceOnly)}
            />
            <div className="w-64">
              <InputField
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<BsSearch className="w-3 -ml-7 mt-3" />}
              />
            </div>
          </div>
        </div>

        {filteredStock.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              addItemToCart({
                ...item,
                date: new Date().toISOString().slice(0, 10),
                stockId: item.id,
              })
            }
            className={`flex border cursor-pointer border-gray2 m-2 rounded-md p-2 hover:bg-gray1 justify-between ${
              item.halfPrice ? 'bg-orange-50 border-orange-200' : ''
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{item.name}</p>
                {item.halfPrice && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                    HP
                  </span>
                )}
              </div>
              <p className="text-sm text-gray5">{item.category?.type}</p>
              <p className="text-xs text-gray-600">Price: {item.price?.toLocaleString()} UGX</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{item.qty.toLocaleString()}</p>
              <p className="text-xs text-gray5">Available</p>
            </div>
          </div>
        ))}

        {/* <div className="flex justify-center mb-2">
          {loading.stock ? (
            <div className="bg-primary p-2 rounded-md text-white cursor-pointer">Loading...</div>
          ) : stock.length === allStock.length ? null : (
            <div onClick={() => setPage(page + 1)} className="bg-primary p-2 rounded-md text-white cursor-pointer">
              Next
            </div>
          )}
        </div> */}
      </div>

      {/* Right Panel - Cart & Shop */}
      <div className="w-[60%] rounded-md shadow bg-white ml-2">
        <div className="w-1/2 p-2">
          <Select
            className="w-full"
            placeholder="Select Shop"
            options={
              Array.isArray(shops)
                ? shops.map((shop) => ({
                    label: shop.name,
                    value: shop.id,
                    ...shop,
                  }))
                : []
            }
            onChange={handleSelectShop}
          />
        </div>

        <div className="px-2">
          <div className="grid grid-cols-12 gap-2 p-2 font-semibold bg-gray2 text-sm rounded-md">
            <div className="col-span-3">Product</div>
            <div className="col-span-1 text-right">Price</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-1 text-right">PV</div>
            <div className="col-span-1 text-right">Total PV</div>
            <div className="col-span-1 text-right">BV</div>
            <div className="col-span-1 text-right">Total BV</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
        </div>

        <div className="h-[calc(100vh-300px)] overflow-y-auto px-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className={`m-2 cursor-pointer p-2 rounded-md grid grid-cols-12 gap-2 items-center ${
                item.halfPrice ? 'bg-orange-50 border border-orange-200' : 'bg-gray1'
              }`}
            >
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  {item.halfPrice && (
                    <span className="bg-orange-100 text-orange-800 px-1 py-0.5 rounded text-xs font-semibold">
                      HP
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-1 text-right text-sm">{item.price.toLocaleString()}</div>

              <div className="col-span-1 text-right text-sm">{(item.price * item.quantity).toLocaleString()}</div>

              <div className="col-span-1 text-right text-sm text-blue-600">{item.pv || 0}</div>

              <div className="col-span-1 text-right text-sm text-blue-600">
                {(item.pv * item.quantity).toLocaleString()}
              </div>

              <div className="col-span-1 text-right text-sm text-green-600">{item.bv || 0}</div>

              <div className="col-span-1 text-right text-sm text-green-600">
                {(item.bv * item.quantity).toLocaleString()}
              </div>

              <div className="col-span-3 flex items-center justify-end gap-2">
                <div onClick={() => decreaseItemqty(item)} className="p-1 rounded-full bg-primary cursor-pointer">
                  <TbMinus className="text-white text-lg" />
                </div>
                <p className="text-sm">{item.quantity}</p>
                <div
                  title={item.quantity >= item.qty ? "No more stock available" : ""}
                  onClick={() => {
                    if (item.quantity < item.qty) addItemToCart(item)
                  }}
                  className={`p-1 rounded-full ${
                    item.quantity < item.qty ? "bg-primary cursor-pointer" : "bg-gray3 cursor-not-allowed"
                  }`}
                >
                  <BsPlus className="text-white text-lg" />
                </div>
                <p onClick={() => removeItemFromCart(item)} className="text-red text-xl ml-2 cursor-pointer">
                  ×
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center p-3 bg-primary text-white text-sm">
          <div onClick={assignToShop} className="bg-black rounded-md p-2 cursor-pointer">
            {loadingAssign ? "Assigning..." : "Assign To Shop"}
          </div>
          <div className="space-x-4 text-right">
            <span>Total Qty: {totalQty}</span>
            <span>Total PV: {totalPV}</span>
            <span>Total BV: {totalBV}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueToShop
