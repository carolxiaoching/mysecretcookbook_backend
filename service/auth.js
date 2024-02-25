const jwt = require("jsonwebtoken"); // 密碼加解密
const resSuccess = require("./resSuccess");
const handleErrorAsync = require("./handleErrorAsync");
const appError = require("./appError");
const User = require("../models/user");

// 驗證 token
const checkToken = handleErrorAsync(async (req, res, next) => {
  let token = "";

  // 取得 headers 中的 token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  // 若 token 不存在
  if (!token) return appError(401, "尚未登入！", next);

  // 驗證 token，若正確會回傳資料，錯誤則由 handErrorAsync 接收
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

  // 將資料塞到自訂的 req.authId 中
  req.authId = decoded.id;

  next();
});

// 利用 token 取得的 id 來取得會員資訊
const getAuth = handleErrorAsync(async (req, res, next) => {
  const user = await User.findById(req.authId).select("+role");
  if (!user) return appError(401, "查無此會員 ID", next);

  // 將資料塞到自訂的 req.auth 中
  req.auth = user;

  next();
});

// 驗證是否為管理員
const isAdmin = handleErrorAsync(async (req, res, next) => {
  const { role } = req.auth;

  if (role == "admin") return next();

  return appError(400, "權限不足！", next);
});

// 產生 JWT token 並回傳用戶資料
const generateAndSendJWT = (res, statusCode, user) => {
  // 產生 token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  // 將傳入的密碼清空，避免不小心外洩
  user.password = undefined;
  const data = {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      gender: user.gender,
    },
  };

  resSuccess(res, statusCode, data);
};

module.exports = { checkToken, getAuth, isAdmin, generateAndSendJWT };
