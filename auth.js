const express = require("express");
const router = express.Router();
const db = require("../db/DB"); 


// signup code maintiance is happening here

const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if user already exists
  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (result.length > 0) {
      return res.status(403).json({ message: "User already exists." });
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: "Signup failed." });

      res.status(200).json({ message: "Signup successful!" });
    });
  });
});

// LOGIN Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = result[0];

    // ✅ Compare hashed password with entered password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    res.status(200).json({ message: "Login successful!" });
  });
});


module.exports = router;
