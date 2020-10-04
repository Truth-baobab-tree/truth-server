const getAdminCheck = (req, res, next) => {
  const { admin } = req.params;
  if (admin === process.env.ADMIN_KEY) {
    next();
  } else {
    return res.status(401).json("You do not have access permission.");
  }
};

const postAdminCheck = (req, res, next) => {
  const { admin } = req.body;
  if (admin === process.env.ADMIN_KEY) {
    next();
  } else {
    return res.status(401).json("You do not have access permission.");
  }
}

module.exports = { getAdminCheck, postAdminCheck };
