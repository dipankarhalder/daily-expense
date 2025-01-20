const { StatusCodes } = require('http-status-codes');

const User = require('../models/user.model');
const { envConfig } = require('../config');
const { msg } = require('../constant');
const { authValidate } = require('../validation');
const {
  verifyToken,
  validateFields,
  sendErrorResponse,
  notFoundItem,
} = require('../utils');

/* user registration */
const userRegistration = async (req, res) => {
  try {
    /* validate the request body using joi */
    const { error, value } =
      authValidate.userInfoSchema.validate(req.body, {
        abortEarly: false,
      });
    if (error) {
      return validateFields(
        res,
        error.details
          .map((detail) => detail.message)
          .join(', '),
      );
    }

    /* get user info from request body */
    const {
      email,
      password,
      firstname,
      lastname,
      phone,
      role,
    } = value;

    /* check if email already exists */
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return validateFields(
        res,
        msg.userMsg.emailAlreadyExist,
      );
    }

    /* check if phone number already exists */
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return validateFields(
        res,
        msg.userMsg.phoneAlreadyExist,
      );
    }

    /* save the user to the database */
    const user = new User({
      email,
      password,
      firstname,
      lastname,
      phone,
      role,
    });
    await user.save();

    /* generate JWT token and set cookies */
    const token = user.generateAuthToken();
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: envConfig.NODEENV,
      maxAge: envConfig.EXPTIME,
    });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      token: token,
      message: msg.userMsg.newUserCreated,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* user login */
const userLogin = async (req, res) => {
  try {
    /* validate the request body using joi */
    const { error, value } =
      authValidate.userLoginSchema.validate(req.body, {
        abortEarly: false,
      });
    if (error) {
      return validateFields(
        res,
        error.details
          .map((detail) => detail.message)
          .join(', '),
      );
    }

    /* get user info from request body */
    const { email, password } = value;

    /* validate the user email */
    const user = await User.findOne({ email });
    if (!user) {
      return validateFields(
        res,
        msg.userMsg.existUserEmail,
      );
    }

    /* validate / compare the user password */
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return validateFields(
        res,
        msg.userMsg.userWrongPassword,
      );
    }

    /* generate JWT after successful login */
    const token = user.generateAuthToken();
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: envConfig.NODEENV,
      maxAge: envConfig.EXPTIME,
    });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      token: token,
      message: msg.userMsg.userLoginSuccessfully,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* user profile */
const userProfile = async (req, res) => {
  try {
    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    const user = await User.findById(decoded.userid).select(
      '-password',
    );
    if (!user) {
      return notFoundItem(res, msg.userMsg.userNotFound);
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: user,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* update user password */
const updatePassword = async (req, res) => {
  try {
    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    /* validate the password input fields */
    const { error, value } =
      authValidate.passwordSchema.validate(req.body, {
        abortEarly: false,
      });
    if (error) {
      return validateFields(
        res,
        error.details
          .map((detail) => detail.message)
          .join(', '),
      );
    }

    /* use the password info after validate it */
    const { oldPassword, newPassword } = value;

    /* find user by email */
    const user = await User.findById(decoded.userid);
    if (!user) {
      return validateFields(res, msg.userMsg.userNotFound);
    }

    /* check if the old password matches */
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return validateFields(
        res,
        msg.userMsg.userWrongPassword,
      );
    }

    /* update password */
    user.password = newPassword;
    await user.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: msg.userMsg.updatedUserPassword,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  userRegistration,
  userLogin,
  userProfile,
  updatePassword,
};
