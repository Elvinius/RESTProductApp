const express = require("express"); //Express helps us to create RESTful routes easiliy.
const app = express(); //We activate the Express with the help of this command.
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv/config');

app.use(cors()); //to enable the cors for fetching
app.use(bodyParser.json());

//Import Routes
const categoriesRoute = require('./routes/categories'); 
const productsRoute = require('./routes/products'); 

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use('/categories', categoriesRoute, productsRoute); // using the middleware to have it categories route always available 

//function to connect the database for test calls
function connect() {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'test') {
        const Mockgoose = require('mockgoose').Mockgoose;
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.prepareStorage()
          .then(() => {
            mongoose.connect(process.env.DB_CONNECTION,
              { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true })
              .then((res, err) => {
                if (err) return reject(err);
                console.log("Connected to DB");
                resolve();
              })
          })
      } else {
          mongoose.connect(process.env.DB_CONNECTION,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true })
            .then((res, err) => {
              if (err) return reject(err);
              console.log("Connected to DB");
              resolve();
            });
       } 
    });
}

//function to close the database for test calls
function close() {
  return mongoose.disconnect();
}

connect();
app.listen(process.env.PORT);
module.exports = { app, connect, close };