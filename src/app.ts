import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import logger from "./util/logger";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET, SORACOM_AUTH } from "./util/secrets";
import * as WebSocket from "ws";
import errorHandler from "errorhandler";


const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// API keys and Passport configuration
import apiRouter from "./routers/api";
import reactRouter from "./routers/react";
import * as http from "http";
import MessageBinder from "./util/messageBinder";
import Soracom, { ISoracomAuth } from "./util/soracom";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, {useMongoClient: true}).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/api", apiRouter);
app.use(reactRouter);

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
// TODO: Hook up to database handler to log incoming messages
// TODO: Allow defining broker addr using env-var
new MessageBinder(wss, "mqtt://mqtt.stag9.com:1883");

/**
 * Start that server
 */
server.listen(app.get("port"), () => {
  console.log(
    `  App is running at ${server.address().toString()} in ${app.get("env")} mode`,
  );
  console.log("  Press CTRL-C to stop\n");
});

export default app;
