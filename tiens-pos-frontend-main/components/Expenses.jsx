import React, { useEffect, useState } from "react";
import ButtonAlt from "./ButtonAlt";
import InputField from "./InputField";
import Button from "./Button";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import Select from "react-select";
import axiosInstance from "../axios-instance";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ButtonLoader from "./ButtonLoader";
import Loader from "./Loader"
import Button2 from "./Button2";
import ButtonSecondary from "./ButtonSecondary";

const Expenses = () => {

    const [modal, setModal] = useState(false)

    const openModal = () => {
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
    }

    const [modal2, setModal2] = useState(false)

    const openModal2 = (expense) => {
        seteDate(expense.date);
        seteAmount(expense.amount);
        seteType(expense.type);
        seteReceivedby(expense.receivedBy);
        seteExpense(expense.expense)
        setModal2(true)
        setId(expense.id)
    }

    // posting sales
    const [updating, setUpdating] = useState(false);
    const [edate, seteDate] = useState("");
    const [eamount, seteAmount] = useState("");
    const [etype, seteType] = useState("");
    const [ereceivedby, seteReceivedby] = useState("");
    const [eexpense, seteExpense] = useState("");
    const [id, setId] = useState("");

    const updateExpense = async () => {

        if (edate === "" || eamount === "" || etype === "" || ereceivedby === "" || eexpense === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill all fields!",
            });
            return;
        }

        try {
            setUpdating(true)
            let formData = {
                id: id,
                date: edate,
                amount: eamount,
                type: etype.label,
                receivedBy: ereceivedby,
                expense: eexpense
            }
            let res = await axiosInstance.put("/expenses", formData);
            if (res.status) {
                setUpdating(false)
                setDate("");
                setAmount("");
                setReceivedby("");
                setType("");
                fetchExpenses();
                setExpense("");
                setId("")
                closeModal2();
                const MySwal = withReactContent(Swal);
                MySwal.fire({
                    icon: "success",
                    showConfirmButton: false,
                    timer: 500,
                });
            }
        } catch (error) {

        } finally {
            setUpdating(false)
        }

    }

    const closeModal2 = () => {
        setModal2(false)
    }



    // posting sales
    const [posting, setPosting] = useState(false);
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [receivedby, setReceivedby] = useState("");
    const [expense, setExpense] = useState("");

    const postExpense = async () => {
        // alert(type)
        if (date !== "" && amount !== "" && type !== "" && receivedby !== "" && expense !== "") {
            try {

                setPosting(true)
                let formData = {
                    date: date,
                    amount: amount,
                    type: type.label,
                    receivedBy: receivedby,
                    expense: expense
                }
                let res = await axiosInstance.post("/expenses", formData);
                if (res.status) {
                    setPosting(false)
                    setDate("");
                    setAmount("");
                    setReceivedby("");
                    setType("");
                    fetchExpenses();
                    setExpense("");
                    const MySwal = withReactContent(Swal);
                    MySwal.fire({
                        icon: "success",
                        showConfirmButton: false,
                        timer: 500,
                    });
                }
            } catch (error) {

            } finally {
                setPosting(false)
            }
        }
    }


    const [loading, setLoading] = useState(false);

    const [expenseData, setExpenseData] = useState([]);
    const [total, setTotal] = useState("")
    const fetchExpenses = async () => {
        try {
            setLoading(true)
            let res = await axiosInstance.get("/expenses");
            if (res.status) {
                setLoading(false)
                setExpenseData(res.data.payload)
                const sumOfAges = res.data.payload.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.amount;
                }, 0);

                setTotal(sumOfAges)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    const deleteExpense = (expense) => {
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
                    const response = await axiosInstance.delete(
                        `/expenses/${expense.id}`
                    );
                    const { data } = response;
                    const { status } = data;
                    if (status) {
                        fetchExpenses()
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

    const types = [
        { label: "Utility", value: "Utility" },
        { label: "Meals", value: "Meals" },
        { label: "Commissions", value: "Commissions" },
        { label: "Causal Labour", value: "Labour" },
        { label: "Transport", value: "Transport" },
    ]



    return (
        <>
            <div className="flex justify-between mr-2">
                <div>

                </div>
                <div onClick={openModal}>
                    <ButtonAlt value={"Expenses"} />
                </div>

            </div>
            {modal ? <div className="flex bg-black/50 z-50 left-0 right-0 absolute z-50 top-0 h-full w-full">
                <div className="w-2/12" onClick={closeModal}>

                </div>
                <div className="w-10/12 p-3 bg-white relative">
                    {/* edit modal */}
                    {modal2 ? <div className="absolute z-50 w-[80vw] shadow-xl bg-white rounded-md">
                        <div className="flex p-3 justify-between bg-gray1 font-medium text-primary">
                            <div>
                                Edit Expense
                            </div>
                            <div>
                                <p className="cursor-pointer" onClick={closeModal2}>X</p>
                            </div>

                        </div>
                        <div className="flex">
                            <div className="w-1/3 p-2">
                                <InputField value={edate} onChange={(e) => seteDate(e.target.value)} label="date" type="date" />

                            </div>
                            <div className="w-1/3 p-2">
                                <InputField value={eamount} onChange={(e) => seteAmount(e.target.value)} label="Amount" type="number" placeholder="Enter Amount" />
                            </div>
                            <div className="w-1/3 p-2">
                                <InputField value={eexpense} onChange={(e) => seteExpense(e.target.value)} label="Expense" placeholder="Enter Expense" />
                            </div>

                        </div>
                        <div className="flex">
                            <div className="w-1/3 p-2">
                                <InputField value={ereceivedby} onChange={(e) => seteReceivedby(e.target.value)} label="Received By" placeholder="Enter Person and Contacts" />

                            </div>
                            <div className="w-1/3 p-2">
                                <br />
                                <label className="text-gray5">Expense Type</label>
                                <Select defaultValue={etype} onChange={seteType} placeholder="Select Expense Type"
                                    options={types} />
                            </div>
                            <div className="w-1/3 p-2">

                            </div>

                        </div>

                        <div className="flex p-3 justify-between bg-gray1 font-medium text-primary">
                            <div onClick={closeModal2}>
                                <ButtonSecondary value={"Close"} />
                            </div>
                            <div className="w-32">
                                {updating ? <ButtonLoader /> : <div onClick={updateExpense}>
                                    <Button value={"Update"} />
                                </div>}



                            </div>

                        </div>
                    </div> : null}
                    <div>
                        <p className="text-xl font-semibold">Expenses</p>
                    </div>
                    <div className="flex -mt-8">

                        <div className="w-1/3 p-2">
                            <InputField value={date} onChange={(e) => setDate(e.target.value)} label="date" type="date" />

                        </div>
                        <div className="w-1/3 p-2">
                            <InputField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Enter amount" />

                        </div>
                        <div className="w-1/3 p-2">
                            <InputField value={expense} onChange={(e) => setExpense(e.target.value)} label="Expense" placeholder="Expense" />

                        </div>


                    </div>
                    <div className="flex -mt-10">
                        <div className="w-1/3 p-2">
                            <InputField value={receivedby} onChange={(e) => setReceivedby(e.target.value)} label="Received By" placeholder="Recieved by" />
                        </div>
                        <div className="w-1/3 p-2">
                            <br />
                            <label className="text-gray5">Expense Type</label>
                            <Select defaultValue={type} onChange={setType} placeholder="Select Expense Type"
                                options={types} />
                        </div>
                        <div className="w-32 mt-14">
                            {posting ? <ButtonLoader /> : <div onClick={postExpense}>
                                <Button value={"Add"} />
                            </div>}


                        </div>

                    </div>

                    <div className="flex bg-gray1 font-medium -mt-5">
                        <div className="w-2/12 p-2">
                            Date
                        </div>
                        <div className="w-2/12 p-2">
                            Expenses
                        </div>
                        <div className="w-3/12 p-2">
                            Received By
                        </div>
                        <div className="w-2/12 p-2">
                            Type
                        </div>
                        <div className="w-2/12 p-2">
                            Amount
                        </div>

                        <div className="w-1/12 p-2">
                            Action
                        </div>




                    </div>

                    {loading ? <div className="flex justify-center items-center"> <Loader /> </div> : null}

                    <div className="h-[calc(100vh-310px)] overflow-y-auto">
                        {expenseData.map((expense) => {
                            return (
                                <div className="flex hover:bg-gray1 text-sm text-gray5 border-b border-gray1 cursor-pointer">
                                    <div className="w-2/12 p-2">
                                        {
                                            new Date(expense.date).toLocaleDateString()
                                        }
                                    </div>
                                    <div className="w-2/12 p-2">
                                        {expense.expense}
                                    </div>
                                    <div className="w-3/12 p-2">
                                        {expense.receivedBy}
                                    </div>
                                    <div className="w-2/12 p-2">
                                        {expense.type}
                                    </div>
                                    <div className="w-2/12 p-2">
                                        {(expense.amount).toLocaleString()}
                                    </div>
                                    <div className="w-1/12 flex p-2">
                                        <BsTrash onClick={() => deleteExpense(expense)} className="text-red" />
                                        <BsPencilSquare onClick={() => openModal2(expense)} className="text-yellow ml-5" />
                                    </div>


                                </div>
                            )
                        })}
                    </div>
                    <div className="flex bg-secondary text-white font-medium mt-2">
                        <div className="w-2/12 p-2">
                            Total
                        </div>
                        <div className="w-2/12 p-2">

                        </div>
                        <div className="w-3/12 p-2">

                        </div>
                        <div className="w-2/12 p-2">

                        </div>
                        <div className="w-2/12 p-2">
                            {(total).toLocaleString()}
                        </div>

                        <div className="w-1/12 p-2">

                        </div>





                    </div>

                </div>

            </div> : null}

        </>
    )
}

export default Expenses
