import { Request, Response } from "express";

import { fetchActivityLog, saveActivityLog } from "../Entities/ActivityLogs";

import { customPayloadResponse } from "../Helpers/Helpers";

export const handleFetchActivityLog = async (req: Request, res: Response) => {
  try {
    const logs = await fetchActivityLog();
    return res.json(customPayloadResponse(true, logs)).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const handleSaveActivityLog = async (req: Request, res: Response) => {
  try {
    const { userId, action, description } = req.body;
    await saveActivityLog(userId, action, description);
    return res
      .json(customPayloadResponse(true, "Banking Added"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};
