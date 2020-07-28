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
    
    req.assert('id', 'ID is required').notEmpty()           //Validate id
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

// SHOW EDIT ITEM FORM
router.get('/edit/:id', function (req, res, next) {

    connection.query('SELECT * FROM items WHERE id = "' + req.params.id+'"', function (err, rows, fields) {
        if (err) throw err

        // if item not found
        if (rows.length <= 0) {
            req.flash('error', 'Item not found with id = ' + req.params.id)
            res.redirect('/')
        }
        else { // if item found
            // render to edit.ejs template file
            res.render('edit', {
                title: 'Edit Item',
                id: rows[0].id,
                name: rows[0].name,
                qty: rows[0].qty,
                amount: rows[0].amount
            })
        }
    })

})

// EDIT ITEM 
router.post('/update/:id', function (req, res, next) {
    
    req.assert('id', 'ID is required').notEmpty()           //Validate id
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('qty', 'Quantity is required').notEmpty()        //Validate quantity
    req.assert('amount', 'Amount is required').notEmpty()        //Validate Amount


    var errors = req.validationErrors()

    if (!errors) {

        var user = {
            id: req.sanitize('id').escape().trim(),
            name: req.sanitize('name').escape().trim(),
            qty: req.sanitize('qty').escape().trim(),
            amount: req.sanitize('amount').escape().trim()
        }

        connection.query('UPDATE items SET ? WHERE id = "' + req.params.id+'"', user, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to edit.ejs
                res.render('edit', {
                    title: 'Edit Item',
                    id: rows[0].id,
                    name: rows[0].name,
                    qty: rows[0].qty,
                    amount: rows[0].amount
                })
            } else {
                req.flash('success', 'Data updated successfully!');
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

        
        res.render('/edit', {
            title: 'Edit Item',
            id: req.params.id,
            name: req.body.name,
            email: req.body.email
        })
    }
})

// DELETE Item
router.get('/delete/:id', function (req, res, next) {
    var user = { id: req.params.id }

    connection.query('DELETE FROM items WHERE id = "' + req.params.id + '"', user, function (err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
            // refresh the page
            res.redirect('/')
        } else {
            req.flash('success', 'Item deleted successfully! id = ' + req.params.id)
            // refresh the page
            res.redirect('/')
        }
    })
})

module.exports = router;
