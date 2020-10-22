const { Dict } = require('../models');

const getDictCheck = async (title, person) => {
  const dict = await Dict.findOne({ where: { title, person }});

  if (dict) return true;
  return false;
};

module.exports = { getDictCheck };
