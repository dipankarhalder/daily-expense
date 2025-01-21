const express = require('express');
const router = express.Router();

const { routers } = require('../../constant');
const {
  healthServices,
  authServices,
  categoryServices,
  paymentServices,
} = require('../../controllers');

// health check
router.get(
  routers.allRouters.healthCheck,
  healthServices.getHealthCheck,
);

// authentication
router.post(
  routers.allRouters.register,
  authServices.userRegistration,
);
router.post(
  routers.allRouters.login,
  authServices.userLogin,
);

// profile
router.get(
  routers.allRouters.getProfile,
  authServices.userProfile,
);
router.patch(
  routers.allRouters.updatePassword,
  authServices.updatePassword,
);

// catagories
router.post(
  routers.allRouters.newCategory,
  categoryServices.createCategory,
);
router.get(
  routers.allRouters.listCategory,
  categoryServices.listCategories,
);
router.get(
  routers.allRouters.categoryItem,
  categoryServices.getCategory,
);
router.delete(
  routers.allRouters.categoryItem,
  categoryServices.deleteCategory,
);

// payments
router.post(
  routers.allRouters.newPayment,
  paymentServices.createPayment,
);
router.get(
  routers.allRouters.listPayment,
  paymentServices.listPayments,
);
router.get(
  routers.allRouters.paymentItem,
  paymentServices.getPayment,
);
router.delete(
  routers.allRouters.paymentItem,
  paymentServices.deletePayment,
);


module.exports = {
  v1Routes: router,
};
