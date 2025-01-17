const express = require('express');

// const { all_routers } = require("../constant/route.constant");
// const { v1Routes } = require("./v1");

const router = express.Router();
// router.use(all_routers.v1Base, v1Routes);

module.exports = {
  RootApiRouter: router,
};
