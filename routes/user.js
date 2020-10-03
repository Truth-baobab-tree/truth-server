const express = require('express');
const router = express.Router();
const { User } = require('../models');
const adminCheck = require('../middleware/adminCheck');

const userCheck = require('../script/user');

router.get('/get/all/:admin', adminCheck, async (req, res, next) => {
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
    const data = User.findOne({ key });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/check/:key', async (req, res, next) => {
  try {
    const { key } = req.body;
    const result = await userCheck(key, 'boolean');

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/new', async (req, res, next) => {
  try {
    const { key } = req.body;
    const data = await User.create({ key: key, rank: 'bronze', eval_count: 0 }).then(result => console.log(result));

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
})

router.post('/update', (req, res) => {
  res.status(201).json('User information updated.');
});

module.exports = router;
