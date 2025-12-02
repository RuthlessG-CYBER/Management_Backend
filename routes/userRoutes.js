import express from "express";
import {
  getAllUsers,
  signup,
  login,
  allProducts,
  addProducts,
  editProduct,
  deleteProduct,
  allOrders,
  addOrder,
  editOrder,
  deleteOrder,
  orderNotification,
  totalOrders,
  totalProducts,
  lowStockCount,
  recentAddedProducts,
  exportToCSV
} from "../controllers/userController.js";

export const router = express.Router();

router.get("/users", getAllUsers);
router.post("/signup", signup);
router.post("/login", login);

router.get("/products", allProducts);
router.post("/products", addProducts);
router.put("/products/:id", editProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", allOrders);
router.post("/orders", addOrder);
router.put("/orders/:id", editOrder);
router.delete("/orders/:id", deleteOrder);
router.get("/orders/:id", orderNotification);



router.get("/total-products", totalProducts);
router.get("/total-orders", totalOrders);

router.get("/low-stock-count", lowStockCount);

router.get("/recent-added-products", recentAddedProducts);

router.get("/export", exportToCSV);