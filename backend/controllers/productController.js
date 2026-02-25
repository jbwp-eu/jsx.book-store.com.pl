import { Product } from "../models/productModel.js";

import fs from "fs";

export const getProducts = async (req, res, next) => {
  const { pageNumber, keyword } = req.query;

  const pageSize = process.env.PAGINATION_LIMIT;

  const page = pageNumber === "undefined" ? 1 : Number(pageNumber);

  const key =
    String(keyword) === "undefined"
      ? {}
      : { title: { $regex: keyword, $options: "i" } };

  try {
    let products = await Product.find({ ...key })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const count = await Product.countDocuments({ ...key });

    if (!products) {
      res.status(404);
      throw new Error(req.t("product.couldNotFindAny"));
    }

    res.json({
      products: products.map((product) => product.toObject({ getters: true })),
      pages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    let product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error(req.t("product.notFound"));
    }

    res.json(product.toObject({ getters: true }));
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, price, countInStock, category, link } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error(req.t("product.notFound"));
    }

    const imagePath = product.image && String(product.image);
    if (req.file && imagePath?.slice(0, 7) === "uploads") {
      fs.unlink(`uploads/${imagePath.slice(8)}`, (err) => {
        if (err) {
          console.log(
            `An image ${product.title} did not exist in an uploads directory`
          );
        }
      });
    } else if (
      !req.file &&
      imagePath?.slice(0, 7) === "uploads" &&
      req.body.link?.slice(0, 7) === "https:/"
    ) {
      fs.unlink(`uploads/${imagePath.slice(8)}`, (err) => {
        if (err) {
          console.log(
            `An image ${product.title} did not exist in an uploads directory`
          );
        }
      });
    }

    product.title = title;
    product.description = description;
    product.price = price;
    product.countInStock = countInStock;
    product.category = category;
    product.image = req.file?.path || link || "";

    const updatedProduct = await product.save();

    res.status(200).json({
      message: req.t("product.updated"),
      updatedProduct: updatedProduct.toObject({ getters: true }),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  const pageSize = process.env.PAGINATION_LIMIT;

  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error(req.t("product.notFound"));
    }

    if (product.image.slice(0, 7).toString() === "uploads") {
      fs.unlink(`uploads/${product.image.slice(8)}`, (err) => {
        if (err) {
          console.log(
            `An image ${product.title} did not exist in an uploads directory`
          );
        }
      });
    }

    await product.deleteOne();

    const count = await Product.countDocuments({});

    res.json({
      message: req.t("product.deleted"),
      pages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  const pageSize = process.env.PAGINATION_LIMIT;

  try {
    const product = new Product({
      title: "Test",
      description: "Sample description",
      price: 1,
      category: "books",
      image: "test",
      user: req.user.id,
    });

    await product.save();

    const count = await Product.countDocuments({});

    res.status(201).json({
      message: req.t("product.sampleCreated"),
      pages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    next(err);
  }
};

export const createProductReview = async (req, res, next) => {
  const { rate, comment } = req.body;
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error(req.t("product.notFound"));
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      res.status(400);
      return next({
        message: req.t("product.alreadyReviewed"),
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rate),
      comment,
      user: req.user.id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({
      message: req.t("product.reviewAdded"),
    });
  } catch (err) {
    next(err);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ rating: "desc" }).limit(3);

    if (!products) {
      res.status(404);
      throw new Error(req.t("product.couldNotFindTop"));
    }

    res.json(products.map((product) => product.toObject({ getters: true })));
  } catch (err) {
    next(err);
  }
};
