const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

// image upload
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.origionalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image"); // "image" matches the 'name' image atribute that is found in add_users.ejs form section of the code.

// Insert a user in to database route, using a .post request
// /add is taken from the forms action located in add_users.ejs
// the const user parameters are from the /models/users.js file.
router.post("/add", upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
    // using save from the mongoose library
    user.save((err) => {
        if (err) {
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "User added successfully!",
            };
            res.redirect("/");
        }
    });
});

// create a response to serve /
router.get("/", (req, res) => {
    res.render("index", { title: "Home Page" });
});

router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users Page" });
});

module.exports = router;
