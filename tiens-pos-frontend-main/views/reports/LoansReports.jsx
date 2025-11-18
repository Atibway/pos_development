"use client"

import { useEffect, useState } from "react"
import axiosInstance from "../../axios-instance"
import Loader from "../../components/Loader"
import InputField from "../../components/InputField"
import Button from "../../components/Button"
import ButtonLoader from "../../components/ButtonLoader"
import ButtonSecondary from "../../components/ButtonSecondary"
import PrintFunc from "../../hooks/print"

const LoansReports = () => {
  const [loans, setLoans] = useState([])
  const [search, setSearch] = useState("")
  const [filteredLoans, setFilteredLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [remarks, setRemarks] = useState("")
  const [posting, setPosting] = useState(false)
  const [modal, setModal] = useState(false)

  const { handlePrint: handleAllPrint, printRef } = PrintFunc()
  const { handlePrint: handleInvoicePrint, printRef: invoiceRef } = PrintFunc()

  const closeModal = () => {
    setModal(false)
    setSelectedLoan(null)
    setPaymentAmount("")
    setRemarks("")
  }

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get("/loans")
        if (res.data.status) {
          setLoans(res.data.payload)
          setFilteredLoans(res.data.payload)
        }
      } catch (error) {
        console.error("Error fetching loans", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLoans()
  }, [])

  useEffect(() => {
    const lower = search.toLowerCase()
    setFilteredLoans(loans.filter((loan) => loan.customer?.name?.toLowerCase().includes(lower)))
  }, [search, loans])

  const handleOpenEdit = (loan) => {
    setSelectedLoan(loan)
    setModal(true)
  }

  const handleEditSubmit = async () => {
    if (!paymentAmount || !selectedLoan?.id) return
    setPosting(true)
    try {
      const payload = {
        id: selectedLoan.id,
        amount: Number.parseFloat(paymentAmount),
        date: new Date().toISOString(),
        remarks,
      }
      const res = await axiosInstance.post("/loans/pay", payload)
      if (res.data.status) {
        alert("Payment recorded")
        closeModal()
        const refresh = await axiosInstance.get("/loans")
        setLoans(refresh.data.payload)
        setFilteredLoans(refresh.data.payload)
      }
    } catch (err) {
      console.error("Payment error", err)
    } finally {
      setPosting(false)
    }
  }

  const handleClearSearch = () => {
    setSearch("")
    // Re-filter loans after clearing search
    setFilteredLoans(loans)
  }

  const totalAmount = filteredLoans.reduce((sum, l) => sum + l.amount, 0)
  const totalBalance = filteredLoans.reduce((sum, l) => sum + l.balance, 0)
  const totalPaid = filteredLoans.reduce((sum, l) => sum + (l.amount - l.balance), 0)

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50">
      <div className="h-full bg-white rounded-lg shadow-sm flex flex-col">
        {/* Header */}
        <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900">Loan Reports</h1>
            <div className="flex gap-3 items-end">
              <InputField
                type="text"
                placeholder="Search by Customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 text-sm"
              />
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors h-9 text-sm"
              >
                Clear
              </button>
              <Button value="Print All" onClick={handleAllPrint} />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-600">Total Loan Amount</h3>
              <p className="text-xl font-bold text-blue-900">UGX {totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium text-green-600">Total Paid</h3>
              <p className="text-xl font-bold text-green-900">UGX {totalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-2 rounded-lg border border-red-200">
              <h3 className="text-sm font-medium text-red-600">Total Outstanding Balance</h3>
              <p className="text-xl font-bold text-red-900">UGX {totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Table Container - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <div ref={printRef} className="h-full print:h-auto print:p-8">
            {/* Print Header */}
            <div className="hidden print:block mb-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-black tracking-wide uppercase">TIENS HEALTH PRODUCTS</h2>
                <p className="text-lg font-semibold mt-2">LOAN REPORTS</p>
                <p className="text-sm mt-1">Generated on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Scrollable Table */}
            <div className="h-full overflow-auto print:overflow-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 print:bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      S/N
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Customer
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Paid
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Balance
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:hidden">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : filteredLoans.length > 0 ? (
                    <>
                      {filteredLoans.map((loan, index) => {
                        const paid = loan.amount - loan.balance
                        return (
                          <tr
                            key={loan.id}
                            className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                          >
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              {index + 1}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              {new Date(loan.date).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                              {loan.customer?.name}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right border-r border-gray-200">
                              {loan.amount.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right border-r border-gray-200">
                              {paid.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right border-r border-gray-200">
                              {loan.balance.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap border-r border-gray-200">
                              {loan.balance === 0 ? (
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  Cleared
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 flex gap-2 print:hidden">
                              <Button
                                value="Invoice"
                                size="sm"
                                onClick={() => {
                                  setSelectedLoan(loan)
                                  setTimeout(() => handleInvoicePrint(), 300)
                                }}
                              />
                              {loan.balance !== 0 && (
                                <Button
                                  value="Edit"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleOpenEdit(loan)}
                                />
                              )}
                            </td>
                          </tr>
                        )
                      })}
                      {/* Grand Totals Row */}
                      <tr className="bg-gray-800 text-white font-bold sticky bottom-0">
                        <td colSpan="3" className="px-3 py-2 text-sm uppercase border-r border-gray-600">
                          GRAND TOTALS
                        </td>
                        <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
                          {totalAmount.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
                          {totalPaid.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm text-right border-r border-gray-600">
                          {totalBalance.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm border-r border-gray-600">-</td>
                        <td className="px-3 py-2 text-sm">-</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-12 h-12 text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                          <p className="text-lg font-medium">No loan records found.</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 pt-4 border-t border-gray-300">
              <div className="text-center text-xs text-gray-600">
                <p>
                  TIENS HEALTH PRODUCTS - 6th Floor, King Fahd Plaza, Plot 52 Kampala Rd - P.O.Box .... Kampala - Tel:
                  +256 (0) 702 794 458 | 0750 838 085 | 0773 662 136 - Generated on: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Single Invoice Printable */}
        {selectedLoan && (
          <div ref={invoiceRef} className="hidden print:block print:p-8 font-sans text-gray-700">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-wide uppercase">TIENS HEALTH PRODUCTS</h1>
                <p className="text-sm text-gray-600 leading-tight">
                  6th Floor, King Fahd Plaza, Plot 52 Kampala Rd - P.O.Box .... Kampala - Phone: +256 786 201985
                </p>
              </div>
              <div>
                <img src="/logo.ico" alt="TIENS Logo" className="w-24 h-auto" />
              </div>
            </div>

            {/* Invoice Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-wide">LOAN INVOICE</h2>
              <p className="text-sm text-gray-600">Printed: {new Date().toLocaleString()}</p>
            </div>

            {/* Shop Info */}
            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Shop Information</p>
                <p>
                  <span className="font-medium">Name:</span> {selectedLoan?.sales?.shop?.name}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {selectedLoan?.sales?.shop?.location}
                </p>
                <p>
                  <span className="font-medium">Contact:</span> {selectedLoan?.sales?.shop?.contact}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Customer Information</p>
                <p>
                  <span className="font-medium">ID:</span> {selectedLoan.customer?.email}
                </p>
                <p>
                  <span className="font-medium">Name:</span> {selectedLoan.customer?.name}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {selectedLoan.customer?.phone}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {new Date(selectedLoan.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Summary Table */}
            <div className="mt-4 border border-gray-300 rounded-md overflow-hidden w-full text-sm">
              <div className="grid grid-cols-2 bg-gray-100 font-semibold border-b text-gray-700">
                <div className="p-2">Description</div>
                <div className="p-2">Value</div>
              </div>
              <div className="grid grid-cols-2 border-b">
                <div className="p-2">Total Amount</div>
                <div className="p-2">{selectedLoan.amount.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-2 border-b">
                <div className="p-2">Paid</div>
                <div className="p-2">{(selectedLoan.amount - selectedLoan.balance).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-2 border-b">
                <div className="p-2">Balance</div>
                <div className="p-2">{selectedLoan.balance.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-2 bg-gray-100 font-bold text-green-700">
                <div className="p-2">Status</div>
                <div className="p-2">{selectedLoan.balance === 0 ? "Cleared" : "Pending"}</div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-xs text-center mt-8 text-gray-600">Thank you for doing business with us.</div>
          </div>
        )}

        {/* Edit Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Edit Loan Payment</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                  &times;
                </button>
              </div>
              <div className="p-3 space-y-3">
                <p className="text-gray-700">
                  <strong>Customer:</strong> {selectedLoan?.customer?.name}
                </p>
                <p className="text-gray-700">
                  <strong>Current Balance:</strong> {selectedLoan?.balance.toLocaleString()}
                </p>
                <InputField
                  label="Payment Amount *"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full h-10 text-base"
                />
                {/* <InputField
                    label="Remarks (optional)"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full h-10 text-base"
                  /> */}
              </div>
              <div className="flex justify-end p-3 border-t border-gray-200 gap-2">
                <ButtonSecondary value="Close" onClick={closeModal} />
                {posting ? (
                  <ButtonLoader />
                ) : (
                  <Button value="Submit Payment" onClick={handleEditSubmit} disabled={!paymentAmount} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoansReports
