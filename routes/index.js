var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get takes a request string, and a callback
// req is the request object, and res is the response object, next is the next function in the middleware chain
router.get('/', function (req, res, next) {
  // res.render retuns html
  // res.json returns json
  res.render('index', { title: 'Express' });
});

module.exports = router;
