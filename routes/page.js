const express = require('express');
const router = express.Router();

const { User, Page, sequelize } = require('../models');
const { getUserCheck } = require('../script/user');
const { getPageCheck } = require('../script/page');


router.post('/get/score', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(200).json('data is undefined.');

    const pages = await Page.findAll({ attributes: ['status'], where: { url }});
    if (!pages) return res.status(200).json({});

    const data = {};
    data['truth'] = 0;
    data['lie'] = 0;
    pages.forEach(page => {
      data[page.status] = data[page.status] + 1;
    });
    data['notice'] = data['lie'] > 100;

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/get/eval/:mode', async (req, res, next) => {
  try {
    const { mode } = req.params;
    const { url, key } = req.body;

    const user = await getUserCheck(key);
    if (!user || (mode !== 'rank' && mode !== 'latest')) return res.status(200).json('data is undefined.');

    const pages = await Page
      .findAll({
        attributes: ['status', 'reason', 'createdAt'],
        where: { url },
        include: [{
          attributes: ['name', 'rank', 'key'],
          model: User,
        }],
        order: sequelize.literal(mode === 'rank' ? 'User.rank' : 'id DESC')
      });

    if (!pages) return res.status(200).json({});

    const data = [];

    const Key = key;

    pages.forEach(item => {
      let { status, reason, user, createdAt } = item;
      let { name, rank, key } = user;

      if (Key === key) {
        data.unshift({ status, reason, name, rank, createdAt });
      } else {
        data.push({ status, reason, name, rank, createdAt });
      }
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/new/eval', async (req, res, next) => {
  try {
    const { url, status, reason, key } = req.body;
    if (!key) return res.status(200).json('data is undefined.');
    
    const user = await User.findOne({ attributes: ["id", "count"], where: { key }});
    if (!user) return res.status(200).json('data is undefined.');

    const id = user.id;

    if (!id || !url || !status || !reason) {
      return res.status(200).json('data is undefined.');
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
    next(err);
  }
});

module.exports = router;
