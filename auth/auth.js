'use strict';

const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require("@models/user.js")

router.post('/register', function (req, res) {

    try {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);

        var usr = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        usr.save( (err, user) => {
                if (err) 
                return res.status(500).send({result: "error", message: "Oh no! A raccoon broke our database!"});

                // create a token
                var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_TOKEN_LIFETIME_SECONDS
                });

                console.log("Registerd new user!");
                res.status(200).send({ result: "ok", token: token });
            });
    }
    catch (err) {
        return res.status(500).send({result: "error", message: "Please check your request data!" } );
    }

});



router.get('/check', function (req, res) {

    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ result: "error", auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ result: "error", auth: false, message: 'Failed to authenticate token.' });

        res.status(200).send({result: "ok", message: "Authenticated"});
    });
});

module.exports = router;