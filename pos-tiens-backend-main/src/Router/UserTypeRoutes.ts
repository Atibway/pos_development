import { Router } from "express";

import {
  fetchUserTypes,
  modifyUserType,
  removeUserType,
  createUserType,
} from "../Controllers/UserTypesController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

export default (router: Router) => {
  const UserTypePrefix = "/staffTypes";
  router.get(`${UserTypePrefix}`, JWTAuthMiddleWare, fetchUserTypes);
  router.post(`${UserTypePrefix}`, JWTAuthMiddleWare,withActivityLog("Creating Account", (req) => req.body, createUserType));
  router.put(`${UserTypePrefix}`, JWTAuthMiddleWare,withActivityLog("Creating Account", (req) => req.body, modifyUserType));
  router.post(`${UserTypePrefix}/:id`, JWTAuthMiddleWare, withActivityLog("Deleted User Types", (req) => req.body, removeUserType) );
};
