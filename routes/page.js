const express = require('express');
const router = express.Router();

const { User, Page } = require('../models');

const { userCheck, userKeyToIdConv } = require('../script/user');
const pageCheck = require('../script/pageCheck');

const adminCheck = require('../middleware/adminCheck');

router.get('/get/all/:admin', adminCheck, async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.status(200).json(pages);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/get/find/:url/:key', async (req, res, next) => {
  try {
    const { url, key } = req.params;

    const user = userCheck(key, 'data');
    if (!user) {
      User
        .create({ key })
        .then(result => {
          user = {};
          user.id = result.id;
        });
    }

    const { id } = user;

    const pages = await Page.findAll({ where: { url }, include: { model: User }});
    if (pages) res.status(200).json({});

    const data = {};
    pages.forEach(page => {
      data[page.status] = data[page.status] ? data[page.status] + 1 : 0;
      data[page.state] = page.id === id ? page.status : undefined;
    });
    data['notice'] = data['hate'] > 100;

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/new/eval', async (req, res, next) => {
  try {
    const { url, status, key } = req.body;

    let user = await userCheck(key, 'data');
    if (!user) {
      User
        .create({ key })
        .then(result => {
          user = {};
          user.id = result.id;
        });
    }

    const { id } = user;

    const page = await pageCheck(url, id);
    if (page) {
      Page
        .update({ url, status, person: id })
        .then(result => {
          res.status(201).json(result);
        });
    } else {
      Page
        .create({ url, status, person: id })
        .then(result => {
          res.status(201).json(result);
        });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/new/cancel', (req, res) => {
  const { url, key } = req.body;
  
});

module.exports = router;
