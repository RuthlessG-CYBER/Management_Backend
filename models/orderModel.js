import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ["pending", "processing", "shipped"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);