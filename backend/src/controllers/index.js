const { getHealthCheck } = require('./health.controller');
const {
  userRegistration,
  userLogin,
  userProfile,
} = require('./auth.controller');

module.exports = {
  getHealthCheck,
  authServices: {
    userRegistration,
    userLogin,
    userProfile,
  },
};
