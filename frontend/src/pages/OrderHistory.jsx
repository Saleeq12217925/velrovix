import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ShoppingBag,
  CheckCircle2, XCircle, Clock, Truck, Package,
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'text-amber-400  bg-amber-400/10  border-amber-400/20',    icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-400   bg-blue-400/10   border-blue-400/20',     icon: Package },
  shipped:    { label: 'Shipped',    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',   icon: Truck },
  delivered:  { label: 'Delivered',  color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  color: 'text-red-400    bg-red-400/10    border-red-400/20',      icon: XCircle },
};

const TABS = [
  { id: 'active',    label: 'Active Orders',  statuses: ['pending', 'processing', 'shipped'] },
  { id: 'delivered', label: 'Delivered',       statuses: ['delivered'] },
  { id: 'cancelled', label: 'Cancelled',       statuses: ['cancelled'] },
];

const OrderCard = ({ order }) => {
  const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-luxury-darkGray/20 border border-white/5 rounded-2xl p-6 hover:border-luxury-accent/20 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Left: Order info */}
        <div className="space-y-3 flex-1 min-w-0">
          {/* Order ID + date */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-mono text-sm text-luxury-cream font-semibold">
              #{order._id.slice(-8).toUpperCase()}
            </span>
            <span className="font-sans text-[10px] text-luxury-neutralGray">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 border px-3 py-0.5 rounded-full font-sans text-[9px] tracking-widest uppercase ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>

          {/* Items list */}
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, i) => (
              <p key={i} className="font-sans text-xs text-luxury-neutralGray truncate">
                {item.qty}× {item.name}
              </p>
            ))}
            {order.items.length > 2 && (
              <p className="font-sans text-[10px] text-luxury-neutralGray/50 italic">
                +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Right: Total + CTA */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 flex-shrink-0">
          <p className="font-serif text-xl text-luxury-accent">
            ${order.totalPrice.toLocaleString()}
          </p>
          <Link
            to={`/order/${order._id}`}
            className="inline-flex items-center gap-2 font-sans text-[9px] tracking-[0.2em] uppercase font-bold text-luxury-black bg-luxury-accent px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors"
          >
            View <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const OrderHistory = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/mine');
        if (data.success) setOrders(data.orders);
      } catch {
        showToast({ message: 'Failed to load orders', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [showToast]);

  const currentTab = TABS.find(t => t.id === activeTab);
  const filtered = orders.filter(o => currentTab.statuses.includes(o.orderStatus));

  const countFor = (tab) => orders.filter(o => tab.statuses.includes(o.orderStatus)).length;

  return (
    <main className="min-h-screen bg-luxury-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Back */}
        <Link to="/profile"
          className="inline-flex items-center gap-2 font-sans text-[10px] tracking-widest text-luxury-neutralGray hover:text-luxury-cream transition-colors uppercase">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
        </Link>

        {/* Header */}
        <header className="space-y-2">
          <span className="font-sans text-[9px] tracking-[0.4em] text-luxury-accent font-semibold uppercase">Your Account</span>
          <h1 className="font-serif text-4xl tracking-luxury text-luxury-cream">Your Orders</h1>
          <p className="font-sans text-xs text-luxury-neutralGray">
            {orders.length === 0 ? 'No orders yet' : `${orders.length} total order${orders.length !== 1 ? 's' : ''}`}
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit">
          {TABS.map(tab => {
            const count = countFor(tab);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-sans text-[10px] tracking-widest uppercase transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-luxury-accent text-luxury-black font-bold'
                    : 'text-luxury-neutralGray hover:text-luxury-cream'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                    activeTab === tab.id ? 'bg-luxury-black/20 text-luxury-black' : 'bg-white/10 text-luxury-neutralGray'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span className="w-8 h-8 border border-luxury-accent/30 border-t-luxury-accent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-luxury-neutralGray/20" />
                </div>
                <div className="space-y-2">
                  <p className="font-serif text-xl text-luxury-cream">
                    {activeTab === 'active' && 'No active orders'}
                    {activeTab === 'delivered' && 'No delivered orders yet'}
                    {activeTab === 'cancelled' && 'No cancelled orders'}
                  </p>
                  <p className="font-sans text-xs text-luxury-neutralGray">
                    {activeTab === 'active'
                      ? 'Place an order to see it here.'
                      : 'Your orders will appear here once updated.'}
                  </p>
                </div>
                {activeTab === 'active' && (
                  <Link to="/catalog"
                    className="inline-flex items-center gap-2 bg-luxury-accent text-luxury-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-6 py-3 rounded-xl hover:bg-amber-400 transition-colors">
                    SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filtered.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>
    </main>
  );
};

export default OrderHistory;
