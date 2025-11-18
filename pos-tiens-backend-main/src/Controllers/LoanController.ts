import { Request, Response } from "express";
import { customPayloadResponse } from "../Helpers/Helpers";
import { createLoan, payLoan, getLoans } from "../Entities/Loan";

/**
 * Controller to create a new loan linked to a sale and customer
 */
export const createLoanController = async (req: Request, res: Response) => {
  try {
    const { date, amount, customerId, salesId } = req.body;

    if (!date || !amount || !customerId || !salesId) {
      return res.status(400).json(customPayloadResponse(false, "Missing required fields: date, amount, customerId, salesId"));
    }

    const loan = await createLoan(date, amount, customerId, salesId);

    return res.status(201).json(customPayloadResponse(true, loan));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(customPayloadResponse(false, error.message || "Internal Server Error"));
  }
};

/**
 * Controller to record a payment towards a loan
 */
export const payLoanController = async (req: Request, res: Response) => {
  try {
    const { id, amount, date } = req.body;

    if (!id || !amount || !date) {
      return res.status(400).json(customPayloadResponse(false, "Missing required fields: id, amount, date"));
    }

    await payLoan(id, amount, date);

    return res.status(200).json(customPayloadResponse(true, "Loan payment recorded successfully"));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(customPayloadResponse(false, error.message || "Internal Server Error"));
  }
};

/**
 * Controller to fetch all loans with their customer relations
 */
export const getLoansController = async (req: Request, res: Response) => {
  try {
    const loans = await getLoans();

    return res.status(200).json(customPayloadResponse(true, loans));
  } catch (error) {
    console.error(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};
