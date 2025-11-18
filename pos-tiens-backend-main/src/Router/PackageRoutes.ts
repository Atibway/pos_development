import { Router } from "express";
import {
  fetchPackages,
  createPackage,
  modifyPackage,
  removePackage,
  payPackage,
} from "../Controllers/PackageController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

export default (router: Router) => {
  const packagePrefix = "/packages";

  //  Fetch all packages
  router.get(
    `${packagePrefix}`,
    JWTAuthMiddleWare,
    fetchPackages
  );

  //  Create a new package
  router.post(
    `${packagePrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Created Package", (req) => req.body, createPackage)
  );

  //  Update a package
  router.put(
    `${packagePrefix}`,
    JWTAuthMiddleWare,
    withActivityLog("Updated Package", (req) => req.body, modifyPackage)
  );

  //  Delete a package by ID
  router.delete(
    `${packagePrefix}/:id`,
    JWTAuthMiddleWare,
    withActivityLog("Deleted Package", (req) => req.body, removePackage)
  );

  //  Mark package as paid
  router.post(
    `${packagePrefix}/pay`,
    JWTAuthMiddleWare,
    withActivityLog("Marked Package as Paid", (req) => req.body, payPackage)
  );
};
