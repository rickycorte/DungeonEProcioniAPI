'use strict';

const express = require('express');
const checkMw = require("@api/auth/tokenCheckMiddleware");
const { check, validationResult } = require('express-validator/check');
const validator = require("./validator");

const Character = require("@models/characterModel");

const router = express.Router();


/* ======================================================================================== */
// ROUTES

router.post("/create", checkMw, [check("character_name").isLength({ min: 2 }).trim().escape()], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ status: "error", errors: errors.array() });
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
                    message: "Unable to connect to database"
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
        return res.status(422).json({ status: "error", errors: errors.array() });
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



router.post("/update", checkMw, [check("character_id").isLength({min: 2}).trim().escape(),
        check("data").isLength({min: 2}).trim().escape()], (req, res)=>
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ status: "error", errors: errors.array() });
    }

    console.log("Updating charater for: "+ req.userId);
    try
    {

        let valid_json = validator.validate(req.body.data);
        if(valid_json === null) 
            throw "Submited data is not valid!";
        
        Character.updateOne({ownerid: req.userId, _id: req.body.character_id}, {data: valid_json},
        (err, result) =>
            {
                if(err) return res.status(500).send({ status: "error", message: "There was a problem updating your character" });

                if(result)
                {
                    return res.status(200).send({
                        result: "ok",
                        message: "Updated character"
                    });
                }
                else
                {
                    return res.status(400).send({
                        result: "error",
                        message: "Unable to update character"
                    });
                }
            });



    }
    catch (err) {
        return res.status(400).send({
            result: "error",
            message: "Please check your request data! " + err
        });
    }

});

module.exports = router;