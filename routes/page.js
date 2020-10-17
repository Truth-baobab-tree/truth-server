const express = require('express');
const router = express.Router();

const { User, Page } = require('../models');
const { getUserCheck } = require('../script/user');
const { getPageCheck } = require('../script/page');

/*
router.post('/get/page', async (req, res, next) => {
  try {
    const { url, key } = req.body;

    const user = await userCheck(key, 'data');

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
*/

router.post('/get/eval', async (req, res) => {
  try {
    const { url, key } = req.body;

    const user = await getUserCheck(key);
    if (!user) return res.redirect('/error/server/request-error');

    const pages = await Page.findAll({ where: { url }, include: { model: User }});
    if (!pages) return res.status(200).json({});

    const data = [];

    pages.forEach(item => {
      let { status, reason, user } = item;
      let { name } = user;

      if (item.user.key === key) {
        data.unshift({ status, reason, name });
      } else {
        data.push({ status, reason, name });
      }
    });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.redirect('/error/server/server-error');
  }
});

router.post('/new/eval',  async (req, res) => {
  try {
    const { url, status, reason, key } = req.body;
    if (!key) return res.redirect('/error/server/request-error');
    
    const user = await User.findOne({ attributes: ["id", "eval_count"], where: { key }});

    const id = user.id;

    if (!id || !url || !status || !reason) {
      return res.redirect('/error/server/request-error');
    }

    const page = await getPageCheck(url, id);

    if (page) {
      await Page
        .update({ url, status, person: id, reason, }, { where: { url }})
        .then(result => {
          res.status(201).json(result ? 'success' : 'fail');
        });
      } else {
        await User.update({ eval_count: user.eval_count + 1 }, { where: { id }});
        await Page
          .create({ status, person: id, reason })
          .then(result => {
            res.status(201).json(result ? 'success' : 'fail');
          });
      }
  } catch (err) {
    console.log(err);
    res.redirect('/error/server/server-error');
  }
});

module.exports = router;
