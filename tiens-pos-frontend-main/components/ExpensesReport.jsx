import React, { useState, useEffect } from "react";
import ButtonAlt from "./ButtonAlt";
import Button from "./Button";
import InputField from "./InputField";
import { BsSearch } from "react-icons/bs";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseReport } from "../store/slices/store";
// import { usePrint } from "../hooks/print";

const ExpensesReported = () => {
    const [modal, setModal] = useState(false)
    const dispatch = useDispatch()
    const { expenseReport, loading } = useSelector((state) => state.autocountStore)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [type, setType] = useState("")
    const [search, setSearch] = useState("")
    // const { printContent } = usePrint()

    useEffect(() => {
        dispatch(getExpenseReport({
            startDate: startDate,
            endDate: endDate,
            type: type,
            search: search
        }))
    }, [dispatch])



    const openModal = () => {
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
    }

    function searchFunction() {
        dispatch(getExpenseReport({
            startDate: startDate,
            endDate: endDate,
            type: type,
            search: search
        }))
    }




    return (
        <div>
            <div onClick={openModal}>
                <ButtonAlt value={"Expenses Report"} />
            </div>


            {modal ? <div className="flex bg-black/50 left-0 right-0 absolute z-50 top-0 h-full w-full">
                <div className="w-2/12" onClick={closeModal}>

                </div>
                <div className="w-10/12 p-3 bg-white">
                    <div className="flex justify-between m-5">
                        <div>
                            <p className="text-xl font-semibold">Expenses</p>
                        </div>
                        <div>
                            {/* <ButtonAlt value={"Print"} onClick={() => {
                                printContent("expense---report")
                            }} /> */}
                        </div>
                    </div>
                    <div className="flex justify-between mx-5">
                        <div className="w-72 -mt-5">
                            <InputField
                                placeholder="Search Expense"
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />

                        </div>
                        <div className="flex">
                            <div className="w-52">
                                <Select
                                    placeholder="Select Type"
                                    options={[{ label: "Utility", value: "Utility" },
                                    { label: "Meals", value: "Meals" },
                                    { label: "Commissions", value: "Commissions" },
                                    { label: "Causal Labour", value: "Labour" },
                                    { label: "Transport", value: "Transport" },
                                    ]}
                                    onChange={(e) => setType(e.value)}
                                />
                            </div>
                            <div className="mx-3  -mt-5">
                                <InputField
                                    type="date"
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className=" -mt-5">
                                <InputField
                                    type="date"
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className=" ml-3 mt-1">
                                <Button value={"Search"} onClick={searchFunction} />
                            </div>
                        </div>

                    </div>

                    <div id="expense---report">


                        <div className="flex bg-gray1 font-medium mt-2">
                            <div className="w-1/4 p-2">
                                Date
                            </div>
                            <div className="w-1/4 p-2">
                                Expenses
                            </div>
                            <div className="w-1/4 p-2">
                                To
                            </div>
                            <div className="w-1/4 p-2">
                                Type
                            </div>
                            <div className="w-1/4 p-2">
                                Amount
                            </div>




                        </div>
                        {
                            loading.expenseReport ? <div className="flex justify-center items-center h-[calc(100vh-220px)]">
                                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                            </div> : null
                        }
                        <div className="h-[calc(100vh-220px)] overflow-y-auto">
                            {expenseReport.map((sale) => {
                                return (
                                    <div className="flex hover:bg-gray1 text-sm text-gray5 border-b border-gray1 cursor-pointer">
                                        <div className="w-1/4 p-2">
                                            {
                                                new Date(sale.date).toLocaleDateString()
                                            }
                                        </div>
                                        <div className="w-1/4 p-2">
                                            {sale.expense}
                                        </div>
                                        <div className="w-1/4 p-2">
                                            {sale.receivedBy}
                                        </div>
                                        <div className="w-1/4 p-2">
                                            {sale.type}
                                        </div>
                                        <div className="w-1/4 p-2">
                                            {sale.amount.toLocaleString()}
                                        </div>



                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex bg-secondary text-white font-medium mt-2">
                            <div className="w-1/4 p-2">
                                Total
                            </div>
                            <div className="w-1/4 p-2">

                            </div>
                            <div className="w-1/4 p-2">

                            </div>
                            <div className="w-1/4 p-2">

                            </div>
                            <div className="w-1/4 p-2">
                                {
                                    expenseReport.reduce((a, b) => a + b.amount, 0).toLocaleString()
                                }
                            </div>
                            <div className="w-1/4 p-2">

                            </div>


                        </div>
                    </div>

                </div>

            </div> : null}


        </div>
    )
}

export default ExpensesReported
