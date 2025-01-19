const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const { msg } = require('../constant');
const { authValidate } = require('../validation');
const { envConfig } = require('../config');

/* user registration */
const userRegistration = async (req, res) => {
  try {
    /* validate the request body using joi */
    const { error, value } = authValidate.userInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.details.map((detail) => detail.message).join(', '),
      });
    }

    /* get user info from request body */
    const { email, password, firstname, lastname, phone, role } = value;

    /* check if email already exists */
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: msg.userMsg.emailAlreadyExist,
      });
    }

    /* check if phone number already exists */
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: msg.userMsg.phoneAlreadyExist,
      });
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

    /* generate JWT token successful */
    const token = user.generateAuthToken();

    /* set the token in the cookie */
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: envConfig.NODEENV,
      maxAge: envConfig.EXPTIME,
    });

    return res
      .status(StatusCodes.OK)
      .json({
        status: StatusCodes.OK,
        token: token,
        message: msg.userMsg.newUserCreated,
      })
      .end();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: msg.appMsg.somethingWrong,
      error: error.message,
    });
  }
};

/* user login */
const userLogin = async (req, res) => {
  try {
    /* validate the request body using joi */
    const { error, value } = authValidate.userLoginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.details.map((detail) => detail.message).join(', '),
      });
    }

    /* get user info from request body */
    const { email, password } = value;

    /* validate the user email */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: msg.userMsg.existUserEmail,
      });
    }

    /* validate / compare the user password */
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: msg.userMsg.userWrongPassword,
      });
    }

    /* generate JWT after successful login */
    const token = user.generateAuthToken();

    /* set the token in the cookie */
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: envConfig.NODEENV,
      maxAge: envConfig.EXPTIME,
    });

    return res
      .status(StatusCodes.OK)
      .json({
        status: StatusCodes.OK,
        token: token,
        message: msg.userMsg.userLoginSuccessfully,
      })
      .end();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: msg.appMsg.somethingWrong,
      error: error.message,
    });
  }
};

/* user profile */
const userProfile = async (req, res) => {
  try {
    /* retrieve the token from cookies */
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: msg.userMsg.accessDenied,
      });
    }

    /* verify and decode the token */
    const decoded = jwt.verify(token, envConfig.JWTSECRET);
    if (!decoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: msg.userMsg.invalidToken,
      });
    }

    /* retrieve the user based on the decoded token's user ID */
    const user = await User.findById(decoded.userid);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: msg.userMsg.userNotFound,
      });
    }

    /* return the user profile excluding password */
    const userProfile = {
      fullname: `${user.firstname} ${user.lastname}`,
      email: user.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: userProfile,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: msg.appMsg.somethingWrong,
      error: error.message,
    });
  }
};

/* update user password */
const updatePassword = async (req, res) => {
  try {
    /* retrieve the token from cookies */
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: msg.userMsg.accessDenied,
      });
    }

    /* Verify and decode the token */
    const decoded = jwt.verify(token, envConfig.JWTSECRET);
    if (!decoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: msg.userMsg.invalidToken,
      });
    }

    /* get user ID from the decoded token */
    const userId = decoded.userid;

    /* validate the password input fields */
    const { error, value } = authValidate.passwordSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.details.map((detail) => detail.message).join(', '),
      });
    }

    /* use the password info after validate it */
    const { oldPassword, newPassword } = value;

    /* find user by email */
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: msg.userMsg.userNotFound,
      });
    }

    /* check if the old password matches */
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: msg.userMsg.userWrongPassword,
      });
    }

    /* update password */
    user.password = newPassword;
    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({
        status: StatusCodes.OK,
        message: msg.userMsg.updatedUserPassword,
      })
      .end();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: msg.appMsg.somethingWrong,
      error: error.message,
    });
  }
};

module.exports = {
  userRegistration,
  userLogin,
  userProfile,
  updatePassword,
};
