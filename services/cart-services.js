const {
  createCartData,
  deleteCartData,
  getCartData,
} = require("../data/cart-data");

exports.getCartItems = async (user) => {
  return await getCartData(user.id);
};

exports.addToCart = async (user, body) => {
  const data = { user_id: user.id, course_id: body.course_id };
  return await createCartData(data);
};

exports.removeFromCart = async (cartId) => {
  return await deleteCartData(cartId);
};
