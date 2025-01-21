const Joi = require('joi');
const { msg } = require('../constant');

const paymentInfoSchema = Joi.object({
  paymentType: Joi.string().required().messages({
    'string.empty': msg.paymentMsg.requirePaymentName,
  }),
});

module.exports = {
  paymentInfoSchema,
};
