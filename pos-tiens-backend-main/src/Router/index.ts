import { Router } from "express";
import StaffTypeRoutes from "./UserTypeRoutes";
import StaffRoutes from "./UserRoutes";
import AuthRoutes from "./AuthRoutes";
import CategoriesRoutes from "./CategoriesRoutes";
import StockRoutes from "./StockRoutes";
import ExpensesRoutes from "./ExpensesRoutes";
import SalesRoutes from "./SalesRoutes";
import CustomerRoutes from "./CustomerRoutes";
import AccountRoutes from "./LoanRoutes";
import BankingRoutes from "./BankingRoutes";
import ActivityLogsRoutes from "./ActivityLogsRoutes";
import ShopRoutes from "./ShopRoutes";
import PackageRoutes from "./PackageRoutes";

const router = Router();

export default (): Router => {
  StaffTypeRoutes(router);
  StaffRoutes(router);
  AuthRoutes(router);
  CategoriesRoutes(router);
  StockRoutes(router);
  ExpensesRoutes(router);
  SalesRoutes(router);
  CustomerRoutes(router);
  AccountRoutes(router);
  BankingRoutes(router);
  ActivityLogsRoutes(router);
  ShopRoutes(router);
  PackageRoutes(router);
  return router;
};
