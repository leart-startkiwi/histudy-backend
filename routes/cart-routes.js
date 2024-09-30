const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCartItems,
} = require("../services/cart-services");
const {
  handlePostRequest,
  handleDeleteRequest,
  handleGetRequest,
} = require("../services/baseController");
const { authenticateToken } = require("../middleware/jwt");
const stripe = require("stripe")(
  "sk_test_51PzQHZDpaV13eo6WOOnJdZSXVoqLJx85S4CqhkP79OzywoxYHA2utGMWpVCGUivE0OSIJiDBeb5u5hKPmHhmzIS300zZcviy8T"
);

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  await handleGetRequest(
    () => getCartItems(req.user),
    "Failed to get cart items",
    res
  );
});

router.post("/", authenticateToken, async (req, res) => {
  await handlePostRequest(
    () => addToCart(req.user, req.body),
    "Failed to add course to cart",
    req,
    res
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  await handleDeleteRequest(
    () => removeFromCart(req.params.id),
    "Failed to remove course from cart",
    res
  );
});

router.post("/create-checkout-session", authenticateToken, async (req, res) => {
  const { products } = req.body;

  let lineItems = [];

  for (const product of products) {
    const price_data = {
      currency: "usd",
      product_data: {
        name: product.course.name,
        images: [
          `https://d6c3-46-99-35-244.ngrok-free.app${product.course.image.replace(
            "http://localhost:8000",
            ""
          )}`,
        ],
      },
      unit_amount: Math.round(product.course.price * 100),
    };
    lineItems.push({ price_data, quantity: 1 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:5173/my-courses/learning`,
    cancel_url: "http://localhost:5173/cart",
    metadata: {
      user_id: req.user.id,
      courseIds: products?.map((product) => product?.course_id).join(","),
    },
  });

  res.json({ id: session.id });
});

module.exports = router;
