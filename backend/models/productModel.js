import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, { timestamps: true })


const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    default: 3,
  },
  category: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  image: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  reviews: [reviewSchema],
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
}, { timestamps: true });


export const Product = mongoose.model('Product', productSchema);

