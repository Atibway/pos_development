import { Router } from "express";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import {
  createCustomerController,
  getCustomersController,
  deleteCustomerController,
  updateCustomerController
} from "../Controllers/CustomersController";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";


export default (router: Router) => {
  const customerPrefix = "/customers";
  router.get(`${customerPrefix}`, JWTAuthMiddleWare, getCustomersController);
  router.post(`${customerPrefix}`, JWTAuthMiddleWare, withActivityLog("Creating Account", (req) => req.body, createCustomerController) );
  router.delete(`${customerPrefix}/:id`, JWTAuthMiddleWare,withActivityLog("Creating Account", (req) => req.body, deleteCustomerController) );
  router.put(`${customerPrefix}`, JWTAuthMiddleWare,  withActivityLog("Creating Account", (req) => req.body, updateCustomerController));
}
