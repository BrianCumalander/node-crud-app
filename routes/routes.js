const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');

// image upload
var path = require('path');
const { type } = require("os");
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
router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id); // Find user with async/await

        if (!user) {
            return res.redirect('/'); // User not found, redirect to home
        }

        res.render('edit_users', { title: 'Edit User', user }); // Render edit page
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.redirect('/'); // Redirect on unexpected error
    }
});




router.post('/update/:id', upload, async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, phone } = req.body; // Destructuring for concise data access

        let newImage = req.file ? req.file.filename : req.body.old_image; // Conditional image handling

        // Optional: Handle file deletion if necessary (assuming old_image is the filename)
        if (req.file && req.body.old_image) {
            try {
                await fs.promises.unlink('./uploads/' + req.body.old_image); // Use fs.promises for async deletion
            } catch (err) {
                console.error('Error deleting old image:', err);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            image: newImage,
        });

        if (!updatedUser) {
            return res.json({ message: 'User not found', type: 'danger' }); // Handle user not found
        }

        req.session.message = { type: 'success', message: 'User updated successfully!' };
        res.redirect('/');
    } catch (err) {
        console.error('Error updating user:', err);
        res.json({ message: 'Error updating user', type: 'danger' }); // Generic error message
    }
});



// Delete user route
router.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.json({ message: 'User not found', type: 'danger' }); // Handle user not found
        }

        // Handle file deletion (assuming image is stored as a filename)
        if (deletedUser.image) {
            try {
                await fs.promises.unlink('./uploads/' + deletedUser.image); // Use fs.promises for async deletion
            } catch (err) {
                console.error('Error deleting image:', err); // Log the error for debugging
            }
        }

        req.session.message = { type: 'info', message: 'User deleted successfully!' };
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.json({ message: 'Error deleting user', type: 'danger' }); // Generic error message
    }
});


module.exports = router;
