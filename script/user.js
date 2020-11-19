const {
  User
} = require('../models');

const getUserCheck = async (key) => {
  try {
    if (key && key !== '') {
      const user = await User.findOne({
        attributes: ['id'],
        where: {
          key
        }
      });

      if (user) {
        return true;
      }
    }

    return false;
  } catch (err) {
    return false;
  }
};

const getUserData = async (key) => {
  try {
    if (key && key !== '') {
      const user = await User.findOne({
        attributes: ['id', 'name', 'rank', 'count'],
        where: {
          key
        }
      });

      if (user) {
        return user;
      }
    }

    return false;
  } catch (err) {
    return false;
  }
}

const getUserDataUseName = async (name) => {
  if (name && name !== '') {
    const user = await User.findOne({
      attributes: ['id', 'name', 'rank', 'count'],
      where: {
        name
      }
    });

    if (user) {
      return user;
    }
  }

  return false;
};


module.exports = {
  getUserCheck,
  getUserData,
  getUserDataUseName
};
