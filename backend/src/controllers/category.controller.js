const { StatusCodes } = require('http-status-codes');

const User = require('../models/user.model');
const Category = require('../models/category.model');
const { msg } = require('../constant');
const { categoryValidate } = require('../validation');
const {
  verifyToken,
  validateFields,
  sendErrorResponse,
} = require('../utils');

/* create category */
const createCategory = async (req, res) => {
  try {
    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    const user = await User.findById(decoded.userid).select(
      '-password',
    );

    /* validate the request body using joi */
    const { error, value } =
      categoryValidate.categoryInfoSchema.validate(
        req.body,
        {
          abortEarly: false,
        },
      );
    if (error) {
      return validateFields(
        res,
        error.details
          .map((detail) => detail.message)
          .join(', '),
      );
    }

    /* get category info from request body */
    const { categoryName, description } = value;
    const newCategory = new Category({
      categoryName,
      description,
      user,
    });
    await newCategory.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      category: newCategory,
      message: msg.categoryMsg.newCategoryCreated,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* list of categories */
const listCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      list: categories,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* get category */
const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryDetails =
      await Category.findById(categoryId);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      list: categoryDetails,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  createCategory,
  listCategories,
  getCategory,
};
