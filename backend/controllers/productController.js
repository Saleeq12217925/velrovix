import Product from '../models/Product.js';

const parseBooleanQuery = (value) => value === true || value === 'true';

export const getProducts = async (req, res, next) => {
  try {
    const { featured, bestseller, newArrival, category, mood, limit, search, sort } = req.query;
    const query = {};

    if (featured !== undefined) query.featured = parseBooleanQuery(featured);
    if (bestseller !== undefined) query.bestseller = parseBooleanQuery(bestseller);
    if (newArrival !== undefined) query.newArrival = parseBooleanQuery(newArrival);
    if (category) query['category.slug'] = String(category).toLowerCase();
    if (mood) query.mood = new RegExp(`^${String(mood)}$`, 'i');

    // Text search across name, description, tags, mood
    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { mood: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Sort options
    const sortMap = {
      newest:     { createdAt: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      bestseller: { bestseller: -1, createdAt: -1 },
    };
    const sortOrder = sortMap[sort] || { createdAt: -1 };

    const maxResults = Math.min(Number(limit) || 24, 48);
    const products = await Product.find(query).sort(sortOrder).limit(maxResults);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      price,
      description,
      richDescription,
      category,
      mood,
      images,
      specifications,
      notes,
      tags,
      featured,
      bestseller,
      newArrival,
      countInStock,
    } = req.body;

    if (!name || !price || !description || !category || !mood) {
      res.status(400);
      throw new Error('Name, price, description, category and mood are required');
    }

    // Auto-generate slug if not provided
    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now()}`;

    // Check slug uniqueness
    const existing = await Product.findOne({ slug: productSlug });
    if (existing) {
      res.status(400);
      throw new Error('A product with this slug already exists. Please use a different name.');
    }

    const product = await Product.create({
      name,
      slug: productSlug,
      price: Number(price),
      description,
      richDescription: richDescription || '',
      category,
      mood,
      images: images || [],
      specifications: specifications || {},
      notes: notes || { top: [], heart: [], base: [] },
      tags: tags || [],
      featured: Boolean(featured),
      bestseller: Boolean(bestseller),
      newArrival: Boolean(newArrival),
      countInStock: Number(countInStock) || 10,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};
