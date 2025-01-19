const { StatusCodes } = require('http-status-codes');

const { msg } = require('../constant');

const getHealthCheck = async (req, res) => {
  try {
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: msg.healthCheck.successMsg,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: msg.appMsg.somethingWrong,
      error: error.message,
    });
  }
};

module.exports = {
  getHealthCheck,
};
