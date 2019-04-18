'use strict';
require('module-alias/register')

const express = require('express');

const app = express();

/* ======================================================================================== */
// SETUP

//load test vars in test env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

//init db
require("@api/database/database")

//TODO: check env vars

app.use(express.json())

/* ======================================================================================== */
// ROUTES

app.use("/auth", require("@api/auth/auth"))

/* ======================================================================================== */
// ERRORS

// Set 404 reply for all wrong routes
app.use((req, res, next) =>{

  let reply = { "status": "error", "message": "Not found" };
  res.status(404);
  res.send(reply);
});

/* ======================================================================================== */
// RUN

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});