import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt"; // for password hashing

const router = express.Router();

// GET /users/register - Show registration form
router.get("/register", (req, res) => {
  res.render("users/register", { title: "Register" });
});

// POST /users/register - Process registration form
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.redirect("/users/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during registration.");
  }
});

// GET /users/login - Show login form
router.get("/login", (req, res) => {
  res.render("users/login", { title: "Login" });
});

// POST /users/login - Process login form
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }
    // Store user info in session (you might choose to store only minimal info)
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during login.");
  }
});

// GET /users/logout - Log out user
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Could not log out.");
    }
    res.redirect("/");
  });
});

export default router;
