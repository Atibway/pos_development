import { Router } from "express";
import {
  fetchStocks,
  modifyStock,
  removeStock,
  addStock,
  handleRestock,
  handleSearchStock,
  handleGetAllStocks,
  handleGetTopStocks,
  handleGetHalfPriceStocks,
} from "../Controllers/StockController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

export default (router: Router) => {
  const stokPrefix = "/stock";
  router.get(`${stokPrefix}`, JWTAuthMiddleWare, fetchStocks);
  router.post(
    `${stokPrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Add stock", (req) => req.body, addStock)
  );
  router.put(
    `${stokPrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Updated stock", (req) => req.body, modifyStock)
  );
  router.delete(
    `${stokPrefix}/:id`,
    JWTAuthMiddleWare,
    withActivityLog("Deleted stock", (req) => req.body, removeStock)
  );
  router.put(
    `${stokPrefix}/restock`,
    JWTAuthMiddleWare,
    withActivityLog("Restocking", (req) => req.body, handleRestock)
  );
  router.get(`${stokPrefix}/search`, JWTAuthMiddleWare, handleSearchStock);
  router.get(`${stokPrefix}/all`, JWTAuthMiddleWare, handleGetAllStocks);
  router.get(`${stokPrefix}/top`, JWTAuthMiddleWare, handleGetTopStocks);
  router.get(`${stokPrefix}/halfprice`, JWTAuthMiddleWare, handleGetHalfPriceStocks);
};


