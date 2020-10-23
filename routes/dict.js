const express = require('express');
const router = express.Router();

const { Dict } = require('../models');
const { getUserData, getUserDataUseName } = require('../script/user');
const { getDictCheck } = require('../script/dict');

router.get('/get/enroll-list', async (req, res) => {
  try {
    const data = await Dict.findAll({ where: { allow: false }});
    res.status(200).json(data);
  } catch (err) {
    res.redirect(`/error/${err}`);
  }
});

router.get('/get/dict-list', async (req, res) => {
  try {
    const data = await Dict.findAll({ where: { allow: true }});
    res.status(200).json(data);
  } catch (err) {
    res.redirect(`/error/${err}`);
  }
});

router.post('/api/new/dict', async (req, res) => {
  try {
    const { key, title, name } = req.body;
    const admin = await getUserData(key);
    const user = await getUserDataUseName(name);

    if (!admin || !title || !user) {
      return res.redirect('/error/request-error');
    }

    if (admin.rank === 'admin') {
      let date = new Date();
      const allowedAt = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
      const person = user.id;

      await Dict.
        update({ allow: true, allowedAt }, { where: { title, person }})
        .then(result => {
          res.status(201).json(result ? 'success' : 'fail');
        });
    } else {
      res.status(403).json('no permission.');
    }
  } catch (err) {
    res.redirect(`/error/${err}`);
  }
});

router.post('/api/new/enroll', async (req, res) => {
  try {
    const { key, title, newTitle, reason } = req.body;
    const user = await getUserData(key);
    const person = user.id;

    const dict = await getDictCheck(title, person);

    if (user) {
      if (dict) {
        await Dict
          .update({ reason, title: newTitle }, { where: { title, person }})
          .then(result => {
            res.status(201).json(result ? 'success' : 'fail');
          });
      } else {
        await Dict
          .create({ title, reason, person })
          .then(result => {
            res.status(201).json(result ? 'success' : 'fail');
          });
      }
    } else {
      res.redirect('/error/request-error');
    }
  } catch (err) {
    res.redirect(`/error/${err}`);
  }
});

router.post('/api/remove/enroll', async (req, res) => {
  const { key, title, name } = req.body;
  const admin = await getUserData(key);
  const user = await getUserDataUseName(name);

  if (!admin || !title || !user) {
    return res.redirect('/error/request-error');
  }

  if (admin.rank === 'admin') {
    await Dict
      .destroy({ where: { title, name }})
      .then(result => {
        return res.status(201).json(result ? 'success' : 'fail');
      });
  } else {
    res.status(403).json('no permission.');
  }

});

module.exports = router;
