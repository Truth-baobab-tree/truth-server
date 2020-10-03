const { User } = require('../models');

const userKeyToIdConv = async (key) => {
  const id = await User.findOne({ attributes: ['id'], where: { key }});
  return id;
}

const userCheck = async (key, type) => {
  key = key.trim();
  
  if (key && key !== '') {
    const user = await User.findOne({ where: { key }});

    if (user[0]) {
      if (type === 'data') return user;
      return true;
    }
  }

  return undefined;
};


module.exports = { userKeyToIdConv, userCheck };
