const express = require('express');
const router = express.Router();

const { routers } = require('../../constant');
const {
  healthServices,
  authServices,
  categoryServices,
} = require('../../controllers');

// health check
router.get(routers.allRouters.healthCheck, healthServices.getHealthCheck);

// register, login and related to user profile
router.post(routers.allRouters.register, authServices.userRegistration);
router.post(routers.allRouters.login, authServices.userLogin);
router.get(routers.allRouters.getProfile, authServices.userProfile);
router.patch(routers.allRouters.updatePassword, authServices.updatePassword);

// catagories
router.post(routers.allRouters.newCategory, categoryServices.createCategory);
router.get(routers.allRouters.listCategory, categoryServices.listCategories);
router.get(routers.allRouters.categoryItem, categoryServices.getCategory);

module.exports = {
  v1Routes: router,
};
