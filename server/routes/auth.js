const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Find the user
    const user = await User.findOne({ email: req.body.email }).select(
      "password email"
    );
    if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

    // Compare the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    // Adjusted Logging
    if (process.env.DEBUG === "true") {
      console.log("Password Match:", validPassword);
      console.log("Login successful for user:", req.body.email);
    }

    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    // Generate a JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWTPRIVATEKEY, {
      expiresIn: "7d",
    });

    // Send the token to the client
    res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    console.error("Login error:", error); // Keep this log for unexpected errors
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Validation function for login data
const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;




