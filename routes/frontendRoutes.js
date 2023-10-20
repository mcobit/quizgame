const express = require("express");
const router = express.Router();
const passport = require('passport')

router.get('/client', function (req, res) {
    res.sendFile('client.html', { root: './html' })
});


module.exports = router;