const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "食譜標題 未填寫"],
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "食譜描述 未填寫"],
    },
    steps: [
      {
        stepNum: {
          type: Number,
          required: [true, "食譜順序 未填寫"],
        },
        stepContent: {
          type: String,
          required: [true, "食譜步驟內容 未填寫"],
        },
      },
    ],
    cookingTime: {
      type: String,
      required: [true, "烹飪時間 未填寫"],
    },
    ingredients: [
      {
        ingredientName: {
          type: String,
          required: [true, "食材名稱 未填寫"],
        },
        ingredientQty: {
          type: String,
          required: [true, "食材份量 未填寫"],
        },
      },
    ],
    notes: {
      type: String,
    },
    // 關聯 user model
    user: {
      // 使 type 改為認定 ObjectId 格式
      type: mongoose.Schema.ObjectId,
      // 告知是哪個 collections 的 id => 連接 user collection
      // ref 為參照位置(對應 collection)
      ref: "user",
      required: [true, "用戶 ID 未填寫"],
    },
  },
  {
    // 不顯示預設在 document 中加上的 __v: 0
    versionKey: false,
    // 自動建立 createdAt、updatedAt
    timestamps: true,
  }
);

// mongoose 會將 Recipe 轉換為全小寫及複數來呈現，因此 Recipe 會被視為 recipes
// 若需要更改 可以增加 `{ collection: '...' })` 語法，範例 `new mongoose.Schema({..}, { collection: 'data' });`
const Recipe = new mongoose.model("recipe", recipeSchema);

module.exports = Recipe;
