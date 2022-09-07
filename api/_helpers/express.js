require("rootpath")();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("../_middleware/error-handler");
const routes = require("../routes");
const helmet = require("helmet");

const app = express();

// request logging. dev: console | production: file
app.use(morgan("common"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors());

// use helmet to secure http headers
app.use(helmet())

// api routes
app.use("/api", routes);

// global error handler
app.use(errorHandler);

module.exports = app;
