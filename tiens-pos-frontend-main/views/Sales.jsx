"use client"

import { useState, useEffect } from "react"
import InputField from "../components/InputField"
import { BsPlus, BsSearch } from "react-icons/bs"
import { TbMinus } from "react-icons/tb"
import Select from "react-select"
import { useDispatch, useSelector } from "react-redux"
import { getCustomers } from "../store/slices/store"
import axiosInstance from "../axios-instance"
import { useFeedback } from "../hooks/feedback"
import PrintFunc from "../hooks/print"
import Receipt from "../components/Receipt"

const Sales = () => {
  const dispatch = useDispatch()
  const { customers } = useSelector((state) => state.autocountStore)
  const [generatedInvoice, setGeneratedInvoice] = useState(null)
  const [paymentMode, setPaymentMode] = useState("")

  const { handlePrint, printRef: invoiceRef } = PrintFunc()

  const [shops, setShops] = useState([])
  const [cart, setCart] = useState([])
  const [customerOptions, setCustomerOptions] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [paymentDate, setPaymentDate] = useState("")
  const [search, setSearch] = useState("")
  const [makeSaleLoading, setMakeSaleLoading] = useState(false)
  const { toggleFeedback } = useFeedback()
  const [operator, setOperator] = useState(null)

  // Client type state
  const [clientType, setClientType] = useState("Member")
  const [customPrices, setCustomPrices] = useState({})

  // Client type options
  const clientTypeOptions = [
    { value: "Member", label: "Member" },
    { value: "Non-Member", label: "Non-Member" },
    { value: "Working Client", label: "Working Client" },
  ]

  const fetchShops = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("schoolSoftUser"))
      if (!user) throw new Error("User not logged in")
      setOperator(user)

      const res = await axiosInstance.get(`/shops/${user.id}`)
      const data = Array.isArray(res.data) ? res.data : res.data.payload || []

      setShops(data)
    } catch (error) {
      console.log("failed to fetch shop", error)
    }
  }

  useEffect(() => {
    fetchShops()
    dispatch(getCustomers())
  }, [dispatch])

  useEffect(() => {
    const options = customers.map((c) => ({
      value: c.id,
      label: c.name,
      ...c,
    }))
    setCustomerOptions(options)
  }, [customers])

  // Calculate default price based on client type
  const calculateDefaultPrice = (basePrice, clientType) => {
    switch (clientType) {
      case "Member":
        return basePrice // Fixed member price from stock
      case "Non-Member":
      case "Working Client":
        return 0 // Start with 0, allow manual input
      default:
        return basePrice
    }
  }

  // Get effective price for an item
  const getEffectivePrice = (item) => {
    if (clientType === "Member") {
      return item.price // Fixed member price - not editable
    }

    // For all other client types, use custom price if set
    const customPrice = customPrices[item.id]
    if (customPrice !== undefined && customPrice !== null && customPrice !== "") {
      return Number.parseFloat(customPrice) || 0
    }

    // Return default calculated price
    return calculateDefaultPrice(item.price, clientType)
  }

  // Handle custom price change
  const handleCustomPriceChange = (itemId, newPrice) => {
    setCustomPrices((prev) => ({
      ...prev,
      [itemId]: newPrice,
    }))
  }

  const addItemToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id)
    const effectivePrice = getEffectivePrice(item)

    if (existing) {
      if (existing.quantity < item.qty) {
        setCart(
          cart.map((c) =>
            c.id === item.id
              ? {
                  ...c,
                  quantity: c.quantity + 1,
                  unitSell: effectivePrice,
                  clientType: clientType,
                }
              : c,
          ),
        )
      }
    } else {
      setCart([
        ...cart,
        {
          id: item.id,
          code: item.code || 0,
          name: item.name,
          description: item.description,
          qty: item.qty,
          price: item.price, // Original member price
          unitSell: effectivePrice, // Effective selling price
          shopId: item.shopId,
          pv: item.pv,
          bv: item.bv,
          quantity: 1,
          clientType: clientType,
          date: new Date().toISOString().slice(0, 10),
        },
      ])
    }
  }

  const decreaseItemQty = (item) => {
    const existing = cart.find((c) => c.id === item.id)
    if (!existing) return

    if (existing.quantity > 1) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity - 1 } : c)))
    } else {
      removeItemFromCart(item)
    }
  }

  const removeItemFromCart = (item) => {
    setCart(cart.filter((c) => c.id !== item.id))
    // Remove custom price when item is removed
    setCustomPrices((prev) => {
      const newPrices = { ...prev }
      delete newPrices[item.id]
      return newPrices
    })
  }

  // Update cart prices when client type changes
  useEffect(() => {
    if (cart.length > 0) {
      setCart((prevCart) =>
        prevCart.map((item) => ({
          ...item,
          unitSell: getEffectivePrice(item),
          clientType: clientType,
        })),
      )
    }
    // Clear custom prices when client type changes
    setCustomPrices({})
  }, [clientType])

  // Automated calculations - ALL sales get full PV/BV from stock
  const calculateTotals = () => {
    const totalAmount = cart.reduce((total, item) => total + item.unitSell * item.quantity, 0)
    const totalPV = cart.reduce((sum, item) => sum + (item.pv || 0) * item.quantity, 0)
    const totalBV = cart.reduce((sum, item) => sum + (item.bv || 0) * item.quantity, 0)
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)

    return { totalAmount, totalPV, totalBV, totalQty }
  }

  const { totalAmount, totalPV, totalBV, totalQty } = calculateTotals()

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (generatedInvoice) {
      setTimeout(() => {
        handlePrint()
      }, 500)
    }
    const handleAfterPrint = () => {
      setGeneratedInvoice(null)
    }
    window.addEventListener("afterprint", handleAfterPrint)
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint)
    }
  }, [generatedInvoice])

  // Generate serial number
  const generateSerialNumber = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const day = now.getDate().toString().padStart(2, "0")
    const time = now.getTime().toString().slice(-4)
    return `${year}${month}${day}${time}`
  }

  const makeSale = async () => {
    if (cart.length === 0) {
      toggleFeedback("error", {
        title: "Error",
        text: "Please add items to the cart",
      })
      return
    }

    // Validate that all non-member client types have prices set
    if (clientType !== "Member") {
      const itemsWithoutPrice = cart.filter((item) => !item.unitSell || item.unitSell <= 0)
      if (itemsWithoutPrice.length > 0) {
        toggleFeedback("error", {
          title: "Error",
          text: `Please set prices for all items. Missing prices for: ${itemsWithoutPrice.map((item) => item.name).join(", ")}`,
        })
        return
      }
    }

    setMakeSaleLoading(true)

    try {
      const payload = {
        sales: cart.map(({ id, quantity, date, shopId, unitSell, clientType }) => ({
          stockId: id,
          quantity,
          date: date || new Date().toISOString().slice(0, 10),
          shopId,
          unitPrice: unitSell, // Include the effective selling price
          clientType: clientType, // Include client type
        })),
        customerId: selectedCustomer?.value || null,
        paymentDate: paymentDate || null,
        loan: !!(selectedCustomer && paymentDate),
        shopId: shops[0]?.id || null,
        clientType: clientType, // Include client type in main payload
      }

      console.log("PAYLOAD TO BACKEND ➤", payload)

      const res = await axiosInstance.post("/sales", payload)

      if (res?.data?.status) {
        const saleInfo = {
          items: cart,
          customer: selectedCustomer,
          paymentMode,
          paymentDate,
          clientType,
          totalPV: totalPV,
          totalBV: totalBV,
          date: new Date().toISOString(),
          shop: shops.find((s) => s.id === payload.shopId),
          total: totalAmount,
          paid: selectedCustomer && paymentDate ? 0 : totalAmount,
          balance: selectedCustomer && paymentDate ? totalAmount : 0,
          invoiceNumber: `INV-${Date.now()}`,
          serialNumber: generateSerialNumber(),
        }

        setGeneratedInvoice(saleInfo)

        // Reset fields
        setCart([])
        setSelectedCustomer(null)
        setPaymentDate("")
        setCustomPrices({})
      } else {
        toggleFeedback("error", {
          title: "Error",
          text: res?.data?.payload || "Unexpected server response",
        })
      }
    } catch (error) {
      toggleFeedback("error", {
        title: "Error",
        text: error?.response?.data?.payload || error.message,
      })
    } finally {
      setMakeSaleLoading(false)
    }
  }

  return (
    <div className="flex w-full h-full">
      <div className="w-[40%] rounded-md shadow bg-white h-[calc(100vh-6rem)] overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-secondary font-semibold text-xl">Regular Sales</h1>
          {/* <div className="w-72">
            <InputField
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<BsSearch className="w-3 -ml-7 mt-3 cursor-pointer" />}
            />
          </div> */}
        </div>

        {shops.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No shops issued to your user account.</p>
        ) : (
          shops
            .filter((shop) => shop.name.toLowerCase().includes(search.toLowerCase()))
            .map((shop) => (
              <div key={shop.id} className="m-2 border rounded-md p-3 bg-gray-50 border-gray1 shadow-sm">
                <div>
                  <p className="font-semibold text-lg text-primary">{shop.name}</p>
                  <p className="text-sm text-gray5">{shop.location}</p>
                </div>

                <div className="mt-3 space-y-2">
                  {(shop.issuedStocks || []).length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No stocks issued for this shop.</p>
                  ) : (
                    shop.issuedStocks
                      .filter(
                        (item) =>
                          item.qty > 0 && // Filter out items with 0 quantity
                          !item.halfPrice && // Show only NON-half-price products
                          (search === "" ||
                            item.name.toLowerCase().includes(search.toLowerCase()) ||
                            (item.productCode && item.productCode.toLowerCase().includes(search.toLowerCase()))),
                      )
                      .map((item) => {
                        const defaultPrice = calculateDefaultPrice(Number.parseFloat(item.price), clientType)

                        return (
                          <div
                            key={item.stockId}
                            onClick={() =>
                              addItemToCart({
                                id: item.stockId,
                                description: item.description,
                                code: item.productCode,
                                name: item.name,
                                qty: item.qty,
                                price: Number.parseFloat(item.price),
                                pv: item.pv,
                                bv: item.bv,
                                unitSell: defaultPrice,
                                shopId: shop.id,
                              })
                            }
                            className="flex justify-between items-center p-2 bg-white border border-gray2 rounded hover:bg-gray1 cursor-pointer"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray5">
                                Member Price: UGX {Number.parseFloat(item.price).toLocaleString()}
                                {(clientType === "Non-Member" || clientType === "Working Client") && (
                                  <span className="text-orange-600"> • Price: Manual Entry Required</span>
                                )}
                                <br />
                                Qty: {item.qty} • PV: {item.pv} • BV: {item.bv}
                              </p>
                            </div>
                            <p className="text-primary text-sm">+ Add</p>
                          </div>
                        )
                      })
                  )}
                </div>
              </div>
            ))
        )}
      </div>

      <div className="w-[60%] rounded-md shadow bg-white ml-2 flex flex-col p-4">
        <div className="grid grid-cols-12 gap-4 mb-4 items-center">
          {/* Client Type Select */}
          <div className="col-span-3">
            <Select
              className="w-full"
              placeholder="Select Client Type"
              options={clientTypeOptions}
              value={clientTypeOptions.find((option) => option.value === clientType)}
              onChange={(option) => setClientType(option?.value || "Member")}
            />
          </div>

          {/* Distributor Select */}
          <div className="col-span-4">
            <Select
              className="w-full"
              placeholder="Select Distributor (optional)"
              options={customerOptions}
              value={selectedCustomer}
              onChange={(selected) => setSelectedCustomer(selected)}
              isClearable
            />
          </div>

          {/* Payment Mode Select */}
          <div className="col-span-3">
            <Select
              className="w-full"
              placeholder="Select Payment Mode"
              options={[
                { value: "Cash", label: "Cash" },
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Mobile Money", label: "Mobile Money" },
                { value: "Bonus Transfer", label: "Bonus Transfer" },
              ]}
              value={paymentMode ? { value: paymentMode, label: paymentMode } : null}
              onChange={(option) => setPaymentMode(option?.value || "")}
            />
          </div>

          {/* Payment Date Picker */}
          <div className="col-span-2">
            <InputField
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              disabled={!selectedCustomer}
              placeholder="Payment Date"
            />
          </div>
        </div>

        <div className="px-2">
          <div className="grid grid-cols-12 gap-2 p-2 font-semibold bg-gray2 text-sm rounded-md">
            <div className="col-span-2">Product</div>
            <div className="col-span-2 text-right">Price</div>
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
              className="m-2 cursor-pointer p-2 bg-gray1 rounded-md grid grid-cols-12 gap-2 items-center"
            >
              <div className="col-span-2 font-medium">
                <div className="text-sm">{item.name}</div>
                <div className="text-xs text-gray-500">{item.clientType}</div>
              </div>

              <div className="col-span-2 text-right">
                {clientType === "Member" ? (
                  <span className="font-medium text-green-600 text-base">{item.unitSell.toLocaleString()}</span>
                ) : (
                  <input
                    type="number"
                    value={customPrices[item.id] !== undefined ? customPrices[item.id] : item.unitSell}
                    onChange={(e) => {
                      handleCustomPriceChange(item.id, e.target.value)
                      // Update cart item price
                      setCart((prevCart) =>
                        prevCart.map((cartItem) =>
                          cartItem.id === item.id
                            ? { ...cartItem, unitSell: Number.parseFloat(e.target.value) || 0 }
                            : cartItem,
                        ),
                      )
                    }}
                    className="w-full text-right text-base border rounded px-2 py-1 h-10"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                )}
              </div>

              <div className="col-span-1 text-right text-sm">{(item.unitSell * item.quantity).toLocaleString()}</div>

              <div className="col-span-1 text-right text-sm text-blue-600">{item.pv || 0}</div>

              <div className="col-span-1 text-right text-sm text-blue-600">
                {((item.pv || 0) * item.quantity).toLocaleString()}
              </div>

              <div className="col-span-1 text-right text-sm text-green-600">{item.bv || 0}</div>

              <div className="col-span-1 text-right text-sm text-green-600">
                {((item.bv || 0) * item.quantity).toLocaleString()}
              </div>

              <div className="col-span-3 flex items-center justify-end gap-2">
                <div onClick={() => decreaseItemQty(item)} className="p-1 rounded-full bg-primary cursor-pointer">
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
          <button
            onClick={makeSale}
            disabled={makeSaleLoading}
            className={`px-4 py-2 bg-secondary rounded ${makeSaleLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {makeSaleLoading ? "Processing..." : "Make Sale"}
          </button>
          <div className="space-x-4 text-right">
            <span>Client: {clientType}</span>
            <span>Total Qty: {totalQty}</span>
            <span>Total PV: {totalPV}</span>
            <span>Total BV: {totalBV}</span>
            <span>Total: UGX {totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Invoice Print Section */}
      {generatedInvoice && (
        <Receipt
          generatedInvoice={generatedInvoice}
          invoiceRef={invoiceRef}
          operator={operator}
        />
      )}
    </div>
  )
}

export default Sales