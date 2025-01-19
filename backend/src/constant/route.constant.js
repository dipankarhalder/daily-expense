const allRouters = {
  base: '/api',
  v1Base: '/v1',

  healthCheck: '/health-check',

  register: '/register',
  login: '/login',
  profile: '/profile/me',
  updateProfile: '/update-me',
  updatePassword: '/update-password',

  newCategory: '/new-category',
  listCategory: '/list-categories',
  categoryItem: '/category/:id',
};

module.exports = {
  allRouters,
};
