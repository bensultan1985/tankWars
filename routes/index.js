var express = require('express');
var router = express.Router();
var uuid = require('uuid')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
app.use(express.static('public'))

// router.get('/getuuid', function(req, res, next) {
//   let id = uuid();
//   res.send(id);
// });

module.exports = router;
