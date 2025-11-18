import { Router } from "express";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import {
  createLoanController,
  payLoanController,
  getLoansController,
} from "../Controllers/LoanController";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

export default (router: Router) => {
  const loanPrefix = "/loans";

  router.post(
    `${loanPrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Creating Loan", (req) => req.body, createLoanController)
  );

  router.post(
    `${loanPrefix}/pay`,
    JWTAuthMiddleWare,
    withActivityLog("Paying Loan", (req) => req.body, payLoanController)
  );

  router.get(
    `${loanPrefix}`,
    JWTAuthMiddleWare,
    getLoansController
  );
};
