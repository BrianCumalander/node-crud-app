// imports
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;

// db connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to the database!'));

// middleware
// had said app.arguments(express.urlencoded({ extended: false })); but app.arguments, arguments to be exact, gave some issues. 
app.options(express.urlencoded({ extended: false }));
app.options(express.json());

// used when saving a new user to the database
app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})



// set template engine
app.set("view engine", "ejs");


// route prefix
//app.use("", require("./routes/routes"));
app.use("/", require("./routes/routes"));

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});