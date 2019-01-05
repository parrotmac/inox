import { getApi } from "../controllers/api";
import { Request, Response } from "express";

const apiRouter = require("express").Router();

apiRouter.get("", (req: Request, res: Response, next: Function) => {
  console.log(req);
  const dummyResponseData = {
    "status": "OK",
    "_message": "You're alright",
  };
  res.json(dummyResponseData);
});

apiRouter.get("/info", getApi);

export default apiRouter;
