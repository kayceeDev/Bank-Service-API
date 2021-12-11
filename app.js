const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorControllers");
const userRouter = require("./routes/userRoutes");

const app = express();

//  GLOBAL MIDDLEWARE
//set HTTP security Headers
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit request from same IP
const limiter = rateLimit({
  max: 20,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in one hour",
});

app.use("/api", limiter);

// Body parser, reads data from req.body
app.use(express.json({ limit: "10kb" })); // middleware function that can modify income data

// data Sanitization againt NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
