import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Set __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static assets
app.use(express.static(path.join(__dirname, "public")));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure express-session
app.use(
  session({
    secret: "your_secret_key", // Replace with a secure random string
    resave: false,
    saveUninitialized: false,
  })
);

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err));

// Home route – render the homepage (includes navbar)
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Mount routers
app.use("/products", productsRouter);
app.use("/cart", cartRouter);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
