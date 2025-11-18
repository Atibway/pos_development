import { Router } from "express";
import {
  fetchCategories,
  modifyCategories,
  removeCategories,
  createCategories,
} from "../Controllers/CategoriesController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

export default (router: Router) => {
  const categoryPrefix = "/categories";
  router.get(`${categoryPrefix}`, JWTAuthMiddleWare, fetchCategories);
  router.post(
    `${categoryPrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Added Category", (req) => req.body, createCategories)
  );
  router.put(
    `${categoryPrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Updated category", (req) => req.body, modifyCategories)
  );
  router.post(
    `${categoryPrefix}/:id`,
    JWTAuthMiddleWare,
    withActivityLog("Deleted category", (req) => req.body, removeCategories)
  );
};
