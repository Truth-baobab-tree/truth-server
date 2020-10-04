const { Page } = require('../models');

module.exports = async (url, person) => {
  const page = await Page.findOne({ where: { url, person }});

  if (page) return true;
  return false;
};
