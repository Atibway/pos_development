import React, { useState, useEffect } from "react";
import ButtonAlt from "./ButtonAlt";
// import { usePrint } from "../hooks/print";
import { useDispatch, useSelector } from "react-redux"
import { getTodaySales } from "../store/slices/store";
// import PrintFunc from "../../hooks/print";
const TodaySales = () => {
    // const { printContent } = usePrint()
    const [modal, setModal] = useState(false)
    const dispatch = useDispatch()
    const { todaySales } = useSelector((state) => state.autocountStore)

    useEffect(() => {
        dispatch(getTodaySales())
    }, [dispatch])




    const openModal = () => {
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
    }


    return (
        <>
            <div className="flex justify-between mt-2 mr-2">
                <div>

                </div>
                <div onClick={openModal}>
                    <ButtonAlt value={"Today's Sales"} />
                </div>

            </div>
            {modal ? <div className="flex bg-black/50 left-0 right-0 absolute z-50 top-0 h-full w-full">
                <div className="w-3/12" onClick={closeModal}>

                </div>
                <div className="w-9/12 p-3 bg-white">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-xl font-semibold">Todays Sales</p>
                        </div>
                        <div>
                            {/* <ButtonAlt onClick={PrintFunc} value={"Print"} /> */}
                        </div>

                    </div>

                    <div id="today-sales-table">
                        <div className="flex bg-gray1 font-medium mt-2" >
                            <div className="w-1/4 p-2">
                                Product
                            </div>
                            <div className="w-1/4 p-2">
                                Qty
                            </div>
                            <div className="w-1/4 p-2">
                                Cost
                            </div>
                            <div className="w-1/4 p-2">
                                Profit
                            </div>

                        </div>
                        <div className="h-[75vh] overflow-y-auto">
                            {todaySales.map((sale) => {
                                return (
                                    <div className="flex hover:bg-gray1 text-sm text-gray5 border-b border-gray1 cursor-pointer">
                                        <div className="w-1/4 p-2">
                                            {sale.stock?.name}
                                        </div>
                                        <div className="w-1/4 p-2">
                                            {sale.quantity.toLocaleString()}
                                        </div>
                                        <div className="w-1/4 p-2">
                                            {(sale.stock?.unitSell * sale.quantity).toLocaleString()}
                                        </div>
                                        <div className="w-1/4 p-2">
                                            {
                                                (sale.stock?.unitSell * sale.quantity - sale.stock?.unitCost * sale.quantity).toLocaleString()
                                            }
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
                                {
                                    todaySales.reduce((a, b) => {
                                        return a + b.quantity
                                    }, 0).toLocaleString()
                                }
                            </div>
                            <div className="w-1/4 p-2">
                                {
                                    todaySales.reduce((a, b) => {
                                        return a + b.stock.unitCost
                                    }, 0).toLocaleString()
                                }
                            </div>
                            <div className="w-1/4 p-2">
                                {
                                    todaySales.reduce((a, b) => {
                                        return a + (b.stock.unitSell * b.quantity - b.stock.unitCost * b.quantity)
                                    }, 0).toLocaleString()
                                }
                            </div>

                        </div>
                    </div>

                </div>

            </div> : null}

        </>
    )
}

export default TodaySales
