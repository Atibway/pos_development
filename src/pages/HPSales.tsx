import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Minus, X } from "lucide-react";
import { useHPSales } from "@/hooks/useHPSales";
import { HPSaleItem } from "@/types/sales";
import Receipt from "@/components/Receipt";
import { usePrint } from "@/hooks/usePrint";

const HPSales = () => {
  const {
    shops,
    cart,
    selectedCustomer,
    paymentMode,
    paymentDate,
    search,
    makeSaleLoading,
    operator,
    customerOptions,
    addItemToCart,
    decreaseItemQty,
    removeItemFromCart,
    updateItemPrice,
    setSelectedCustomer,
    setPaymentMode,
    setPaymentDate,
    setSearch,
    makeSale,
    generatedInvoice,
    setGeneratedInvoice
  } = useHPSales();

  const { handlePrint, printRef: invoiceRef } = usePrint();

  useEffect(() => {
    if (generatedInvoice) {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
    const handleAfterPrint = () => {
      setGeneratedInvoice(null);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [generatedInvoice, handlePrint]);

  const calculateTotals = () => {
    const totalAmount = cart.reduce((total, item) => total + item.unitSell * item.quantity, 0);
    const totalPV = cart.reduce((sum, item) => sum + (item.pv || 0) * item.quantity, 0);
    const totalBV = cart.reduce((sum, item) => sum + (item.bv || 0) * item.quantity, 0);
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    return { totalAmount, totalPV, totalBV, totalQty };
  };

  const { totalAmount, totalPV, totalBV, totalQty } = calculateTotals();

  const clientType = "Half-Price (HP) Client";

  return (
    <div className="flex w-full h-full gap-4 p-6">
      {/* Left Panel - HP Shops */}
      <Card className="w-2/5 h-[calc(100vh-6rem)]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>HP Shops</span>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          {shops.length === 0 ? (
            <p className="text-center text-muted-foreground mt-10">No shops issued to your user account.</p>
          ) : (
            shops.map((shop) => (
              <Card key={shop.id} className="mb-4">
                <CardContent className="p-4">
                  <div>
                    <p className="font-semibold text-lg">{shop.name}</p>
                    <p className="text-sm text-muted-foreground">{shop.location}</p>
                  </div>

                  <div className="mt-3 space-y-2">
                    {(shop.issuedStocks || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No stocks issued for this shop.</p>
                    ) : (
                      shop.issuedStocks
                        .filter(
                          (item) =>
                            item.qty > 0 &&
                            item.halfPrice &&
                            (search === "" ||
                              item.name.toLowerCase().includes(search.toLowerCase()) ||
                              (item.productCode && item.productCode.toLowerCase().includes(search.toLowerCase())))
                        )
                        .map((item) => {
                          const hpPrice = parseFloat(item.price.toString());
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
                                  price: hpPrice,
                                  pv: item.pv,
                                  bv: item.bv,
                                  unitSell: hpPrice,
                                  shopId: shop.id,
                                })
                              }
                              className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  HP Price: UGX {hpPrice.toLocaleString()}
                                  <br />
                                  Qty: {item.qty} • PV: {item.pv} • BV: {item.bv}
                                </p>
                              </div>
                              <Badge variant="secondary" className="cursor-pointer">
                                + Add
                              </Badge>
                            </div>
                          );
                        })
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Right Panel - Cart & Controls */}
      <Card className="w-3/5">
        <CardHeader>
          <CardTitle>HP Sales Cart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Client Type Display */}
            <div className="col-span-3">
              <Badge variant="secondary" className="w-full justify-center py-2">
                {clientType}
              </Badge>
            </div>

            {/* Distributor Select */}
            <div className="col-span-4">
              <Select
                value={selectedCustomer?.value?.toString()}
                onValueChange={(value) => {
                  const customer = customerOptions.find(c => c.value?.toString() === value);
                  setSelectedCustomer(customer || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Distributor (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {customerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value?.toString() || ""}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Mode Select */}
            <div className="col-span-3">
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Bonus Transfer">Bonus Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Date Picker */}
            <div className="col-span-2">
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                disabled={!selectedCustomer}
                placeholder="Payment Date"
              />
            </div>
          </div>

          {/* Cart Header */}
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted font-semibold text-sm rounded-lg">
            <div className="col-span-3">Product</div>
            <div className="col-span-2 text-right">HP Price</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-1 text-right">PV</div>
            <div className="col-span-1 text-right">Total PV</div>
            <div className="col-span-1 text-right">BV</div>
            <div className="col-span-1 text-right">Total BV</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Cart Items */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {cart.map((item: HPSaleItem) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 p-3 bg-muted/50 rounded-lg items-center"
              >
                <div className="col-span-3">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.clientType}</div>
                </div>

                <div className="col-span-2 text-right">
                  <Input
                    type="number"
                    value={item.unitSell}
                    onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                    className="text-right font-medium"
                    min="0"
                  />
                </div>

                <div className="col-span-1 text-right text-sm">
                  UGX {(item.unitSell * item.quantity).toLocaleString()}
                </div>

                <div className="col-span-1 text-right text-sm text-blue-600">{item.pv || 0}</div>

                <div className="col-span-1 text-right text-sm text-blue-600">
                  {((item.pv || 0) * item.quantity).toLocaleString()}
                </div>

                <div className="col-span-1 text-right text-sm text-green-600">{item.bv || 0}</div>

                <div className="col-span-1 text-right text-sm text-green-600">
                  {((item.bv || 0) * item.quantity).toLocaleString()}
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decreaseItemQty(item)}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (item.quantity < item.qty) addItemToCart(item);
                    }}
                    disabled={item.quantity >= item.qty}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItemFromCart(item)}
                    className="h-8 w-8 text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No items in cart
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-lg">
            <Button
              onClick={makeSale}
              disabled={makeSaleLoading || cart.length === 0}
              variant="secondary"
            >
              {makeSaleLoading ? "Processing..." : "Make Sale"}
            </Button>
            <div className="flex items-center gap-4 text-sm">
              <span>Client: {clientType}</span>
              <span>Total Qty: {totalQty}</span>
              <span>Total PV: {totalPV}</span>
              <span>Total BV: {totalBV}</span>
              <span className="font-semibold">Total: UGX {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Print Section */}
      {generatedInvoice && (
        <Receipt
          generatedInvoice={generatedInvoice}
          invoiceRef={invoiceRef}
          operator={operator}
        />
      )}
    </div>
  );
};

export default HPSales;
