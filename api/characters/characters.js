'use strict';

const express = require('express');
const checkMw = require("@api/auth/tokenCheckMiddleware");
const { check, validationResult } = require('express-validator/check');

const Character = require("@models/characterModel");

const router = express.Router();



/* ======================================================================================== */
// ROUTES

router.post("/create", checkMw, [check("name").isLength({ min: 2 }).trim().escape()], (req, res) => {

    try
    {
        let char = new Character( {
            
            ownerid: req.userId,
            name: req.body.name
        });

        char.save((err, char) => {

            if (err)
            return res.status(500).send({
                result: "error",
                message: "Oh no! A raccoon broke our database!"
            });

            res.send({status:"ok", message: "Character added to database"});
        });

    }
    catch(err)
    {
        return res.status(400).send({
            result: "error",
            message: "Please check your request data!"
        });
    }

} );



module.exports = router;