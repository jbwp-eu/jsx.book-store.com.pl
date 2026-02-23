import express from "express";

import {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

import fileUpload from "../middleware/file-upload.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);

router.get("/top", getTopProducts);

router
  .route("/:id")
  .get(checkObjectId, getProductById)
  .patch(
    protect,
    admin,
    checkObjectId,
    fileUpload.single("image"),
    updateProduct
  )
  .delete(protect, admin, checkObjectId, deleteProduct);

router.route("/:id/reviews").post(protect, checkObjectId, createProductReview);

export default router;
