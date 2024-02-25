const resSuccess = (res, statusCode, data) => {
  /*
    res.send() 會依照傳入型別來決定回傳格式
    String => HTML 格式
    Array or Object => JSON 格式
  */
  res.status(statusCode).send({
    status: "success",
    data,
  });
};

module.exports = resSuccess;
