import { Request, Response } from "express";

import {
  getExpenses,
  updateExpense,
  createExpense,
  deleteExpense,
  getSingleExpense,
  getExpensesByDate,
  searchExpenses
} from "../Entities/Expense";

import { customPayloadResponse } from "../Helpers/Helpers";

export const fetchExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await getExpenses();
    return res.json(customPayloadResponse(true, expenses)).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const addExpenses = async (req: Request, res: Response) => {
  try {
    const { 
      date,
      amount,
      expense,
      receivedBy,
      type,
     } = req.body;
    await createExpense(
      date,
    amount,
    expense,
    receivedBy,
    type,);
    return res
      .json(customPayloadResponse(true, "Expense Added"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const modifyExpense = async (req: Request, res: Response) => {
  try {
    const {
      id,
      date,
      amount,
      expense,
      receivedBy,
      type, } = req.body;
    const expenseUpdate = await getSingleExpense(id);
    if (expenseUpdate) {
      await updateExpense(id,
        date,
        amount,
        expense,
        receivedBy,
        type,
        );
      return res
        .json(customPayloadResponse(true, "Expense Updated"))
        .status(200)
        .end();
    }
    return res
      .json(customPayloadResponse(false, "Expense not Found"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};


export const removeExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = parseInt(req.params.id);
    const expenseToDelete = await getSingleExpense(expenseId);
    if (expenseToDelete) {
      await deleteExpense(expenseId);
      return res
        .json(customPayloadResponse(true, "Expense Deleted"))
        .status(200)
        .end();
    }
    return res
      .json(customPayloadResponse(false, "Expense not Found"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};





export const searchExpensesController = async (req: Request, res: Response) => {
  try {
    const { search, startDate, endDate, type } = req.query;
    
    const expenses = await getExpensesByDate(
      search ? search.toString() : null,
      startDate ? startDate.toString() : null,
      endDate ? endDate.toString() : null,
      type ? type.toString() : null,
    );

    return res
      .json(customPayloadResponse(true, expenses))
      .status(200)
      .end();
  } catch (error) {
    console.log(error)
    return res.json(customPayloadResponse(false, "Internal Server Error")).status(500).end();
  }
}
