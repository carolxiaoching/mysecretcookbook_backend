const express = require("express");
const router = express.Router();
const RecipeControllers = require("../controllers/recipes");
const handleErrorAsync = require("../service/handleErrorAsync");
const { checkToken, getAuth, isAdmin } = require("../service/auth");

// 取得所有食譜
router.get(
  "/recipes",
  /**
   * #swagger.tags = ["Recipe 食譜 - 管理員"]
   * #swagger.summary = "取得所有食譜"
   * #swagger.description = "取得所有食譜 - 需管理員權限"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["query"] = [
      {
        in: "query",
        name: "keyword",
        type: "string",
        description: "關鍵字搜尋"
      },
      {
        in: "query",
        name: "sort",
        type: "string",
        description: "排序 asc 舊到新,desc 新到舊"
      }
    ]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": [
          {
            "_id": "65d84d4a86dd40e016997a8c",
            "title": "酥炸洋蔥圈",
            "image": "https://i.imgur.com/vpQY28H.jpg",
            "description": "酥炸洋蔥圈濃厚香氣、酥脆的外皮",
            "steps": [
              {
                "stepNum": 1,
                "stepContent": "洋蔥逆紋切成 1cm 圓圈狀，放入低筋麵粉 4 大匙、2 顆雞蛋混合均勻成的麵衣裡",
                "_id": "65d84d4a86dd40e016997a8d"
              },
              {
                "stepNum": 2,
                "stepContent": "中火加熱至油溫約 160 度將洋蔥放入，炸至二面酥脆金黃即可夾出瀝油",
                "_id": "65d84d4a86dd40e016997a8e"
              }
            ],
            "cookingTime": "5 分鐘",
            "ingredients": [
              {
                "ingredientName": "洋蔥",
                "ingredientQty": "1 顆",
                "_id": "65d8b4e3c6f5e8f6817425f7"
              },
              {
                "ingredientName": "麵粉",
                "ingredientQty": "適量",
                "_id": "65d8b4e3c6f5e8f6817425f7"
              },
              {
                "ingredientName": "雞蛋",
                "ingredientQty": "1 顆",
                "_id": "65d8b4e3c6f5e8f6817425f7"
              }
            ],
            "user": {
              "_id": "65d433ec0e39d8dcfd678a59",
              "name": "Carl",
              "avatar": "https://i.imgur.com/vpQY28H.jpg",
            },
            "createdAt": "2024-02-23T07:46:18.817Z",
            "updatedAt": "2024-02-23T07:46:18.817Z"
          },
          {
            "title": "金針菇煎蛋",
            "image": "https://i.imgur.com/vpQY28H.jpg",
            "description": "輕鬆不失敗煎蛋，簡單開胃。",
            "steps": [
              {
                "stepNum": 1,
                "stepContent": "金針菇切段，放入油鍋煎炒",
                "_id": "65d8b4e3c6f5e8f6817425f5"
              },
              {
                "stepNum": 2,
                "stepContent": "加入雞蛋，二面煎熟即可",
                "_id": "65d8b4e3c6f5e8f6817425f6"
              }
            ],
            "cookingTime": "10 分鐘",
            "ingredients": [
              {
                "ingredientName": "金針菇",
                "ingredientQty": "1 把",
                "_id": "65d8b4e3c6f5e8f6817425f7"
              },
              {
                "ingredientName": "雞蛋",
                "ingredientQty": "2 顆",
                "_id": "65d8b4e3c6f5e8f6817425f7"
              }
            ],
            "user": {
              "_id": "65d8493c1da1cd1c19f57f3e",
              "name": "Vance",
              "avatar": "https://i.imgur.com/vpQY28H.jpg",
            },
            "_id": "65d8b4e3c6f5e8f6817425f4",
            "createdAt": "2024-02-23T15:08:19.694Z",
            "updatedAt": "2024-02-23T15:08:19.694Z"
          }
        ]
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "取得所有食譜失敗"
      }
    }
  */
  checkToken,
  getAuth,
  isAdmin,
  handleErrorAsync(RecipeControllers.getRecipes)
);

// 取得指定會員所有食譜
router.get(
  "/recipes/user/:userId",
  /**
   * #swagger.tags = ["Recipe 食譜"]
   * #swagger.summary = "取得指定會員所有食譜"
   * #swagger.description = "取得指定會員所有食譜 - 需管理員權限"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": [
          {
            "_id": "65d84d4a86dd40e016997a8c",
            "title": "酥炸洋蔥圈",
            "image": "https://i.imgur.com/vpQY28H.jpg",
            "description": "酥炸洋蔥圈濃厚香氣、酥脆的外皮",
            "steps": [
              {
                "stepNum": 1,
                "stepContent": "洋蔥逆紋切成 1cm 圓圈狀，放入低筋麵粉 4 大匙、2 顆雞蛋混合均勻成的麵衣裡",
                "_id": "65d84d4a86dd40e016997a8d"
              },
              {
                "stepNum": 2,
                "stepContent": "中火加熱至油溫約 160 度將洋蔥放入，炸至二面酥脆金黃即可夾出瀝油",
                "_id": "65d84d4a86dd40e016997a8e"
              }
            ],
            "cookingTime": "5 分鐘",
            "ingredients": [
              {
                "ingredientName": "洋蔥",
                "ingredientQty": "1 顆",
                "_id": "65d8b4e3c6f5e8f6817425f7"
              },
              {
                "ingredientName": "麵粉",
                "ingredientQty": "適量",
                "_id": "65d8b4e3c6f5e8f6817425f7"
              },
              {
                "ingredientName": "雞蛋",
                "ingredientQty": "1 顆",
                "_id": "65d8b4e3c6f5e8f6817425f7"
              }
            ],
            "user": {
              "_id": "65d433ec0e39d8dcfd678a59",
              "name": "Carl",
              "avatar": "https://i.imgur.com/vpQY28H.jpg",
            },
            "createdAt": "2024-02-23T07:46:18.817Z",
            "updatedAt": "2024-02-23T07:46:18.817Z"
          }
        ]
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "取得所有食譜失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(RecipeControllers.getUserRecipes)
);

// 取得指定食譜
router.get(
  "/recipe/:recipeId",
  /**
   * #swagger.tags = ["Recipe 食譜"]
   * #swagger.summary = "取得指定食譜"
   * #swagger.description = "取得指定食譜 - 需管理員權限"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "65d84d4a86dd40e016997a8c",
          "title": "酥炸洋蔥圈",
          "image": "https://i.imgur.com/vpQY28H.jpg",
          "description": "酥炸洋蔥圈濃厚香氣、酥脆的外皮",
          "steps": [
            {
              "stepNum": 1,
              "stepContent": "洋蔥逆紋切成 1cm 圓圈狀，放入低筋麵粉 4 大匙、2 顆雞蛋混合均勻成的麵衣裡",
              "_id": "65d84d4a86dd40e016997a8d"
            },
            {
              "stepNum": 2,
              "stepContent": "中火加熱至油溫約 160 度將洋蔥放入，炸至二面酥脆金黃即可夾出瀝油",
              "_id": "65d84d4a86dd40e016997a8e"
            }
          ],
          "cookingTime": "5 分鐘",
          "ingredients": [
            {
              "ingredientName": "洋蔥",
              "ingredientQty": "1 顆",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            },
            {
              "ingredientName": "麵粉",
              "ingredientQty": "適量",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            },
            {
              "ingredientName": "雞蛋",
              "ingredientQty": "1 顆",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            }
          ],
          "user": {
            "_id": "65d433ec0e39d8dcfd678a59",
            "name": "Carl",
            "avatar": "https://i.imgur.com/vpQY28H.jpg",
          },
          "createdAt": "2024-02-23T07:46:18.817Z",
          "updatedAt": "2024-02-23T07:46:18.817Z"
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "取得指定食譜失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(RecipeControllers.getRecipe)
);

// 新增食譜
router.post(
  "/recipe",
  /**
   * #swagger.tags = ["Recipe 食譜"]
   * #swagger.summary = "新增食譜"
   * #swagger.description = "新增食譜"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "65d84d4a86dd40e016997a8c",
          "title": "酥炸洋蔥圈",
          "image": "https://i.imgur.com/vpQY28H.jpg",
          "description": "酥炸洋蔥圈濃厚香氣、酥脆的外皮",
          "steps": [
            {
              "stepNum": 1,
              "stepContent": "洋蔥逆紋切成 1cm 圓圈狀，放入低筋麵粉 4 大匙、2 顆雞蛋混合均勻成的麵衣裡",
              "_id": "65d84d4a86dd40e016997a8d"
            },
            {
              "stepNum": 2,
              "stepContent": "中火加熱至油溫約 160 度將洋蔥放入，炸至二面酥脆金黃即可夾出瀝油",
              "_id": "65d84d4a86dd40e016997a8e"
            }
          ],
          "cookingTime": "5 分鐘",
          "ingredients": [
            {
              "ingredientName": "洋蔥",
              "ingredientQty": "1 顆",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            },
            {
              "ingredientName": "麵粉",
              "ingredientQty": "適量",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            },
            {
              "ingredientName": "雞蛋",
              "ingredientQty": "1 顆",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            }
          ],
          "user": "65d433ec0e39d8dcfd678a59",
          "createdAt": "2024-02-23T07:46:18.817Z",
          "updatedAt": "2024-02-23T07:46:18.817Z"
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "新增食譜失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(RecipeControllers.createRecipe)
);

// 修改食譜
router.patch(
  "/recipe/:recipeId",
  /**
   * #swagger.tags = ["Recipe 食譜"]
   * #swagger.summary = "修改食譜"
   * #swagger.description = "修改食譜"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "65d84d4a86dd40e016997a8c",
          "title": "酥炸洋蔥圈",
          "image": "https://i.imgur.com/vpQY28H.jpg",
          "description": "酥炸洋蔥圈濃厚香氣、酥脆的外皮",
          "steps": [
            {
              "stepNum": 1,
              "stepContent": "洋蔥逆紋切成 1cm 圓圈狀，放入低筋麵粉 4 大匙、2 顆雞蛋混合均勻成的麵衣裡",
              "_id": "65d84d4a86dd40e016997a8d"
            },
            {
              "stepNum": 2,
              "stepContent": "中火加熱至油溫約 160 度將洋蔥放入，炸至二面酥脆金黃即可夾出瀝油",
              "_id": "65d84d4a86dd40e016997a8e"
            }
          ],
          "cookingTime": "5 分鐘",
          "ingredients": [
            {
              "ingredientName": "洋蔥",
              "ingredientQty": "1 顆",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            },
            {
              "ingredientName": "麵粉",
              "ingredientQty": "適量",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            },
            {
              "ingredientName": "雞蛋",
              "ingredientQty": "1 顆",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            }
          ],
          "user": "65d433ec0e39d8dcfd678a59",
          "createdAt": "2024-02-23T07:46:18.817Z",
          "updatedAt": "2024-02-23T07:46:18.817Z"
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "修改食譜失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(RecipeControllers.updateRecipe)
);

// 刪除指定會員所有食譜
router.delete(
  "/recipes/user/:userId",
  /**
   * #swagger.tags = ["Recipe 食譜"]
   * #swagger.summary = "刪除指定會員所有食譜"
   * #swagger.description = "刪除指定會員所有食譜"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": []
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "刪除指定會員所有食譜失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(RecipeControllers.delUserAllRecipes)
);

// 刪除所有食譜
router.delete(
  "/recipes",
  /**
   * #swagger.tags = ["Recipe 食譜 - 管理員"]
   * #swagger.summary = "刪除所有食譜"
   * #swagger.description = "刪除所有食譜 - 需管理員權限"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": []
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "刪除所有食譜失敗失敗"
      }
    }
  */
  checkToken,
  getAuth,
  isAdmin,
  handleErrorAsync(RecipeControllers.delAllRecipes)
);

// 刪除指定食譜
router.delete(
  "/recipe/:recipeId",
  /**
   * #swagger.tags = ["Recipe 食譜"]
   * #swagger.summary = '刪除指定食譜'
   * #swagger.description = "刪除指定食譜"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "65d84d4a86dd40e016997a8c",
          "title": "酥炸洋蔥圈",
          "image": "https://i.imgur.com/vpQY28H.jpg",
          "description": "酥炸洋蔥圈濃厚香氣、酥脆的外皮",
          "steps": [
            {
              "stepNum": 1,
              "stepContent": "洋蔥逆紋切成 1cm 圓圈狀，放入低筋麵粉 4 大匙、2 顆雞蛋混合均勻成的麵衣裡",
              "_id": "65d84d4a86dd40e016997a8d"
            },
            {
              "stepNum": 2,
              "stepContent": "中火加熱至油溫約 160 度將洋蔥放入，炸至二面酥脆金黃即可夾出瀝油",
              "_id": "65d84d4a86dd40e016997a8e"
            }
          ],
          "cookingTime": "5 分鐘",
          "ingredients": [
            {
              "ingredientName": "洋蔥",
              "ingredientQty": "1 顆",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            },
            {
              "ingredientName": "麵粉",
              "ingredientQty": "適量",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            },
            {
              "ingredientName": "雞蛋",
              "ingredientQty": "1 顆",
              "_id": "65d8b4e3c6f5e8f6817425f7"
            }
          ],
          "user": "65d433ec0e39d8dcfd678a59",
          "createdAt": "2024-02-23T07:46:18.817Z",
          "updatedAt": "2024-02-23T07:46:18.817Z"
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "刪除單一食譜失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(RecipeControllers.delRecipe)
);

module.exports = router;
