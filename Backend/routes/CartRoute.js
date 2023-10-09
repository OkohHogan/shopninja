const express = require("express");
const { isAuthenticatedUser} = require("../middleware/auth");
const {
  addToCart,
  fetchItems,
  deleteItem,
} = require("../controller/CartController");
const router = express.Router();

router.route("/cart/new").post(isAuthenticatedUser, addToCart);
// router.route("/cart/:id").get(isAuthenticatedUser, deleteItem);
// router.route("/cart/me").get(isAuthenticatedUser, fetchItems);
// router
//   .route("/admin/orders")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrdersAdmin);
// router
//   .route("/admin/order/:id")
//   .put(isAuthenticatedUser, authorizeRoles("admin"), updateAdminOrder)
//   .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
