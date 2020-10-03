const { Page } = require('../models');

module.exports = async (url, person) => {
  const page = await Page.findOne({ where: { url, person }});

  if (page[0]) return true;
  return false;
};
