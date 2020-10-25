const express = require('express');
const router = express.Router();
const bcrypt  = require('bcrypt'), salt = 10;

const { User } = require('../models');


router.post('/api/find', async (req, res, next) => {
  try {
    const { key } = req.body;
    const data = await User.findOne({ attributes: ["name", "count", "rank"], where: { key }});

    if (data) return res.status(200).json(data);

    res.status(200).json('not found.');
  } catch (err) {
    next(err);
  }
});

router.post('/api/signup', async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findOne({ where: { name } });
    if (!user) {
      const sign = Math.floor(Math.random * 100) + 1;
      const key = await bcrypt.hash(name + req.body.password + sign, salt);
      const password = await bcrypt.hash(req.body.password, salt);

      if (password) {
        const data = await User.create({ key, sign, name, password });
        return res.status(200).json(data.key);
      }
    }
    res.status(200).json('user is definition.');
  } catch (err) {
    next(err);
  }
});

router.post('/api/login', async (req, res, next) => {
  try {
    const { name } = req.body;

    const data = await User.findOne({ where: { name }});
    if (!data) return res.status(200).json("user is not found.");

    const result = await bcrypt.compare(req.body.password, data.password);

    if (result) {
      return res.status(200).json(data.key);
    }

    res.status(200).json("login fail.");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
