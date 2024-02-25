const mongoose = require("mongoose");
const validator = require("validator");
const appError = require("../service/appError");
const resSuccess = require("../service/resSuccess");
const User = require("../models/user");
const Recipe = require("../models/recipe");

const RecipeControllers = {
  // 取得所有食譜
  async getRecipes(req, res, next) {
    // 排序
    // asc 遞增(由小到大，由舊到新)：createdAt
    // desc 遞減(由大到小、由新到舊)：-createdAt
    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";

    // 關鍵字搜尋
    const filter =
      req.query.keyword !== undefined
        ? { title: new RegExp(req.query.keyword) }
        : {};

    const recipes = await Recipe.find(filter)
      .populate({
        path: "user",
        select: "name avatar",
      })
      .sort(sort);

    resSuccess(res, 200, recipes);
  },
  // 取得指定用戶所有食譜
  async getUserRecipes(req, res, next) {
    const { userId } = req.params;
    const { auth } = req;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(userId))
      return appError(400, "查無此用戶！", next);

    // 驗證此用戶 ID 是否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) return appError(400, "查無此用戶！", next);

    // 限定權限為會員本人及管理者
    if (auth.id !== userId && auth.role !== "admin")
      return appError(400, "權限不足！", next);

    // 排序
    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";

    // 關鍵字搜尋
    const filter =
      req.query.keyword !== undefined
        ? { title: new RegExp(req.query.keyword), user: userId }
        : { user: userId };

    const recipes = await Recipe.find(filter)
      .populate({
        path: "user",
        select: "name avatar",
      })
      .sort(sort);

    resSuccess(res, 200, recipes);
  },
  // 取得指定食譜
  async getRecipe(req, res, next) {
    const { recipeId } = req.params;
    const { auth } = req;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(recipeId))
      return appError(400, "查無此食譜！", next);

    // 限定權限為會員本人及管理者
    const filter =
      auth.role === "admin"
        ? { _id: recipeId }
        : { _id: recipeId, user: auth.id };

    const recipe = await Recipe.findOne(filter).populate({
      path: "user",
      select: "name avatar",
    });

    // 若取得失敗
    if (!recipe) return appError(400, "權限不足或查無此食譜！", next);

    resSuccess(res, 200, recipe);
  },
  // 新增食譜
  async createRecipe(req, res, next) {
    const { title, image, description, steps, ingredients, cookingTime } =
      req.body;
    const { auth } = req;

    // 確認是否有傳入值
    if (Object.keys(req.body).length === 0)
      return appError(400, "欄位不得為空！", next);

    // 使用 typeof 事先驗證欄位格式
    if (
      typeof title !== "string" ||
      typeof image !== "string" ||
      typeof description !== "string" ||
      typeof steps !== "object" ||
      typeof ingredients !== "object" ||
      typeof cookingTime !== "string"
    )
      return appError(400, "格式不正確！", next);

    // 確認欄位是否填寫正確
    if (
      !title.trim() ||
      !image.trim() ||
      !description.trim() ||
      !steps.length ||
      !ingredients.length ||
      !cookingTime.trim()
    )
      return appError(400, "欄位不得為空！", next);

    //  驗證食譜步驟、食材是否有值
    if (!Object.keys(steps).length || !Object.keys(ingredients).length)
      return appError(400, "欄位不得為空！", next);

    // 驗證圖片是否為 http、https 開頭
    if (!validator.isURL(image, { protocols: ["http", "https"] }))
      return appError(400, "圖片網址格式未填寫正確！", next);

    // 新增資料
    const newRecipe = await Recipe.create({
      user: auth.id,
      title,
      image,
      description,
      steps,
      ingredients,
      cookingTime,
    });

    resSuccess(res, 200, newRecipe);
  },
  // 修改食譜
  async updateRecipe(req, res, next) {
    const { recipeId } = req.params;
    const { title, image, description, steps, ingredients, cookingTime } =
      req.body;
    const val = req.body;
    const { auth } = req;
    const keys = Object.keys(req.body);

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(recipeId))
      return appError(400, "查無此食譜！", next);

    // 確認是否有傳入值
    if (keys.length === 0) return appError(400, "欄位不得為空！", next);

    // 使用 typeof 事先驗證欄位格式
    if (
      typeof title != "string" &&
      typeof description != "string" &&
      typeof cookingTime !== "string" &&
      typeof image != "string" &&
      typeof steps != "object" &&
      typeof ingredients !== "object"
    )
      return appError(400, "格式不正確！", next);

    // 若有傳入標題，則標題不得為空
    if (keys.indexOf("title") !== -1 && !title.trim())
      return appError(400, "標題不得為空！", next);

    // 若有傳入描述，則描述不得為空
    if (keys.indexOf("description") !== -1 && !description.trim())
      return appError(400, "描述不得為空！", next);

    // 若有傳入烹飪時間，則烹飪時間不得為空
    if (keys.indexOf("cookingTime") !== -1 && !cookingTime.trim())
      return appError(400, "烹飪時間不得為空！", next);

    //  驗證食譜步驟是否有值
    if (keys.indexOf("steps") !== -1 && !Object.keys(steps).length)
      return appError(400, "食譜步驟不得為空！", next);

    //  驗證食材是否有值
    if (keys.indexOf("ingredients") !== -1 && !Object.keys(ingredients).length)
      return appError(400, "食材欄位不得為空！", next);

    // 若有傳入圖片，驗證圖片是否為 http、https 開頭
    if (
      keys.indexOf("image") !== -1 &&
      !validator.isURL(image, { protocols: ["http", "https"] })
    )
      return appError(400, "頭像格式未填寫正確！", next);

    // 限定權限為會員本人及管理者
    const filter =
      auth.role === "admin"
        ? { _id: recipeId }
        : { _id: recipeId, user: auth.id };

    // 找到並更新食譜資料
    const newRecipe = await Recipe.findOneAndUpdate(
      filter,
      {
        user: auth.id,
        title,
        image,
        description,
        steps,
        ingredients,
        cookingTime,
      },
      {
        // 回傳更新後的值
        new: true,
        // 使 findByIdAndUpdate 跑 Schema 驗證規則
        runValidators: true,
      }
    );

    // 若取得失敗
    if (!newRecipe) return appError(400, "權限不足或查無此食譜！", next);

    resSuccess(res, 200, newRecipe);
  },
  // 刪除所有食譜
  async delAllRecipes(req, res, next) {
    await Recipe.deleteMany({});
    resSuccess(res, 200, []);
  },
  // 刪除指定用戶所有食譜
  async delUserAllRecipes(req, res, next) {
    const { userId } = req.params;
    const { auth } = req;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(userId))
      return appError(400, "查無此用戶！", next);

    // 判斷此用戶 ID 是否存在 - 找不到會回傳 null
    const isEixst = await User.findById(userId).exec();
    if (!isEixst) return appError(400, "查無此用戶", next);

    // 限定權限為會員本人及管理者
    if (auth.id !== userId && auth.role !== "admin")
      return appError(400, "權限不足！", next);

    await Recipe.deleteMany({ user: userId });

    resSuccess(res, 200, []);
  },
  // 刪除指定食譜
  async delRecipe(req, res, next) {
    const { recipeId } = req.params;
    const { auth } = req;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(recipeId))
      return appError(400, "查無此食譜！", next);

    // 驗證此食譜 ID 是否存在 - 找不到會回傳 null
    const isExist = await Recipe.findById(recipeId).exec();
    if (!isExist) return appError(400, "查無此食譜！", next);

    // 限定權限為會員本人及管理者
    const filter =
      auth.role === "admin"
        ? { _id: recipeId }
        : { _id: recipeId, user: auth.id };

    // 找到此食譜並刪除
    const delRecipe = await Recipe.findOneAndDelete(filter, {
      new: true,
    });

    // 若刪除失敗
    if (!delRecipe) return appError(400, "權限不足或查無此食譜！", next);

    resSuccess(res, 200, delRecipe);
  },
};

module.exports = RecipeControllers;
