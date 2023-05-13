const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT;
require("./db/conn");
// const User = require("./db/model/userSchema");

app.use(express.json());

// Linking the router files to make our route easy
app.use(require("./router/auth"));

//Middleware
const middleware = (req, res, next) => {
	console.log(`Hello my middleware`);
	next();
};

app.get("/about", middleware, (req, res) => {
	res.send("About Me");
});
app.get("/contact", (req, res) => {
	res.send("Contact");
});
app.get("/signin", (req, res) => {
	res.send("Sign in");
});
app.get("/signup", (req, res) => {
	res.send("Sign up");
});

app.listen(PORT, () => {
	console.log("server running on port 8000");
});

//Deepak123

// mongodb+srv://deespace4767:<password>@cluster0.biroeyw.mongodb.net/?retryWrites=true&w=majority
