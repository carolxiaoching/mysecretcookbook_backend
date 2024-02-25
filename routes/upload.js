var express = require("express");
var router = express.Router();
const UploadControllers = require("../controllers/upload");
const handleErrorAsync = require("../service/handleErrorAsync");
const { checkToken, getAuth } = require("../service/auth");
const image = require("../service/image");

// 上傳圖片
router.post(
  "/upload",
  /**
   * #swagger.tags = ["Upload 上傳"]
   * #swagger.summary = "上傳圖片"
   * #swagger.description = "上傳圖片"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["query"] = {
      in: "query",
      name: "type",
      type: "string",
      description: "如果為 avatar 則為大頭照"
    }
   * #swagger.parameters["formData"] = {
      in: "formData",
      name:'img',
      type: "file",
      required: true,
      description: "圖片",
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": "https://i.imgur.com/vpQY28H.jpg"
      }
    }
    * #swagger.responses[400] = {
      description: "回傳失敗",
      schema: {
        "status": "error",
        "message": "上傳圖片失敗"
      }
    }
  */
  image,
  checkToken,
  getAuth,
  handleErrorAsync(UploadControllers.uploadImage)
);

module.exports = router;
