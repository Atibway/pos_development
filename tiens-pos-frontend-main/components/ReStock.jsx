import React, { useState, useEffect } from "react";
import ButtonAlt from "./ButtonAlt";
import { useDispatch, useSelector } from "react-redux";
import { getAllStock } from "../store/slices/store";

const ReStock = () => {
    const [modal, setModal] = useState(false)
    const { allStock } = useSelector((state) => state.autocountStore)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllStock())
    }, [dispatch])


    const openModal = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false)
    }
    return (
        <div>
            <div onClick={openModal}>
                <ButtonAlt value={"ReStock"} />
            </div>

            {modal ?
                <div className="flex bg-black/50 z-50 absolute top-0 right-0 left-0 h-full w-full">
                    <div className="w-7/12" onClick={closeModal}>

                    </div>
                    <div className="w-5/12 bg-white p-5 ">
                        <div className="flex flex-wrap">
                            {
                                allStock.map((stock) => {
                                    if (stock.qty > stock.warningAt) {
                                        return null
                                    }
                                    return (
                                        <div className="w-auto h-10 border border-gray2 bg-gray1 rounded-md p-2 m-1 flex">
                                            <p>{stock.name}</p>
                                            <span className="rounded-full bg-red px-2 ml-2 text-white">{stock.qty}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                </div> : null}

        </div>
    )
}

export default ReStock
