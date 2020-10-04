const express = require('express');
const router = express.Router();

const { User, Page } = require('../models');

const { userCheck, userKeyToIdConv } = require('../script/user');
const pageCheck = require('../script/pageCheck');

const { getAdminCheck, postAdminCheck } = require('../middleware/adminCheck');

router.get('/get/all/:admin', getAdminCheck, async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.status(200).json(pages);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/get/find', postAdminCheck, async (req, res, next) => {
  try {
    const { url } = req.body;
    const data = await Page.findAll({ where: { url }});

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});


router.post('/get/find-set', postAdminCheck, async (req, res, next) => {
  try {
    const { url, key } = req.body;

    const user = await userCheck(key, 'data');
    if (!user) {
      await User.create({ key });
    }

    const pages = await Page.findAll({ where: { url }, include: { model: User }});

    if (!pages) res.status(200).json({});

    const data = {};
    pages.forEach(page => {
      data[page.status] = data[page.status] ? data[page.status] + 1 : 1;
      if (user.key === key) data['state'] = page.status;
    });
    data['notice'] = data['false'] > 100;
    console.log(data);

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/new/eval', postAdminCheck, async (req, res, next) => {
  try {
    const { url, status, reason, key } = req.body;

    let user = await userCheck(key, 'data');
    console.log(user);
    if (!user) {
      await User
        .create({ key })
        .then(result => {
          console.log(result);
          user = {};
          console.log(result.id);
          user.id = result.id;
        });
    }

    const person = user.id;

    const page = await pageCheck(url, person);

    if (page) {
      Page
        .update({ url, status, person, reason, }, { where: { url }})
          .then(result => {
            res.status(201).json(result);
          });
      } else {
        Page
          .create({ url, status, person, reason })
          .then(result => {
            res.status(201).json(result);
          });
      }

  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
