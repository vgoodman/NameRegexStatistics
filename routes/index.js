var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var siteJS = JSON.parse(path.join(__dirname, 'public/'+req.url+'.manifest.json'))[0];
  res.render('index', { title: 'public/'+req.url+'.manifest.json',script: siteJS});
});

module.exports = router;
