const { User } = require('../models');

const userKeyToIdConv = async (key) => {
  const id = await User.findOne({ attributes: ['id'], where: { key }});
  return id;
}

const userCheck = async (key, type) => {
  if (key && key !== '') {
    const user = await User.findOne({ where: { key }});
    if (user) {
      if (type === 'data') return user;
      return true;
    }
  }

  return false;
};


module.exports = { userKeyToIdConv, userCheck };
