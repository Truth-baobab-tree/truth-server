const { Page } = require('../models');

const getPageCheck = async (url, person) => {
  const page = await Page.findOne({ where: { url, person }});

  if (page) return true;
  return false;
};

module.exports = { getPageCheck };
