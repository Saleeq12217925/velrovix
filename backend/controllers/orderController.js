import Order from '../models/Order.js';

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Protected
 */
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No items in order');
    }

    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingPrice = itemsTotal > 10000 ? 0 : 150; // free shipping over $10k
    const taxPrice = Math.round(itemsTotal * 0.08); // 8% tax
    const totalPrice = itemsTotal + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'Card',
      itemsTotal,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders for the logged-in user
 * @route   GET /api/orders/mine
 * @access  Protected
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single order by ID
 * @route   GET /api/orders/:id
 * @access  Protected (owner or admin)
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Only the owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get ALL orders (admin only)
 * @route   GET /api/orders
 * @access  Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    if (req.body.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }
    const updated = await order.save();
    res.status(200).json({ success: true, order: updated });
  } catch (error) {
    next(error);
  }
};
