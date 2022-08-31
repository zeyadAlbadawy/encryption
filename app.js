//jshint esversion:6
require('dotenv-extended').load();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/userDB');
var encrypt = require('mongoose-encryption');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// level 2 of securtity with mongoose-encryption
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      // res.render("secrets");
      res.redirect("/login");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
