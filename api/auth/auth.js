'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

const User = require("@models/userModel");

const checkMw = require("./tokenCheckMiddleware");


/**
 * Make a jwt token based on mongodb id
 * @param {*} userID 
 */
function makeJWTToken(userID) {
    return jwt.sign(
        { id: userID },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_TOKEN_LIFETIME_SECONDS }
    );
}


/* ======================================================================================== */
// ROUTES


/**
 * Register a new User
 */
router.post('/register', [
    check("name").isLength({ min: 5 }).trim().escape(),
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 8 }).trim()
    ], function (req, res) {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    //TODO: controllare che non esista gia un utente con quella mail

    try {
        let hashedPassword = bcrypt.hashSync(req.body.password, 8);

        let usr = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        usr.save((err, user) => {
            if (err)
                return res.status(500).send({
                    result: "error",
                    message: "Oh no! A raccoon broke our database!"
                });

            // create a token
            let token = makeJWTToken(user._id);

            //console.log("Registered a new user!");
            res.status(200).send({
                result: "ok",
                token: token
            });

        });
    }
    catch (err) {
        return res.status(400).send({
            result: "error",
            message: "Please check your request data!"
        });
    }

});


/**
 * Check if current token is valid
 */
router.get('/check', checkMw, function (req, res) {

    res.status(200).send({
        result: "ok",
        message: "Authenticated"
    });
});


/**
 * Get user profile
 */
router.get('/profile', checkMw, function (req, res) {


    User.findById(req.userId, { password: 0, __v: 0 },
        (err, user) => {
            if (err) {
                return res.status(500).send({ status: "error", message: "There was a problem finding the user." });
            }
            if (!user) return res.status(404).send({ status: "error", message: "No user found." });

            res.status(200).send(user);
        });

});


/**
 * Log the user in
 */
router.post('/login', [
    check("email").isEmail().normalizeEmail()
    ], function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {

        User.findOne({
            email: req.body.email
        },
            (err, user) => {
                if (err)
                    return res.status(500).send({
                        status: "error",
                        auth: false,
                        message: "A raccoon broke our database, please retray later!"
                    });

                if (!user) {
                    return res.status(404).send({
                        status: "error",
                        auth: false,
                        message: "Our raccoouns can't find your account, sorry."
                    });
                }

                let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (!passwordIsValid) {
                    return res.status(404).send({
                        status: "error",
                        auth: false,
                        message: "Not a valid account"
                    });
                }

                let token = makeJWTToken(user._id);

                res.status(200).send({ status: "ok", auth: true, token: token });
            });
    }
    catch (err) {
        return res.status(400).send({
            result: "error",
            message: "Please check your request data!"
        });
    }

});

module.exports = router;