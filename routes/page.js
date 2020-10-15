const express = require('express');
const router = express.Router();

const { User, Page } = require('../models');

const { getPageCheck } = require('../script/page');

router.post('/get/find',  async (req, res, next) => {
  try {
    const { url } = req.body;
    const data = await Page.findAll({ where: { url }});

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

/*
router.post('/get/find-set', async (req, res, next) => {
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
*/
router.post('/new/eval',  async (req, res, next) => {
  try {
    const { url, status, reason, key } = req.body;
    if (!key) return res.redirect('/error/server/request-error');
    
    const user = await User.findOne({ attributes: ["id", "eval_count"], where: { key }});

    const id = user.id;

    if (!id || !url || !status || !reason) {
      return res.redirect('/error/server/request-error');
    }

    const page = await getPageCheck(url, id);

    console.log(page);

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
    next(err);
  }
});

module.exports = router;
