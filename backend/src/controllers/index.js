const { getHealthCheck } = require('./health.controller');
const {
  userRegistration,
  userLogin,
  userProfile,
  updatePassword,
} = require('./auth.controller');
const {
  createCategory,
  getCategory,
  listCategories,
  deleteCategory,
} = require('./category.controller');
const {
  createPayment,
  listPayments,
  getPayment,
  deletePayment,
} = require('./payment.controller');

module.exports = {
  healthServices: {
    getHealthCheck,
  },
  authServices: {
    userRegistration,
    userLogin,
    userProfile,
    updatePassword,
  },
  categoryServices: {
    createCategory,
    listCategories,
    getCategory,
    deleteCategory,
  },
  paymentServices: {
    createPayment,
    listPayments,
    getPayment,
    deletePayment,
  }
};
