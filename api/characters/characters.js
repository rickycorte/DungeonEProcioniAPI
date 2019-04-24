'use strict';

const express = require('express');
const checkMw = require("@api/auth/tokenCheckMiddleware");
const { check, validationResult } = require('express-validator/check');

const Character = require("@models/characterModel");

const router = express.Router();

/* ======================================================================================== */
// ROUTES

router.post("/create", checkMw, [check("character_name").isLength({ min: 2 }).trim().escape()], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        let char = new Character({

            ownerid: req.userId,
            name: req.body.character_name
        });

        char.save((err, char) => {

            if (err)
                return res.status(500).send({
                    result: "error",
                    message: "Oh no! A raccoon broke our database!"
                });

            res.send({ status: "ok", message: "Character added to database" });
        });

    }
    catch (err) {
        return res.status(400).send({
            result: "error",
            message: "Please check your request data!"
        });
    }

});


router.post("/delete", checkMw, [check("character_id").isLength({min: 2}).trim().escape()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    console.log("Searching: "+ req.body.character_id+" of "+req.userId);
    try {
        Character.findOneAndDelete({ ownerid: req.userId, _id: req.body.character_id }, (err, char) => {
            if(err) return res.status(500).send({ status: "error", message: "There was a problem removing your character" });

            if(char)
                res.status(200).send({status:"ok", message:"Deleted character"});
            else
                res.status(403).send({status:"error", message:"Unable to delete character"});

        });
    }
    catch (err) {
        return res.status(400).send({
            result: "error",
            message: "Please check your request data!"
        });
    }
});


router.get("/listall", checkMw, (req, res)=>
{
    console.log("Retriving charater for: "+ req.userId);
    try
    {
        Character.find({ownerid: req.userId}, {ownerid: 0, __v: 0}, 
            (err, chars) => {
            if (err) {
                return res.status(500).send({ status: "error", message: "There was a problem finding the user characters." });
            }
            let result = {result: "ok", data: []};

            chars.forEach(el => {
                result.data.push(el);
            });

            res.status(200).send(result);
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