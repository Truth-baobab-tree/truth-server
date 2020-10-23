const express = require('express');
const router = express.Router();

const { User, Page } = require('../models');
const { getUserCheck } = require('../script/user');
const { getPageCheck } = require('../script/page');


router.post('/get/score', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.redirect('/error/server/request-error');

    const pages = await Page.findAll({ attributes: ['status'], where: { url }});
    if (!pages) return res.status(200).json({});

    const data = {};
    data['truth'] = 0;
    data['lie'] = 0;
    pages.forEach(page => {
      data[page.status] = data[page.status] + 1;
    });
    data['notice'] = data['lie'] > 100;
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.redirect('/error/server/server-error');
  }
});

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
    
    const user = await User.findOne({ attributes: ["id", "count"], where: { key }});
    if (!user) return res.redirect('/error/server/request-error');

    const id = user.id;

    if (!id || !url || !status || !reason) {
      return res.redirect('/error/server/request-error');
    }

    const page = await getPageCheck(url, id);

    let date = new Date();
    const createdAt = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;

    if (page) {
      await Page
        .update({ url, status, reason, createdAt, }, { where: { url, person: id }})
        .then(result => {
          res.status(201).json(result ? 'success' : 'fail');
        });
      } else {
        await User.update({ count: user.count + 1 }, { where: { id }});
        await Page
          .create({ url, status, person: id, reason, createdAt, })
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
