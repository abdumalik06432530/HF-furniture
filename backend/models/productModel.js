// models/productModel.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    colors: { type: [String], required: true },
    quantity: { type: Number, required: true },
  bestseller: { type: Boolean, default: false },
    image: { type: [String], default: [] },
    date: { type: Date, default: Date.now },
    // track last editor and timestamp
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastEditedAt: { type: Date },
    lastQuantityDelta: { type: Number },
    // total sold quantity across orders
    soldCount: { type: Number, default: 0 },
    // history of edits to the product (who, when, changes)
    editHistory: {
      type: [
        {
          editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          editedAt: { type: Date },
          changes: { type: Object },
        },
      ],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
