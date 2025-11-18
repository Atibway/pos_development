import { Router } from "express";
import {
  fetchExpenses,
  modifyExpense,
  removeExpense,
  addExpenses,
  searchExpensesController
} from "../Controllers/ExpensesController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

export default (router: Router) => {
  const expensePrefix = "/expenses";
  router.get(`${expensePrefix}`, JWTAuthMiddleWare, fetchExpenses);
  router.post(`${expensePrefix}`, JWTAuthMiddleWare, withActivityLog("Creating Account", (req) => req.body, addExpenses) );
  router.put(`${expensePrefix}`, JWTAuthMiddleWare, withActivityLog("Creating Account", (req) => req.body, modifyExpense) );
  router.delete(`${expensePrefix}/:id`, JWTAuthMiddleWare, withActivityLog("Creating Account", (req) => req.body, removeExpense) );
  router.get(`${expensePrefix}/search`, JWTAuthMiddleWare, searchExpensesController);
};
