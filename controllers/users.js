const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const { generateAndSendJWT } = require("../service/auth");
const User = require("../models/user");
const Recipe = require("../models/recipe");

const UserControllers = {
  // 註冊
  async signUp(req, res, next) {
    const { name, email, password } = req.body;

    // 確認是否有傳入值
    if (Object.keys(req.body).length === 0)
      return appError(400, "欄位不得為空！", next);

    // 驗證欄位格式
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    )
      return appError(400, "欄位格式不正確！", next);

    // 確認欄位是否填寫正確
    if (!name.trim() || !email.trim() || !password.trim())
      return appError(400, "欄位不得為空！", next);

    // 驗證暱稱至少 2 個字元以上
    if (!validator.isLength(name, { min: 2 }))
      return appError(400, "暱稱需為 2 個字元以上！", next);

    // 驗證密碼格式
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
    )
      return appError(400, "密碼需為英數混和且為 8 個字元以上！", next);

    // 驗證電子郵件格式
    if (!validator.isEmail(email))
      return appError(400, "電子郵件格式不正確！", next);

    // 驗證電子郵件是否已被使用
    const checkEmailUnique = await User.findOne({ email });
    if (checkEmailUnique) return appError(400, "此信箱已被使用！", next);

    // 將密碼加密
    const newPassword = await bcrypt.hash(password, 12);

    // 新增資料
    const newUser = await User.create({
      name,
      email,
      password: newPassword,
    });

    // 產生 JWT token 並回傳會員資料
    generateAndSendJWT(res, 201, newUser);
  },
  // 登入
  async signIn(req, res, next) {
    const { email, password } = req.body;

    // 確認是否有傳入值
    if (Object.keys(req.body).length === 0) {
      return appError(400, "欄位不得為空！", next);
    }

    // 驗證欄位格式
    if (typeof email !== "string" || typeof password !== "string") {
      return appError(400, "欄位格式不正確！", next);
    }

    // 確認欄位是否填寫正確
    if (!email.trim() || !password.trim()) {
      return appError(400, "欄位不得為空！", next);
    }

    // 驗證電子郵件格式
    if (!validator.isEmail(email)) {
      return appError(400, "電子郵件格式不正確！", next);
    }

    // 取出 user 資料
    const user = await User.findOne({ email }).select("+password");

    // 驗證電子郵件是否已註冊
    if (!user) {
      return appError(400, "此帳號尚未被註冊過！", next);
    }

    // 比對密碼是否與資料庫的相符
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return appError(400, "密碼錯誤！", next);
    }

    // 產生 JWT token 並回傳會員資料
    generateAndSendJWT(res, 200, user);
  },
  // 重設密碼
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;
    const { auth } = req;

    console.log(auth);

    // 確認是否有傳入值
    if (Object.keys(req.body).length === 0)
      return appError(400, "欄位不得為空！", next);

    // 驗證欄位格式
    if (typeof password !== "string" || typeof confirmPassword !== "string")
      return appError(400, "欄位格式不正確！", next);

    // 確認欄位是否填寫正確
    if (!password.trim() || !confirmPassword.trim())
      return appError(400, "欄位不得為空！", next);

    // 驗證密碼與確認密碼是否相同
    if (password !== confirmPassword)
      return appError(400, "密碼不一致！", next);

    // 驗證密碼格式
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
    )
      return appError(400, "密碼需為英數混和、英文且為 8 個字元以上！", next);

    // 驗證原密碼與新密碼是否相同
    const userOriginal = await User.findById(auth.id).select("+password");
    const comparePassword = await bcrypt.compare(
      password,
      userOriginal.password
    );
    if (comparePassword)
      return next(appError(400, "新密碼與原密碼相同！", next));

    // 將密碼加密
    const newPassword = await bcrypt.hash(password, 12);

    // 更新資料庫中密碼
    const newUser = await User.findByIdAndUpdate(auth.id, {
      password: newPassword,
    });

    console.log("newUser", newUser);

    // 產生 JWT token 並回傳會員資料
    generateAndSendJWT(res, 200, newUser);
  },
  // 取得指定會員資料
  async getUser(req, res, next) {
    const { userId } = req.params;
    const { auth } = req;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(userId))
      return appError(400, "查無此會員！", next);

    // 驗證此會員 ID 是否存在 - 找不到會回傳 null
    const isExist = await User.findById(userId).exec();
    if (!isExist) return appError(400, "查無此會員！", next);

    // 限定權限為會員本人及管理者
    if (auth.id !== userId && auth.role !== "admin")
      return appError(400, "權限不足！", next);

    const user = await User.findById(userId);
    resSuccess(res, 200, user);
  },
  // 更新指定會員資料
  async updateUser(req, res, next) {
    const { name, gender, avatar } = req.body;
    const { userId } = req.params;
    const { auth } = req;
    const keys = Object.keys(req.body);

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(userId))
      return appError(400, "查無此會員！", next);

    // 驗證此會員 ID 是否存在 - 找不到會回傳 null
    const isExist = await User.findById(userId).exec();
    if (!isExist) return appError(400, "查無此會員！", next);

    // 限定權限為會員本人及管理者
    if (auth.id !== userId && auth.role !== "admin")
      return appError(400, "權限不足！", next);

    // 確認是否有傳入值
    if (keys.length === 0) return appError(400, "欄位不得為空！", next);

    // 驗證欄位格式
    if (
      typeof name !== "string" &&
      typeof gender !== "string" &&
      typeof avatar !== "string"
    )
      return appError(400, "欄位格式不正確！", next);

    // 若有傳入暱稱，則確認暱稱至少 2 個字元以上
    if (keys.indexOf("name") !== -1 && !validator.isLength(name, { min: 2 }))
      return appError(400, "暱稱需為 2 個字元以上！", next);

    // 若有傳入性別，則性別不得為空
    if (keys.indexOf("gender") !== -1 && !gender.trim())
      return appError(400, "性別不得為空！", next);

    // 若有傳入頭像，驗證頭像是否為 http、https 開頭
    if (
      keys.indexOf("avatar") !== -1 &&
      !validator.isURL(avatar, { protocols: ["http", "https"] })
    )
      return appError(400, "頭像格式未填寫正確！", next);

    // 找到並更新會員資料
    const newUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        gender,
        avatar,
      },
      {
        // 回傳更新後的值
        new: true,
        // 使 findByIdAndUpdate 跑 Schema 驗證規則
        runValidators: true,
      }
    );

    // 產生 JWT token 並回傳會員資料
    generateAndSendJWT(res, 200, newUser);
  },
  // 取得所有會員
  async getUsers(req, res, next) {
    // 排序
    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";

    // 關鍵字搜尋
    const filter =
      req.query.keyword !== undefined
        ? { content: new RegExp(req.query.keyword) }
        : {};

    const users = await User.find(filter);
    resSuccess(res, 200, users);
  },
  // 刪除所有會員
  async delAllUsers(req, res, next) {
    // 刪除所有會員
    await User.deleteMany({});

    // 同步刪除所有食譜
    await Recipe.deleteMany({});

    resSuccess(res, 200, []);
  },
  // 刪除指定會員
  async delUser(req, res, next) {
    const { userId } = req.params;
    const { auth } = req;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(userId))
      return appError(400, "查無此會員！", next);

    // 驗證此會員 ID 是否存在 - 找不到會回傳 null
    const isExist = await User.findById(userId).exec();
    if (!isExist) return appError(400, "查無此會員！", next);

    // 限定權限為會員本人及管理者
    if (auth.id !== userId && auth.role !== "admin")
      return appError(400, "權限不足！", next);

    // 找到此會員並刪除
    const delUser = await User.findByIdAndDelete(userId, {
      new: true,
    });

    // 若刪除失敗
    if (!delUser) return appError(400, "刪除失敗！", next);

    // 同步刪除指定會員所有食譜
    await Recipe.deleteMany({ user: userId });

    resSuccess(res, 200, delUser);
  },
};

module.exports = UserControllers;
