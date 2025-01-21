const { StatusCodes } = require('http-status-codes');

const Payment = require('../models/payment.model');
const { msg } = require('../constant');
const { paymentValidate } = require('../validation');
const {
  verifyToken,
  validateFields,
  sendErrorResponse,
  notFoundItem,
} = require('../utils');

/* create payment */
const createPayment = async (req, res) => {
  try {
    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    const { error, value } =
      paymentValidate.paymentInfoSchema.validate(
        req.body,
        { abortEarly: false, },
      );
    if (error) {
      return validateFields(
        res,
        error.details
          .map((detail) => detail.message)
          .join(', '),
      );
    }

    const { paymentType } = value;
    const existingPaymentType = await Payment.findOne({ paymentType });
    if (existingPaymentType) {
      return validateFields(
        res,
        msg.paymentMsg.payTypeAlreadyExist,
      );
    }

    const newPaymentType = new Payment({
      paymentType,
    });
    await newPaymentType.save();
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      paymentType: newPaymentType,
      message: msg.paymentMsg.newPaymentCreated,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* list of payments */
const listPayments = async (req, res) => {
  try {
    const Payments = await Payment.find();
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      list: Payments,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* get payment */
const getPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const paymentDetails =
      await Payment.findById(paymentId);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      details: paymentDetails,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* delete payment */
const deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payItem = await Payment.findById(paymentId);
    if (!payItem) {
      return notFoundItem(res, msg.paymentMsg.paymentNotFound);
    }
    await Payment.findByIdAndDelete(paymentId);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: msg.paymentMsg.paymentDeleted,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  createPayment,
  listPayments,
  getPayment,
  deletePayment,
};
