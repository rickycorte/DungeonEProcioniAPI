'use strict';

const express = require('express');
const checkMw = require("@api/auth/tokenCheckMiddleware");


const Character = require("@models/characterModel");

const router = express.Router();



/* ======================================================================================== */
// ROUTES

router.post("/create", checkMw, (req, res) => {

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