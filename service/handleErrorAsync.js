// 捕捉未使用 try catch 造成的 catch 錯誤
const handleErrorAsync = (errFunction) => {
  // errFunction 將 async function 當作參數
  // middleware 接住 router 資料
  return (req, res, next) => {
    errFunction(req, res, next).catch((error) => next(error));
  };
};

module.exports = handleErrorAsync;
