const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');


// image upload
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
    //    cb(null, file.fieldname + "_" + Date.now() + "_" + file.origionalname);
          cb(null, file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname)) //Appending extension
    },
});

var upload = multer({
    storage: storage,
}).single("image"); // "image" matches the 'name' image atribute that is found in add_users.ejs form section of the code.

// Insert a user in to database route, using router.post request
// /add is taken from the forms action located in add_users.ejs
// the const user parameters are from the /models/users.js schema
router.post("/add", upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });

        await user.save();

        req.session.message = {
            type: "success",
            message: "User added successfully!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// defined the route and also grabs all users from the database
router.get('/', async (req, res) => {
    try {
      const users = await User.find(); // Fetch users with async/await
      res.render('index', { title: 'Home Page', users }); // Render with data
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.json({ message: 'Error fetching users' }); // Send generic error message
    }
  });

router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

// Edit user route
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, user) => {
        if(err){
            res.redirect('/');
        } else {
            if(user == null){
                res.redirect('/');
            } else {
                res.render("edit_users", {
                    title: "Edit User",
                    user: user,
                });
            }
        }
    });
});

module.exports = router;
