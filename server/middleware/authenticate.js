const jwt = require("jsonwebtoken");
const User = require("../db/model/userSchema");

const authenticate = async (req, res, next) => {
	try {
		const token = req.cookies.jwtoken;
		const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

		const rootUser = await User.findOne({
			_id: verifyToken._id,
			"tokens.token": token,
		});
		if (!rootUser) {
			throw new Error("user not found");
		}

		req.rootUser = rootUser;

		next();
	} catch (err) {
		res.status(401).send({ unauthorized: "no token provided" });
	}
};

module.exports = authenticate;
