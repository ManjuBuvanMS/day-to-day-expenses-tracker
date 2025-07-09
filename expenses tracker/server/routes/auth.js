const express = require("express");
const router = express.Router();

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  console.log("Received signup:", name, email, password);

  // In real app: Save to DB, validate input, hash password
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  res.json({ message: "Signup successful!" });
});

module.exports = router;
