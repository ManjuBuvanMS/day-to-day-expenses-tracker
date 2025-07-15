const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db/DB");

const SECRET = process.env.JWT_SECRET || "default_secret";

// ✅ Middleware to check token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ✅ GET user’s own expenses (include id for edit/delete)
router.get("/expenses", authenticateToken, (req, res) => {
  db.query(
    "SELECT id, amount, description, category, created_at FROM expenses WHERE userId = ? ORDER BY created_at DESC",
    [req.user.id],
    (err, results) => {
      if (err) return res.sendStatus(500);
      res.json(results);
    }
  );
});

// ✅ POST new expense
router.post("/expenses", authenticateToken, (req, res) => {
  const { amount, description, category } = req.body;
  db.query(
    "INSERT INTO expenses (userId, amount, description, category) VALUES (?, ?, ?, ?)",
    [req.user.id, amount, description, category],
    (err) => {
      if (err) return res.sendStatus(500);
      res.status(201).json({ message: "Expense added" });
    }
  );
});

// ✅ DELETE expense
router.delete("/expenses/:id", authenticateToken, (req, res) => {
  const expenseId = req.params.id;
  const userId = req.user.id;

  db.query(
    "DELETE FROM expenses WHERE id = ? AND userId = ?",
    [expenseId, userId],
    (err, result) => {
      if (err) {
        console.error("❌ Delete error:", err);
        return res.status(500).json({ message: "DB delete failed" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Expense not found or unauthorized" });
      }

      res.status(200).json({ message: "Expense deleted" });
    }
  );
});

// ✅ UPDATE expense
router.put("/expenses/:id", authenticateToken, (req, res) => {
  const { amount, description, category } = req.body;
  const userId = req.user.id;
  const expenseId = req.params.id;

  console.log("🔧 PUT /expenses called");
  console.log("➡️ Data:", { amount, description, category });
  console.log("➡️ ID:", expenseId);
  console.log("➡️ User:", userId);

  db.query(
    "UPDATE expenses SET amount = ?, description = ?, category = ? WHERE id = ? AND userId = ?",
    [amount, description, category, expenseId, userId],
    (err, result) => {
      if (err) {
        console.error("❌ Update error:", err);
        return res.status(500).json({ message: "Failed to update" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Expense not found or unauthorized" });
      }

      res.status(200).json({ message: "Expense updated" });
    }
  );
});

module.exports = router;
