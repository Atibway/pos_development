import { Request, Response } from "express";

import {
  getBankings,
  updateBanking,
  addBankings,
  deleteBanking,
  getBankingById,
  // getBankingsByDate,
  // searchBankings,
} from "../Entities/Banking";

import { customPayloadResponse } from "../Helpers/Helpers";

export const fetchBankings = async (req: Request, res: Response) => {
  try {
    const Bankings = await getBankings();
    return res.json(customPayloadResponse(true, Bankings)).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const handleAddBankings = async (req: Request, res: Response) => {
  try {
    const { date, amount, comment } = req.body;
    await addBankings(date, amount, comment);
    return res
      .json(customPayloadResponse(true, "Banking Added"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const handleUpdating = async (req: Request, res: Response) => {
  try {
    const { id, date, amount, comment } = req.body;
    const BankingUpdate = await getBankingById(id);
    if (BankingUpdate) {
      await updateBanking(id, date, amount, comment);
      return res
        .json(customPayloadResponse(true, "Banking Updated"))
        .status(200)
        .end();
    }
    return res
      .json(customPayloadResponse(false, "Banking not Found"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const removeBanking = async (req: Request, res: Response) => {
  try {
    const BankingId = parseInt(req.params.id);
    const BankingToDelete = await getBankingById(BankingId);
    if (BankingToDelete) {
      await deleteBanking(BankingId);
      return res
        .json(customPayloadResponse(true, "Banking Deleted"))
        .status(200)
        .end();
    }
    return res
      .json(customPayloadResponse(false, "Banking not Found"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// export const searchBankingsController = async (req: Request, res: Response) => {
//   try {
//     const { search, startDate, endDate, type } = req.query;

//     const Bankings = await getBankingsByDate(
//       search ? search.toString() : null,
//       startDate ? startDate.toString() : null,
//       endDate ? endDate.toString() : null,
//       type ? type.toString() : null
//     );

//     return res.json(customPayloadResponse(true, Bankings)).status(200).end();
//   } catch (error) {
//     console.log(error);
//return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
//     return res
//       .json(customPayloadResponse(false, "Internal Server Error"))
//       .status(500)
//       .end();
//   }
// };
