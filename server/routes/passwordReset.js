const crypto = require("crypto");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Fix import
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");

// Route: Send password reset email
router.post("/send-reset-email", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User with this email does not exist" });
    }

    // Generate a token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const token = new Token({
      userId: user._id,
      token: resetToken,
      createdAt: Date.now(),
    });
    await token.save();

    // Construct reset link
    const resetLink = `${process.env.BASE_URL}/password-reset/${user._id}/${resetToken}`;

    // Send reset email
    await sendEmail(user.email, "Password Reset Request", `Click here to reset your password: ${resetLink}`);
    res.status(200).send({ message: "Reset password link sent to your email." });
  } catch (error) {
    console.error("Error in sending reset email:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Route: Reset the password
router.post("/:userId/:token", async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { password } = req.body;

    // Debugging logs (without displaying the plain password)
    console.log("User ID:", userId);
    console.log("Token:", token);

    // Validate token
    const tokenRecord = await Token.findOne({ userId, token });
    if (!tokenRecord) {
      return res.status(400).send({ message: "Invalid or expired token" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log("User found:", {
      _id: user._id,
      email: user.email,
    }); // Only log non-sensitive information

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    user.password = hashedPassword;
    await user.save({ validateModifiedOnly: true });

    // Remove the token
    await tokenRecord.deleteOne();

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetting password:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;











