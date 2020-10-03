module.exports = (req, res, next) => {
  const { admin } = req.params;
  if (admin === process.env.ADMIN_KEY) {
    next();
  } else {
    return res.status(200).json("Key is incollected.");
  }
};
