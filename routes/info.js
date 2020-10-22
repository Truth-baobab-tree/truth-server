const express = require('express');
const router = express.Router();
const request = require('request');


router.get('/get/news/sample/:query/:display', (req, res) => {
  try {
    const { query, display } = req.params;
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
        let { title, originallink, description } = item;
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
    res.redirect('/error/server-error');
  }
});

module.exports = router;
