const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "My Screct Cookbook API",
    description: "我的秘密食譜 API",
  },
  host:
    process.env.NODE_ENV === "production"
      ? "mysecretcookbook-backend.onrender.com"
      : "localhost:3000",
  schemes: ["http", "https"],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      in: "headers",
      name: "authorization",
      description: "請加上 JWT Token",
    },
  },
  consumes: ["application/json"], // 請求格式
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
