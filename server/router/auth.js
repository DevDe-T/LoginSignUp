const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("../db/conn");
const User = require("../db/model/userSchema");
const Contact = require("../db/model/contactSchema");
const authenticate = require("../middleware/authenticate");

router.get("/", (req, res) => {
	res.send("router js ");
});

router.post("/register", async (req, res) => {
	const { name, email, phone, work, password, cpassword } = req.body;

	if (!name || !email || !phone || !work || !password || !cpassword) {
		return res.status(422).json({ error: "fill all fields" });
	}

	try {
		const userExist = await User.findOne({ email: email });
		if (userExist) {
			return res.status(422).json({ error: "Email already Exists" });
		} else if (password !== cpassword) {
			return res
				.status(422)
				.json({ error: "Password and cPassword not matching" });
		}
		const user = new User({ name, email, phone, work, password, cpassword });

		const userRegister = await user.save();

		if (userRegister) {
			res.status(201).json({ message: "success" });
		} else {
			res.status(500).json({ error: "Failed" });
		}
	} catch (err) {
		console.log(err);
	}
});

//login Route

router.post("/signin", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({ error: "Failed" });
		}

		const userLogin = await User.findOne({ email: email });

		if (userLogin) {
			const isMatch = await bcrypt.compare(password, userLogin.password);

			const token = await userLogin.generateAuthToken();

			// console.log(token);

			res.cookie("jwtoken", token, {
				expires: new Date(Date.now() + 25892000000),
				httpOnly: true,
			});

			if (!isMatch) {
				res.status(400).json({ error: "Invalid credentials" });
			} else {
				res.status(200).json({ message: "User sign in success" });
			}
		} else {
			res.status(400).json({ error: "Invalid credentials" });
		}
	} catch (err) {
		console.log(err);
	}
});

//about us page

router.get("/about", authenticate, (req, res) => {
	console.log("Hello my about");
	res.send(req.rootUser);
});

//contact us page

router.post("/contact", async (req, res) => {
	const { name, email, subject, message } = req.body;

	if (!name || !email || !subject || !message) {
		return res.status(422).json({ error: "fill all fields" });
	}
	try {
		const contact = new Contact({ name, email, subject, message });

		const newContact = await contact.save();

		if (newContact) {
			res.status(201).json({ message: "success" });
		} else {
			res.status(500).json({ error: "Failed" });
		}
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
