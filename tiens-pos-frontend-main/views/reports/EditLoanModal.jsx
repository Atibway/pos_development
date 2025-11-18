"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { Button } from "@/components/ui/Button";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { ButtonLoader } from "@/components/ui/ButtonLoader";
import InputField from "@/components/ui/InputField";
import axios from "axios";

const LoanEditModal = ({ loan, onClose, onSave }) => {
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentDate, setPaymentDate] = useState("");
  const [remark, setRemark] = useState("");
  const [posting, setPosting] = useState(false);

  const handleSave = async () => {
    if (!amountPaid || !paymentDate) return;
    setPosting(true);
    try {
      await axios.post("/api/loans/pay", {
        id: loan._id,
        amount: amountPaid,
        date: paymentDate,
        remark,
      });
      onSave();
    } catch (err) {
      alert("Error while paying loan");
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-3/12" onClick={onClose}></div>
      <div className="bg-white rounded-lg w-[800px]">
        <div className="rounded-lg bg-white mt-[2vh]">
          <div className="flex text-xl justify-between font-semibold text-primary p-2 bg-gray1">
            <p>Edit Loan Payment</p>
            <p onClick={onClose} className="cursor-pointer">X</p>
          </div>

          <div className="flex h-[75vh] overflow-y-auto">
            <div className="w-full p-3 -mt-5">
              <InputField
                label="Borrower Name"
                value={loan.clientName || "-"}
                disabled
              />
              <InputField
                label="Loan Amount (UGX)"
                value={loan.amount}
                disabled
              />
              <InputField
                label="Paid Amount (UGX) *"
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
              />
              <InputField
                label="Payment Date *"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
              <InputField
                label="Remark"
                placeholder="Optional remarks..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between text-primary p-2 bg-gray1">
            <div onClick={onClose}>
              <ButtonSecondary value="Close" />
            </div>
            <div className="w-36">
              {posting ? (
                <ButtonLoader />
              ) : (
                <div onClick={handleSave}>
                  <Button value="Submit Payment" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/12" onClick={onClose}></div>
    </div>
  );
};

export default LoanEditModal;
