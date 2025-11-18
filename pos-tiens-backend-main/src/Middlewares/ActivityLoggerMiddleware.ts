import { Request, Response, NextFunction } from "express";
import { saveActivityLog } from "../Entities/ActivityLogs";

export const withActivityLog = (
  action: string,
  description: (req: Request) => string | undefined, // optional: can be replaced
  handler: (req: Request, res: Response, next: NextFunction) => any
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Log the incoming request body

      // Run the original handler
      await handler(req, res, next);
      // console.log("📥 req.body: 1", req.body);
      const userId = (req as any).user?.id;
      // console.log("📥 req.body: 2", userId);
      if (userId) {
        const logData = JSON.stringify(req.body); // convert to string for saving
        // console.log("📝 Saving activity log:", { userId, action, logData });

        await saveActivityLog(userId, action, logData);
      }
    } catch (err) {
      console.error("❌ Activity log middleware error:", err);
      next(err);
    }
  };
};
