var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render retuns html
  // res.json returns json
  res.render('index', { title: 'Express' });
});

module.exports = router;
