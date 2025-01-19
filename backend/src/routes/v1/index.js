const express = require('express');
const router = express.Router();

const { routers } = require('../../constant');
const { getHealthCheck, authServices } = require('../../controllers');

router.get(routers.allRouters.healthCheck, getHealthCheck);
router.post(routers.allRouters.register, authServices.userRegistration);
router.post(routers.allRouters.login, authServices.userLogin);
router.get(routers.allRouters.profile, authServices.userProfile);

module.exports = {
  v1Routes: router,
};
