import { Router } from "express";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import {
  createSalesController,
  getSalesByDateController,
  getSalesController,
  searchSalesController,
  getSalesAndExpensesController,
  handleDeleteSale,
  getSalesByShopAndDateController,
  getDailyProfitLossController,   // <-- import new controller
  getMonthlyProfitLossController  // <-- import new controller
} from "../Controllers/SalesController";

import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

export default (router: Router) => {
  const salesPrefix = "/sales";

  // Get all sales, optionally paginated
  router.get(`${salesPrefix}`, JWTAuthMiddleWare, getSalesController);

  // Create new sales
  router.post(
    `${salesPrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Making sales", (req) => req.body, createSalesController)
  );

  // Get sales by shop and date
  router.get(
    `${salesPrefix}/by-shop-date`,
    JWTAuthMiddleWare,
    getSalesByShopAndDateController
  );

  // Get sales filtered by date
  router.get(
    `${salesPrefix}/by-date`,
    JWTAuthMiddleWare,
    getSalesByDateController
  );

  // Search sales by criteria (stock name, date range)
  router.get(`${salesPrefix}/search`, JWTAuthMiddleWare, searchSalesController);

  // Delete a sale by ID
  router.delete(
    `${salesPrefix}/:id`,
    JWTAuthMiddleWare,
    withActivityLog("Deleted a Sale", (req) => req.body, handleDeleteSale)
  );

  // Get combined sales and expenses report
  router.get(
    `${salesPrefix}/report`,
    JWTAuthMiddleWare,
    getSalesAndExpensesController
  );

  // --- New Profit & Loss Routes ---
  
  // Daily profit/loss
  router.get(
    `${salesPrefix}/profit-loss/daily`,
    JWTAuthMiddleWare,
    getDailyProfitLossController
  );

  
  // Monthly profit/loss
  router.get(
    `${salesPrefix}/profit-loss/monthly`,
    JWTAuthMiddleWare,
    getMonthlyProfitLossController
  );
};
