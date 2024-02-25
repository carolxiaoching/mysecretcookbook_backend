const express = require("express");
const router = express.Router();
const UserControllers = require("../controllers/users");
const handleErrorAsync = require("../service/handleErrorAsync");
const { checkToken, getAuth, isAdmin } = require("../service/auth");

// 註冊
router.post(
  "/user/signUp",
  /**
    * #swagger.tags = ["User 會員"]
    * #swagger.summary = "註冊"
    * #swagger.description = "註冊"
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$name": "Carl",
        "$email": "carl@mail.com",
        "$password": "Carl12345678"
      }
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTVhYTI0YWYxOGIyNzI5NmQ0MmE4MiIsImlhdCI6MTY1NTAyNDE2NCwiZXhwIjoxNjU1NjI4OTY0fQ.ylNUe_TfC7rqykZuJZdhOrp_oa4fKXwxniSrNk-SbhI",
          "user": {
            "_id": "62a5aa24af18b27296d42a82",
            "name": "Carl",
            "avatar": "",
            "gender": "male",
            "email": "carl@mail.com"
          }
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "註冊失敗"
      }
    }
  */
  handleErrorAsync(UserControllers.signUp)
);

// 登入
router.post(
  "/user/signIn",
  /**
    * #swagger.tags = ["User 會員"]
    * #swagger.summary = "登入"
    * #swagger.description = "登入"
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$email": "carl@mail.com",
        "$password": "Carl12345678",
      }
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTRmYzExMTU3Mzg4NGRmMjYyMzRmNSIsImlhdCI6MTY1NTAyMjQwNywiZXhwIjoxNjU1NjI3MjA3fQ.VKQsd3wbvhPQHf1yrUQwg84K4n_ICEbg4DYA0shT-Ng",
          "user": {
            "_id": "62a4fc111573884df26234f5",
            "name": "Carl",
            "avatar": "https://i.imgur.com/vpQY28H.jpg",
            "gender": "male",
            "email": "carl@mail.com"
          }
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "登入失敗"
      }
    }
  */
  handleErrorAsync(UserControllers.signIn)
);

// 重設密碼
router.post(
  "/user/updatePassword",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "重設密碼"
   * #swagger.description = "重設密碼"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$password": "Carl12345678",
        "$confirmPassword": "Carl12345678"
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTRmYzExMTU3Mzg4NGRmMjYyMzRmNSIsImlhdCI6MTY1NTAyNDUzNiwiZXhwIjoxNjU1NjI5MzM2fQ.4JE6hxIPx6yyneFLjxHLa1fHIXMgmJgOoJDGrynmOUM",
          "user": {
            "_id": "62a4fc111573884df26234f5",
            "name": "Carl",
            "avatar": "https://i.imgur.com/vpQY28H.jpg",
            "gender": "male",
            "email": "carl@mail.com"
          }
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "重設密碼失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(UserControllers.updatePassword)
);

// 取得指定會員資料
router.get(
  "/user/:userId/profile",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "取得指定會員資料"
   * #swagger.description = "取得指定會員資料"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "62a4fc111573884df26234f5",
          "name": "Carl",
          "gender": "male",
          "photo": "https://i.imgur.com/vpQY28H.jpg",
          "email": "carl@mail.com",
          "createdAt": "2024-02-23T13:31:49.730Z",
          "updatedAt": "2024-02-23T13:33:47.114Z"
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "取得指定會員資料失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(UserControllers.getUser)
);

// 更新會員資訊
router.patch(
  "/user/:userId/profile",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "更新會員資訊"
   * #swagger.description = "更新會員資訊"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "name": "Carl",
        "gender": "male",
        "avatar": "https://i.imgur.com/vpQY28H.jpg"
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTRmYzExMTU3Mzg4NGRmMjYyMzRmNSIsImlhdCI6MTY1NTAyNDY3OCwiZXhwIjoxNjU1NjI5NDc4fQ.vMIJuAqPwiE6AbheNl6vZ00m1hIzb7PDCBRlGD0SNMA",
          "user": {
            "_id": "62a4fc111573884df26234f5",
            "name": "Carl",
            "avatar": "https://i.imgur.com/vpQY28H.jpg",
            "gender": "male",
            "email": "carl@mail.com"
          }
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "更新會員資訊失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(UserControllers.updateUser)
);

// 取得所有會員
router.get(
  "/users",
  /**
   * #swagger.tags = ["User 會員 - 管理員"]
   * #swagger.summary = "取得所有會員"
   * #swagger.description = "取得所有會員"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": [
          {
            "_id": "62a4fc111573884df26234f5",
            "name": "Carl",
            "avatar": "https://i.imgur.com/vpQY28H.jpg",
            "gender": "male",
            "email": "carl@mail.com",
            "createdAt": "2024-02-20T05:09:00.504Z",
            "updatedAt": "2024-02-20T05:43:06.290Z"
          },
          {
            "_id": "62a4fc111573884df26234f5",
            "name": "Vance",
            "avatar": "https://i.imgur.com/vpQY28H.jpg",
            "gender": "male",
            "email": "vance@mail.com",
            "createdAt": "2024-02-20T05:09:00.504Z",
            "updatedAt": "2024-02-20T05:43:06.290Z"
          }
        ]
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "取得所有會員失敗"
      }
    }
  */
  checkToken,
  getAuth,
  isAdmin,
  handleErrorAsync(UserControllers.getUsers)
);

// 刪除所有會員
router.delete(
  "/users",
  /**
   * #swagger.tags = ["User 會員 - 管理員"]
   * #swagger.summary = "刪除所有會員"
   * #swagger.description = "刪除所有會員，會同步刪除所有食譜"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": [
          {
            "_id": "65d433ec0e39d8dcfd678a59",
            "name": "admin",
            "gender": "male",
            "avatar": "",
            "email": "admin@mail.com",
            "createdAt": "2024-02-20T05:09:00.504Z",
            "updatedAt": "2024-02-20T05:43:06.290Z"
          }
        ]
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "刪除所有會員失敗"
      }
    }
  */
  checkToken,
  getAuth,
  isAdmin,
  handleErrorAsync(UserControllers.delAllUsers)
);

// 刪除指定會員
router.delete(
  "/user/:userId",
  /**
   * #swagger.tags = ["User 會員"]
   * #swagger.summary = "刪除指定會員"
   * #swagger.description = "刪除指定會員，會同步刪除指定會員所有食譜"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "62a4fc111573884df26234f5",
          "name": "Vance",
          "avatar": "https://i.imgur.com/vpQY28H.jpg",
          "gender": "male",
          "email": "vance@mail.com",
          "createdAt": "2024-02-20T05:09:00.504Z",
          "updatedAt": "2024-02-20T05:43:06.290Z"
        }
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "刪除指定會員失敗"
      }
    }
  */
  checkToken,
  getAuth,
  handleErrorAsync(UserControllers.delUser)
);

module.exports = router;
