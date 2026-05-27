import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, CheckCircle2, FileText, Truck,
  ShieldCheck, MapPin, XCircle, Clock,
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

// ── Status → tracker step mapping ────────────────────────────
const STATUS_STEPS = {
  pending:    0,  // Only "Confirmed" lit
  processing: 1,  // "Confirmed + Preparing" lit
  shipped:    2,  // "Confirmed + Preparing + In Transit" lit
  delivered:  3,  // All 4 lit
  cancelled:  -1, // Special cancelled view
};

const TRACKER_STEPS = [
  { icon: FileText,     label: 'Confirmed'  },
  { icon: Package,      label: 'Preparing'  },
  { icon: Truck,        label: 'In Transit' },
  { icon: CheckCircle2, label: 'Delivered'  },
];

const STATUS_BADGE = {
  pending:    { color: 'text-amber-400 border-amber-400/30 bg-amber-400/5',   label: 'Pending' },
  processing: { color: 'text-blue-400 border-blue-400/30 bg-blue-400/5',      label: 'Processing' },
  shipped:    { color: 'text-purple-400 border-purple-400/30 bg-purple-400/5', label: 'Shipped' },
  delivered:  { color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5', label: 'Delivered' },
  cancelled:  { color: 'text-red-400 border-red-400/30 bg-red-400/5',         label: 'Cancelled' },
};

const OrderDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch {
        showToast({ message: 'Failed to retrieve order details.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, showToast]);

  if (loading) {
    return (
      <main className="min-h-screen bg-luxury-black pt-32 pb-24 flex items-center justify-center">
        <span className="w-8 h-8 border border-luxury-accent/30 border-t-luxury-accent rounded-full animate-spin" />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-luxury-black pt-32 pb-24 flex items-center justify-center text-luxury-cream text-center font-serif text-2xl">
        Order not found.
      </main>
    );
  }

  const activeStep = STATUS_STEPS[order.orderStatus] ?? 0;
  const isCancelled = order.orderStatus === 'cancelled';
  const badge = STATUS_BADGE[order.orderStatus];
  const progressPct = activeStep >= 0 ? (activeStep / (TRACKER_STEPS.length - 1)) * 100 : 0;

  return (
    <main className="min-h-screen bg-luxury-black relative pt-32 pb-24 px-6 md:px-12">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-luxury-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">

        {/* Back link */}
        <Link to="/orders" className="inline-flex items-center gap-2 font-sans text-[10px] tracking-luxury text-luxury-neutralGray hover:text-luxury-cream transition-colors uppercase">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Order History
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <span className="font-sans text-[9px] tracking-[0.4em] text-luxury-accent font-semibold uppercase">Order Receipt</span>
            <h1 className="font-serif text-3xl md:text-4xl text-luxury-cream">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="font-sans text-xs text-luxury-neutralGray">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Order status badge */}
            <span className={`border px-4 py-2 rounded font-sans text-[9px] tracking-widest uppercase flex items-center gap-2 ${badge?.color}`}>
              {isCancelled ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {badge?.label}
            </span>
            {/* Payment badge */}
            <span className={`border px-4 py-2 rounded font-sans text-[9px] tracking-widest uppercase flex items-center gap-2 ${
              order.isPaid
                ? 'border-emerald-400/30 text-emerald-400 bg-emerald-400/5'
                : 'border-amber-400/30 text-amber-400 bg-amber-400/5'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {order.isPaid ? 'Paid' : 'Payment Pending'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ── Main Column ── */}
          <div className="md:col-span-2 space-y-8">

            {/* ── Logistics Tracker ── */}
            <div className="bg-luxury-darkGray/30 border border-white/5 rounded-xl p-8">
              <h2 className="font-sans text-[10px] tracking-luxury text-luxury-cream uppercase mb-8">Order Status</h2>

              {isCancelled ? (
                /* Cancelled view */
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <p className="font-serif text-xl text-luxury-cream mb-1">Order Cancelled</p>
                    <p className="font-sans text-xs text-luxury-neutralGray">This order has been cancelled. If you believe this is an error, please contact support.</p>
                  </div>
                </motion.div>
              ) : (
                /* Active tracker */
                <div className="relative">
                  {/* Background rail */}
                  <div className="absolute top-4 left-4 right-4 h-[2px] bg-white/5 z-0" />
                  {/* Progress fill */}
                  <motion.div
                    className="absolute top-4 left-4 h-[2px] bg-luxury-accent z-0 origin-left"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    style={{ maxWidth: 'calc(100% - 2rem)' }}
                  />

                  <div className="relative z-10 flex items-start justify-between">
                    {TRACKER_STEPS.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index <= activeStep;
                      const isCurrent = index === activeStep;
                      return (
                        <div key={step.label} className="flex flex-col items-center gap-3 flex-1">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 * index + 0.2 }}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                              isActive
                                ? 'border-luxury-accent bg-luxury-accent/10 text-luxury-accent'
                                : 'border-white/10 bg-luxury-black text-white/20'
                            } ${isCurrent ? 'shadow-[0_0_16px_rgba(197,165,114,0.3)]' : ''}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </motion.div>
                          <span className={`font-sans text-[9px] tracking-widest uppercase text-center leading-tight transition-colors ${
                            isActive ? 'text-luxury-accent' : 'text-luxury-neutralGray/30'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status description */}
              {!isCancelled && (
                <p className="mt-8 font-sans text-[10px] text-luxury-neutralGray text-center leading-relaxed">
                  {{
                    pending:    '🕐 Your order has been confirmed and is awaiting processing.',
                    processing: '📦 Our team is carefully preparing your items for shipment.',
                    shipped:    '🚚 Your order is on its way! Expect delivery within 3–7 business days.',
                    delivered:  '✅ Your order has been delivered. Enjoy your purchase!',
                  }[order.orderStatus]}
                </p>
              )}
            </div>

            {/* ── Items ── */}
            <div className="space-y-6">
              <h2 className="font-sans text-[10px] tracking-luxury text-luxury-cream uppercase border-b border-white/5 pb-4">Items Ordered</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex gap-6 bg-luxury-darkGray/10 border border-white/5 p-4 rounded-xl items-center hover:border-luxury-accent/30 transition-colors">
                    <div className="w-20 h-24 bg-luxury-black rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-serif text-lg text-luxury-cream tracking-wide">{item.name}</h3>
                      <p className="font-sans text-[9px] tracking-widest uppercase text-luxury-neutralGray">QTY: {item.qty}</p>
                    </div>
                    <div className="font-serif text-lg text-luxury-accent">
                      ${(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Certificate of Authenticity */}
            <div className="bg-gradient-to-br from-luxury-accent/20 to-luxury-black border border-luxury-accent/30 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 text-luxury-accent/10 group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-3">
                <ShieldCheck className="w-6 h-6 text-luxury-accent" />
                <h3 className="font-serif text-lg text-luxury-cream">Certificate of Authenticity</h3>
                <p className="font-sans text-[10px] text-luxury-neutralGray leading-relaxed">
                  Your order is registered on the Velrovix registry. A physical certificate will be included with your delivery.
                </p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-luxury-darkGray/20 border border-white/5 rounded-xl p-6 space-y-5">
              <h3 className="font-sans text-[10px] tracking-luxury text-luxury-cream uppercase border-b border-white/5 pb-4">Order Summary</h3>
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between text-luxury-neutralGray">
                  <span>Subtotal</span>
                  <span className="text-luxury-cream">${Math.round(order.totalPrice / 1.08).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-luxury-neutralGray">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Included</span>
                </div>
                <div className="flex justify-between text-luxury-neutralGray">
                  <span>Tax (8%)</span>
                  <span className="text-luxury-cream">${Math.round(order.totalPrice - order.totalPrice / 1.08).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-luxury-accent/20 items-baseline">
                  <span className="text-[9px] tracking-widest uppercase text-luxury-cream">Total</span>
                  <span className="font-serif text-2xl text-luxury-accent">${order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-luxury-darkGray/20 border border-white/5 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-luxury-cream border-b border-white/5 pb-4">
                <MapPin className="w-4 h-4 text-luxury-accent" />
                <h3 className="font-sans text-[10px] tracking-luxury uppercase">Shipping Address</h3>
              </div>
              <div className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
                <p className="text-luxury-cream font-medium mb-1">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
