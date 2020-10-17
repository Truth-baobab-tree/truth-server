const { User } = require('../models');

const userKeyToIdConv = async (key) => {
  const id = await User.findOne({ attributes: ['id'], where: { key }});
  return id;
}

const getUserCheck = async (key) => {
  if (key && key !== '') {
    const user = await User.findOne({ where: { key }});
    
    if (user) {
      return true;
    }
  }

  return false;
};

const getUserData = async (key) => {
  if (key && key !== '') {
    const user = await User.findOne({ where: { key }});
    
    if (user) {
      return true;
    }
  }

  return false;
}


module.exports = { userKeyToIdConv, getUserCheck, getUserData, };
