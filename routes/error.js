const express = require('express');
const router = express.Router();

router.get('/server/:msg', (req, res) => {
  const { msg } = req.params;

  res.status(500).json(msg);
});



module.exports = router;

