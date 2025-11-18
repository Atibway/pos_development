import { Router } from "express";
import {
  fetchShops,
  removeShop,
  HandleCreateShop,
  HandleUpdateShop,
  HandleAssignStocks,
  HandleRemoveStockFromShop,
  HandleGetShopStockByUserId,
  HandleClearStocksFromShop,
} from "../Controllers/ShopController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

export default (router: Router) => {
  const ShopPrefix = "/shops";

  //  Fetch all shops
  router.get(`${ShopPrefix}`, JWTAuthMiddleWare, fetchShops);

  //  Create shop
  router.post(
    `${ShopPrefix}`,
  JWTAuthMiddleWare,
    withActivityLog("Adding Shop", (req) => req.body, HandleCreateShop)
  );

  //  Update shop
  router.put(
    `${ShopPrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Updating Shop", (req) => req.body, HandleUpdateShop)
  );

  // //  Delete shop
  router.delete(
    `${ShopPrefix}/:id`,
    JWTAuthMiddleWare,
    withActivityLog("Deleting Shop", (req) => req.body, removeShop)
  );

  //  Assign stocks to shop
  router.post(
    `${ShopPrefix}/assign-stocks`,
     JWTAuthMiddleWare,
    withActivityLog("Assigning Stocks to Shop", (req) => req.body, HandleAssignStocks)
  );

  //  Remove single stock from shop
  // router.post(
  //   `${ShopPrefix}/remove-stock`,
  //   JWTAuthMiddleWare,
  //   withActivityLog("Removing Stock from Shop", (req) => req.body, HandleRemoveStockFromShop)
  // );

  //  Get all stocks in a shop
  router.get(
    `${ShopPrefix}/:id`,
    JWTAuthMiddleWare,
    HandleGetShopStockByUserId
  );

  //  Clear all stocks from a shop
  // router.post(
  //   `${ShopPrefix}/:id/clear-stocks`,
  //   JWTAuthMiddleWare,
  //   withActivityLog("Clearing Stocks from Shop", (req) => req.body, HandleClearStocksFromShop)
  // );
};
