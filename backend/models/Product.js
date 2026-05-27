import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    richDescription: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Product price cannot be negative'],
    },
    category: {
      name: {
        type: String,
        required: true,
        enum: ['Watches', 'Perfumes'],
      },
      slug: {
        type: String,
        required: true,
        enum: ['watches', 'perfumes'],
      },
    },
    mood: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    notes: {
      top: {
        type: [String],
        default: [],
      },
      heart: {
        type: [String],
        default: [],
      },
      base: {
        type: [String],
        default: [],
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    countInStock: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ featured: 1, bestseller: 1, newArrival: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
