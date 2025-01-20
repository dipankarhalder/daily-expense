const allRouters = {
  base: '/api',
  v1Base: '/v1',

  healthCheck: '/health-check',

  register: '/auth/register',
  login: '/auth/login',
  getProfile: '/profile/me',
  updateProfile: '/profile/update-me',
  updatePassword: '/profile/update-password',

  newCategory: '/category/new',
  listCategory: '/category/list',
  categoryItem: '/category/:id',
};

module.exports = {
  allRouters,
};
