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

// ADD NEW ITEM
router.post('/add', function (req, res, next) {
    
    req.assert('id', 'ID is required').notEmpty()           //Validate name
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('qty', 'Quantity is required').notEmpty()        //Validate quantity
    req.assert('amount', 'Amount is required').notEmpty()        //Validate amount

    var errors = req.validationErrors()

    if (!errors) {   //No errors were found.  Passed Validation!

        var user = {
            id: req.sanitize('id').escape().trim(),
            name: req.sanitize('name').escape().trim(),
            qty: req.sanitize('qty').escape().trim(),
            amount: req.sanitize('amount').escape().trim()
        }

        connection.query('INSERT INTO items SET ?', user, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // refresh the page
                res.redirect('/');
            } else {
                req.flash('success', 'Data added successfully!');

                // refresh the page
                res.redirect('/');
            }
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })

        req.flash('error', error_msg)

        // refresh the page
        res.redirect('/');
    }
})

module.exports = router;
