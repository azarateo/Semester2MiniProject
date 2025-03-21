import { ensureAuthenticated } from "../middleware/auth.js";
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Helper: Initialize cart in session if not exists
const initCart = (req) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
};

// GET /cart - Display the shopping cart
// router.get("/", (req, res) => {
//   initCart(req);
//   res.render("cart", { title: "Your Cart", cart: req.session.cart });
// });

// GET /cart - Display the shopping cart (protected)
router.get("/", ensureAuthenticated, (req, res) => {
  initCart(req);
  res.render("cart", { title: "Your Cart", cart: req.session.cart });
});

// POST /cart/add - Add a product to the cart
router.post("/add", async (req, res) => {
  initCart(req);
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const existingItem = req.session.cart.find(
      (item) => item.product._id.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += Number(quantity) || 1;
    } else {
      req.session.cart.push({ product, quantity: Number(quantity) || 1 });
    }
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST /cart/update - Update item quantity in the cart
router.post("/update", (req, res) => {
  initCart(req);
  const { productId, quantity } = req.body;
  const item = req.session.cart.find(
    (item) => item.product._id.toString() === productId
  );
  if (item) {
    item.quantity = Number(quantity);
  }
  res.redirect("/cart");
});

// POST /cart/remove - Remove an item from the cart
router.post("/remove", (req, res) => {
  initCart(req);
  const { productId } = req.body;
  req.session.cart = req.session.cart.filter(
    (item) => item.product._id.toString() !== productId
  );
  res.redirect("/cart");
});

export default router;
