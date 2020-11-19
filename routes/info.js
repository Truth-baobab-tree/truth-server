const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/get/news/sample/:query/:display', (req, res, next) => {
  try {
    const {
      query,
      display
    } = req.params;
    if (!query || !display) return res.redirect('/error/request-error');

    const qs = {
      query,
      display,
      start: 1,
      sort: 'sim'
    };

    const apiOptions = {
      uri: 'https://openapi.naver.com/v1/search/news.json',
      qs,
      headers: {
        'X-Naver-Client-Id': process.env.API_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.API_CLIENT_SECRET
      },
    };

    request(apiOptions, (err, responce, body) => {
      if (err) return res.redirect('/error/server-error');
      const data = [];
      JSON.parse(body).items.map(item => {
        let {
          title,
          originallink,
          description
        } = item;
        title = title.replace(/\&quot;/gi, '').replace(/\<b>/gi, '').replace(/\\/gi, '').replace(/\<\/b>/gi, '"');
        description = description.replace(/\&quot;/gi, '').replace(/\<b>/gi, '').replace(/\<\/b>/gi, '');
        data.push({
          title,
          originallink,
          description
        });
      });

      if (body) {
        res.status(200).json(data);
      } else {
        res.status(200).json([]);
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/get/factcheck/:query', async (req, res, next) => {
  try {

    const {
      query
    } = req.params;

    const url = 'https://factcheck.snu.ac.kr';

    request({
      uri: `${url}/v2/search?keyword=${encodeURI(query)}`,
    }, (err, response, body) => {
      let data = body.replace(/&quot;/g, '').substring(body.indexOf('<div class="fcItem_wrap">'), body.indexOf('<a class="last "'));
      data = data.substring(data.indexOf('<li class="fcItem_wrap_li">'), data.indexOf('<a class="btn_detail') + 20);
      console.log(data);
      data = data.substring(data.indexOf('<a href="/v2/facts'), data.indexOf('</a>'));
      console.log(data)
      const content = {
        title: data.substring(data.indexOf('">') + 2, 100),
        link: `${url}/${data.substring(data.indexOf('href="')+7, data.indexOf('">'))}`,
      };
      res.status(200).json(content);
    });

  } catch (err) {
    next(err);
  }
});


module.exports = router;
