const express = require("express");
const router = express.Router();
const passport = require('passport')

router.get("/login", function (req, res) {
    res.sendFile('login.html', { root: './html' })
  })

// Login route
router.post('/login', passport.authenticate('local'), function (req, res) {
    try {
        res.redirect('/client')
    } catch (e) {
        console.log(e)
    }
});

// Signup route
router.get('/signup', function (req, res) {
    res.sendFile('signup.html', { root: './html' })
});

// Pass reset route
router.get('/passreset', function (req, res) {
    res.sendFile('passreset.html', { root: './html' })
});

// Logout route
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    });
});

module.exports = router;