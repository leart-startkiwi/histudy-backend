const express = require("express");
const { authenticateToken } = require("../middleware/jwt");
const { deleteCartData } = require("../data/cart-data");
const { createAssignedCourseData } = require("../data/assigned-courses-data");
const stripe = require("stripe")(
  "sk_test_51PzQHZDpaV13eo6WOOnJdZSXVoqLJx85S4CqhkP79OzywoxYHA2utGMWpVCGUivE0OSIJiDBeb5u5hKPmHhmzIS300zZcviy8T"
);

const router = express.Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        "whsec_hasvXFUtn3qPy2y2eUNUZOQeni5oXtXV"
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      for (const courseId of session.metadata?.courseIds.split(",")) {
        await createAssignedCourseData({
          user_id: session.metadata.user_id,
          course_id: courseId,
        });
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
