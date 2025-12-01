import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Parser as Json2CsvParser } from "json2csv";
import dotenv from "dotenv";
dotenv.config();


// Auth

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "staff",
    });
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Products
export const allProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add product
export const addProducts = async (req, res) => {
  try {
    const { name, sku, price, stock, category, minimumStockAlert } = req.body;
    if (!name || !sku || !price || !stock || !category || !minimumStockAlert) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const product = await Product.create({
      name,
      sku,
      price,
      stock,
      category,
      minimumStockAlert,
    });
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 


// Edit product
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Product updated successfully", updatedProduct});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Orders
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("productId", "name price stock");
    res.status(200).json({ message: "Orders fetched successfully", orders});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add Order
export const addOrder = async (req, res) => {
  try {
    const { productId, quantity, status } = req.body;
    if ( !productId || !quantity || !status ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const product = await Product.findById(productId).select("name price stock");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const order = await Order.create({
      productId,
      quantity,
      status
    });
    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Edit Order
export const editOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, stock } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (stock !== undefined) {
      await Product.findByIdAndUpdate(order.productId, { stock });
    }
    res.status(200).json({
      message: "Order and Product updated successfully",
      updatedOrder
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Order Notification
export const orderNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order notification sent successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// Export to CSV
export const exportToCSV = async (req, res) => {
  try {
    const users = await User.find();
    const userFields = ["_id", "name", "email", "role"];

    const products = await Product.find();
    const productFields = ["_id", "name", "price", "stock", "category", "minimumStockAlert"];

    const orders = await Order.find();
    const orderfields = ["_id", "productId", "quantity", "status"];

    const parser = new Json2CsvParser();

    const usersCsv = parser.parse(users, { fields: userFields });
    const productsCsv = parser.parse(products, { fields: productFields });
    const ordersCsv = parser.parse(orders, { fields: orderfields });

    const csv = usersCsv + productsCsv + ordersCsv;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=myData.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}