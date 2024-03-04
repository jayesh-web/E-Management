const sendSuccessResponseForList = (
  res,
  data,
  statusCode,
  message,
  totalCount
) => {
  return res.status(statusCode).send({
    status: "success",
    statusCode,
    data: {
      totalCount,
      data,
    },
    message,
  });
};

const sendSuccessResponseWithoutList = (res, data, statusCode, message) => {
  return res.status(statusCode).send({
    status: "success",
    statusCode,
    data: {
      data,
    },
    message,
  });
};

module.exports = { sendSuccessResponseForList, sendSuccessResponseWithoutList };
