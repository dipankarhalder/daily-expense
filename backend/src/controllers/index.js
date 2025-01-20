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
};
