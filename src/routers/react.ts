import { Request, Response, NextFunction } from "express";
import express from "express";
import * as path from "path";

const reactRouter = express.Router();

const reactAppRoot = path.join(__dirname, "../../fe/build");

// Configure static handler
reactRouter.use(
  "/",
  express.static(reactAppRoot, { maxAge: 31557600000 }) // TODO: Fix static serving path
);

// Anything not matching a file should be given index.html (for now)
reactRouter.get("*", (req: Request, res: Response, next: Function) => {
  res.sendFile(`${reactAppRoot}/index.html`);
});

export default reactRouter;
