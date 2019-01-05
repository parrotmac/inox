"use strict";

import { Response, Request, NextFunction } from "express";

/**
 * GET /api
 * List of API examples.
 */
export let getApi = (req: Request, res: Response, next: NextFunction) => {
  res.json({
    location: "/api/info",
    date_time: Date.now(),
  });
};
