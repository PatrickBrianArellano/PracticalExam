var express = require('express');
var router = express.Router();
var connection = require('../lib/db');

/* GET home page. */
router.get('/', function (req, res, next) {

    connection.query('SELECT * FROM items ORDER BY id', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('index', { data: '' });
        } else {

            res.render('index', { data: rows });
        }

    });

});

module.exports = router;
