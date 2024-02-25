const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "請輸入您的名子"],
    },
    gender: {
      type: String,
      // 枚舉
      enum: ["male", "female"],
      default: "male",
    },
    avatar: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "請輸入您的電子信箱"],
      // 去除兩邊空白
      trim: true,
      // 唯一索引
      unique: true,
      // 轉換成全小寫
      lowercase: true,
      // 驗證 email，正規表達式來源： https://ithelp.ithome.com.tw/articles/10094951
      validate: {
        validator(value) {
          return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
            value
          );
        },
        message: "請輸入有效的電子郵件",
      },
    },
    password: {
      type: String,
      required: [true, "請輸入密碼"],
      minLength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      select: false,
    },
  },
  {
    // 不顯示預設在 document 中加上的 __v: 0
    versionKey: false,
    // 自動建立 createdAt、updatedAt
    timestamps: true,
  }
);

// mongoose 會將 User 轉換為全小寫及複數來呈現，因此 User 會被視為 users
// 若需要更改 可以增加 `{ collection: '...' })` 語法，範例 `new mongoose.Schema({..}, { collection: 'data' });`
const User = new mongoose.model("user", userSchema);

module.exports = User;
