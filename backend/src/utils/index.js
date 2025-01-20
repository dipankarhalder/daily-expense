const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const { envConfig } = require('../config');
const { msg } = require('../constant');

const sendErrorResponse = (res, error) => {
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: msg.appMsg.somethingWrong,
      error: error.message,
    });
};

const validateFields = (res, messages) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    status: StatusCodes.BAD_REQUEST,
    message: messages,
  });
};

const verifyToken = (req, res) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: msg.userMsg.accessDenied,
      });
    }

    const decoded = jwt.verify(token, envConfig.JWTSECRET);
    if (!decoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: msg.userMsg.invalidToken,
      });
    }
    return decoded;
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: msg.userMsg.invalidToken,
      error: error.message,
    });
  }
};

module.exports = {
  sendErrorResponse,
  verifyToken,
  validateFields,
};
