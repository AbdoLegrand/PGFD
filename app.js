const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const app = express(); 

// Connect to the database
mongoose.connect(
    // "mongodb+srv://22053:22053@cluster0.32cnakv.mongodb.net/"
    "mongodb://localhost:27017/users"
).then( () =>{
    console.log("Connected successfully");
})
.catch( (error) =>{
    console.log("Error with connecting with the DB", error )
})


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('uploads'));

// Set template engine
app.set('view engine', 'ejs');

// Route prefix
app.use("", require("./routes/utilisateurs"));


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(2000, () =>{
    console.log("Server is atarting in th port 2000...");
})