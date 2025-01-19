const { getHealthCheck } = require('./health.controller');
const {
  userRegistration,
  userLogin,
  userProfile,
} = require('./auth.controller');
const { createCategory, getCategory, listCategories } = require('./category.controller');

module.exports = {
  healthServices: {
    getHealthCheck,
  },
  authServices: {
    userRegistration,
    userLogin,
    userProfile,
  },
  categoryServices: {
    createCategory,
    listCategories,
    getCategory,
  }
};
