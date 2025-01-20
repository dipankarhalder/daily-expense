const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const Category = require('../models/category.model');

const { envConfig } = require('../config');
const { msg } = require('../constant');
const { categoryValidate } = require('../validation');

/* create category */
const createCategory = async (req, res) => {
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
    const user = await User.findById(decoded.userid).select('-password');

    /* validate the request body using joi */
    const { error, value } = categoryValidate.categoryInfoSchema.validate(
      req.body,
      {
        abortEarly: false,
      },
    );
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.details.map((detail) => detail.message).join(', '),
      });
    }

    /* get category info from request body */
    const { categoryName, description } = value;

    /* save the category to the database */
    const newCategory = new Category({
      categoryName,
      description,
      user,
    });
    await newCategory.save();

    return res
      .status(StatusCodes.OK)
      .json({
        status: StatusCodes.OK,
        category: newCategory,
        message: msg.categoryMsg.newCategoryCreated,
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

/* list of categories */
const listCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res
      .status(StatusCodes.OK)
      .json({
        status: StatusCodes.OK,
        list: categories,
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

/* get category */
const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryDetails = await Category.findById(categoryId);
    return res
      .status(StatusCodes.OK)
      .json({
        status: StatusCodes.OK,
        list: categoryDetails,
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
  createCategory,
  listCategories,
  getCategory,
};
