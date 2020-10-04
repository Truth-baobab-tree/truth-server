const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { getAdminCheck, postAdminCheck } = require('../middleware/adminCheck');

const { userCheck } = require('../script/user');

router.get('/get/all/:admin', getAdminCheck, async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/get/find/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const data = await User.findOne({ key });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/get/check/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const result = await userCheck(key, 'boolean');

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/new', postAdminCheck, async (req, res, next) => {
  try {
    const { key } = req.body;
    const data = await User.create({ key }).then(result => console.log(result));

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
})

module.exports = router;
