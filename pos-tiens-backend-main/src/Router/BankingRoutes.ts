import { Router } from "express";
import {
  fetchBankings,
  handleUpdating,
  removeBanking,
  handleAddBankings,
} from "../Controllers/BankingController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

export default (router: Router) => {
  const BankingPrefix = "/bankings";
  router.get(`${BankingPrefix}`, JWTAuthMiddleWare, fetchBankings);
  router.post(
    `${BankingPrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Adding Bankings", (req) => req.body, handleAddBankings)
  );

  router.put(
    `${BankingPrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Updating banking", (req) => req.body, handleUpdating)
  );
  router.post(
    `${BankingPrefix}/:id`,
    JWTAuthMiddleWare,
    withActivityLog("Deleting Banking record", (req) => req.body, removeBanking)
  );
};
