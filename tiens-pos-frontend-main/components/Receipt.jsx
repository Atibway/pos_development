"use client"

const Receipt = ({ generatedInvoice, invoiceRef, operator }) => {
  if (!generatedInvoice) return null

  const grandTotalPV = generatedInvoice.items.reduce(
    (sum, item) => sum + (item.pv || 0) * (item.quantity || 0),
    0
  )
  const grandTotalBV = generatedInvoice.items.reduce(
    (sum, item) => sum + (item.bv || 0) * (item.quantity || 0),
    0
  )

  return (
    <div>
      {generatedInvoice && (
        <div
          ref={invoiceRef}
          className="hidden print:block p-8 text-sm text-gray-700 bg-white print:p-10 print:bg-white print:rounded-md print:shadow-none border border-gray3"
        >
          {/* Print Header */}
          <div className="pb-4">
            <div className="flex justify-between items-start">
              {/* Left: Text */}
              <div className="flex-1 text-center">
                <h2 className="text-2xl font-bold text-black tracking-wide uppercase">
                  TIENS HEALTH PRODUCTS
                </h2>
                <p className="text-sm leading-tight -mt-1">
                  6th Floor, King Fahd Plaza, Plot 52 Kampala Rd
                </p>
                <p className="text-sm">
                  P.O.Box .... Kampala, Tel: +256 (0) 702 794 458 | 0773 662 136
                </p>
              </div>
              {/* Right: Logo */}
              <div className="w-[100px] h-[100px] mr-2">
                <img
                  src="/logo.ico"
                  alt="TIENS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            {/* Input-style Fields (Name, Contacts, ID, Serial No) */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span>DISTRIBUTOR'S NAME:</span>
                <div className="border border-black h-6 w-full px-2 flex items-center">
                  {generatedInvoice.customer?.name || "Walk-in Customer"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>DISTRIBUTOR'S CONTACTS:</span>
                <div className="border border-black h-6 w-full px-2 flex items-center">
                  {generatedInvoice.customer?.phone || "-"}
                </div>
              </div>
            </div>
            {/* Distributor ID & Serial No */}
            <div className="flex justify-between items-center mt-2 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span>DISTRIBUTOR ID NO:</span>
                <div className="flex gap-[2px]">
                  {(generatedInvoice.customer?.email || "")
                    .slice(0, 8)
                    .padEnd(8, " ")
                    .split("")
                    .map((char, i) => (
                      <div
                        key={i}
                        className="border border-black w-6 h-6 flex items-center justify-center"
                      >
                        {char}
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>SHOP SERIAL NO:</span>
                <div className="border border-black h-6 px-2 flex items-center justify-center text-xs w-24">
                  {generatedInvoice.shop.serialNumber || "-"}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span>CLIENT TYPE:</span>
                <div className="border border-black h-6 w-full px-2 flex items-center">
                  {generatedInvoice.clientType || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-black text-xs print:text-[11px]">
            {/* Header */}
            <div className="grid grid-cols-12 font-bold border-b border-black">
              <div className="p-2 border-r border-black break-words">CODE</div>
              <div className="p-2 border-r border-black break-words col-span-3">
                NAME
              </div>
              <div className="p-2 border-r border-black break-words">QTY</div>
              <div className="p-2 border-r border-black break-words">PV</div>
              <div className="p-2 border-r border-black break-words">%PV</div>
              <div className="p-2 border-r border-black break-words">TOTAL PV</div>
              <div className="p-2 border-r border-black break-words">BV</div>
              <div className="p-2 border-r border-black break-words">%BV</div>
              <div className="p-2 border-r border-black break-words">TOTAL BV</div>
              <div className="p-2 border-r border-black break-words">UGSHS</div>
            </div>

            {/* Body */}
            {generatedInvoice.items.map((item, index) => {
              const qty = item.quantity || 0
              const ugxPrice = item.unitSell || 0
              const pv = item.pv || 0
              const bv = item.bv || 0
              const totalPv = pv * qty
              const totalBv = bv * qty
              const percentPv =
                ugxPrice > 0 ? `${Math.round((pv / ugxPrice) * 100)}%` : "0%"
              const percentBv =
                ugxPrice > 0 ? `${Math.round((bv / ugxPrice) * 100)}%` : "0%"
              return (
                <div
                  key={index}
                  className="grid grid-cols-12 border-b border-black text-black"
                >
                  <div className="p-2 border-r border-black break-words">
                    {item.code || "-"}
                  </div>
                  <div className="p-2 border-r border-black col-span-3 break-words">
                    {item.name || "-"}
                  </div>
                  <div className="p-2 border-r border-black break-words">{qty}</div>
                  <div className="p-2 border-r border-black break-words">{pv}</div>
                  <div className="p-2 border-r border-black break-words">
                    {percentPv}
                  </div>
                  <div className="p-2 border-r border-black break-words">
                    {totalPv}
                  </div>
                  <div className="p-2 border-r border-black break-words">{bv}</div>
                  <div className="p-2 border-r border-black break-words">
                    {percentBv}
                  </div>
                  <div className="p-2 border-r border-black break-words">
                    {totalBv}
                  </div>
                  <div className="p-2 border-r border-black break-words">
                    {ugxPrice.toLocaleString()}
                  </div>
                </div>
              )
            })}

            {/* Grand Total Row */}
            <div className="grid grid-cols-12 font-bold border-t border-black text-black">
              <div className="p-2 border-r border-black col-span-5 text-right">
                TOTAL:
              </div>
              <div className="p-2 border-r border-black"></div>
              <div className="p-2 border-r border-black"></div>
              <div className="p-2 border-r border-black text-right">
                {grandTotalPV.toLocaleString()}
              </div>
              <div className="p-2 border-r border-black"></div>
              <div className="p-2 border-r border-black"></div>
              <div className="p-2 border-r border-black text-right">
                {grandTotalBV.toLocaleString()}
              </div>
              <div className="p-2 text-right">
                {generatedInvoice.total.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Footer Form Section */}
          <div className="mt-8 text-sm border-t border-gray3 pt-4">
            <div className="mb-4">
              <p className="font-semibold mb-1">Mode of Payment</p>
              <p>{generatedInvoice.paymentMode || "_________"}</p>
            </div>
            <div className="mb-4">
              <p className="font-bold ">GRAND TOTAL</p>
              <p className="text-lg font-semibold">
                UGX {generatedInvoice.total.toLocaleString()}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <p>Date:</p>
              <div className="border-b border-gray3 h-6 mt-1 text-xs text-gray-700">
                {new Date(generatedInvoice.date).toLocaleDateString()}
              </div>
            </div>
            <p className="italic text-xs text-gray4 mt-4">
              Please confirm that the Tianshi ID Number is correctly filled.
            </p>
            <p className="text-xs text-center mt-6">
              <strong>Copies:</strong> First - Office | Second - Distributors |
              Third - Speciality Shop
            </p>
            <div className="grid grid-cols-2 gap-6 p-4 mt-4 text-sm text-gray-800 border-t border-gray-300 pt-4">
              <div className="space-y-1">
                <p className=" font-bold mb-2 border-b border-dashed border-black pb-1">
                  Shop Info
                </p>
                <div className="flex">
                  <span className="w-24 font-semibold">Name:</span>
                  <span>{generatedInvoice.shop?.name || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-semibold">Location:</span>
                  <span>{generatedInvoice.shop?.location || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-semibold">Contact:</span>
                  <span>{generatedInvoice.shop?.contact || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className=" font-bold mb-2 border-b border-dashed border-black pb-1">
                  Shop Operator
                </p>
                <div className="flex">
                  <span className="w-24 font-semibold">Name:</span>
                  <span>
                    {operator?.first_name} {operator?.last_name}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-24 font-semibold">Phone:</span>
                  <span>{operator?.phone_number || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-semibold">Email:</span>
                  <span>{operator?.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-center mt-10 text-gray5 italic">
            Thank you for choosing TIENS. For inquiries, call +256 786 201985.
          </div>
        </div>
      )}
    </div>
  )
}

export default Receipt
