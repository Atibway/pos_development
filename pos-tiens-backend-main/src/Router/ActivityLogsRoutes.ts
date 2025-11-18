import { Router } from "express";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { handleFetchActivityLog } from "../Controllers/ActivityLogsController";

export default (router: Router) => {
  const accountPrefix = "/logs";
  router.get(`${accountPrefix}`, JWTAuthMiddleWare, handleFetchActivityLog);
};
