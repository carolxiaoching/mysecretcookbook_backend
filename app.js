const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const { resErrorProd, resErrorDev } = require("./service/resErrors");

const recipesRouter = require("./routes/recipes");
const usersRouter = require("./routes/users");
const uploadRouter = require("./routes/upload");

const app = express();

// 當程式出現重大錯誤時
process.on("uncaughtException", (err) => {
  // 記錄錯誤，等服務處理完，停掉該 process
  console.error("Uncaught Exception");
  console.error("錯誤名稱: ", err.name); // 錯誤名稱
  console.error("錯誤訊息: ", err.message); // 錯誤訊息
  console.error("Node.js 專有 stack:", err.stack); // Node.js 專有
  // 跳出，系統離開
  process.exit(1);
});

// 連接 mongoDB
require("./connections");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(recipesRouter);
app.use(usersRouter);
app.use(uploadRouter);
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// 404 錯誤
app.use((req, res, next) => {
  res.status(404).send({
    status: "error",
    message: "無此網站路由",
  });
});

// 錯誤 middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // development 模式
  if (process.env.NODE_ENV === "development") {
    return resErrorDev(err, res);
  }

  // production 模式

  // jwt 錯誤
  if (err.name === "TokenExpiredError") {
    err.isOperational = true;
    err.statusCode = 401;
    err.message = "使用者已登出，請重新登入";
    return resErrorProd(err, res);
  }

  // ValidationError 資料驗證錯誤 - mongoose 自訂錯誤
  if (err.name === "ValidationError") {
    err.isOperational = true;
    err.statusCode = 400;
    err.message = "資料欄位未填寫正確，請重新輸入！";
    return resErrorProd(err, res);
  }

  // 語法錯誤
  if (err.name === "SyntaxError") {
    err.isOperational = true;
    err.statusCode = 400;
    err.message = "格式錯誤，請重新確認！";
    return resErrorProd(err, res);
  }

  // 資料格式錯誤
  if (err.name === "CastError") {
    err.isOperational = true;
    err.statusCode = 400;
    err.message = "格示錯誤，請重新確認！";
    return resErrorProd(err, res);
  }

  // 因不符合 mongodb unique 規則出現錯誤
  if (err.code === 11000) {
    err.message = "Email 已被使用, 請更改 Email!";
    err.statusCode = 400;
    err.isOperational = true;
    return resErrorProd(err, res);
  }

  if (err.name === "MulterError") {
    err.statusCode = 400;
    err.isOperational = true;
    err.message = "圖檔名稱未設定!";
    return resErrorProd(err, res);
  }

  // 捕捉漏網之魚
  resErrorProd(err, res);
});

// 未捕捉到的 catch
process.on("unhandledRejection", (err, promise) => {
  console.error("未捕捉到的 Rejection", promise);
  console.error("原因： ", err);
});

module.exports = app;
