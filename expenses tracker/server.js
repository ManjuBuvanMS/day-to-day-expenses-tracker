const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const authRoutes = require("./server/routes/auth");
app.use(authRoutes);

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}/signup-page.html`);
});
