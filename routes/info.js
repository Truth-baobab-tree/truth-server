const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/get/news/sample/:query/:display', (req, res, next) => {

  try { 
    const { query, display } = req.params;
    
    if (!query || !display) throw 'error';

    Object.keys(req.params).map(item => { 
      let value = req.params[item];
      if (!value || value === null || value === undefined || value === '') throw 'error';
    });
  
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

  request(apiOptions, (err, respne, body) => {
    if (err) console.log('error:', err);
    const data = [];
    JSON.parse(body).items.map(item => {
      let { title, originallink, description } = item;
      title = title.replace(/\&quot;/gi,'').replace(/\<b>/gi,'').replace(/\\/gi,'').replace(/\<\/b>/gi,'"');
      description = description.replace(/\&quot;/gi,'').replace(/\<b>/gi,'').replace(/\<\/b>/gi,'');
      data.push({ title, originallink, description });
    });

    if (body) res.status(200).json(data);
  });
  } catch (err) {
    console.log('error:');
    next(err);
  }
});

module.exports = router;
