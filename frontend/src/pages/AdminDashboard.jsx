import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Users, ShoppingBag, Activity, Plus, Edit2,
  Trash2, Image as ImageIcon, TrendingUp, CheckCircle2, XCircle,
  AlertTriangle, X, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

// ── Stat card ─────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accent, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.01 }}
    className={`relative p-6 bg-luxury-darkGray/30 border rounded-2xl overflow-hidden transition-all duration-300 group ${
      accent ? 'border-luxury-accent/30 shadow-[0_0_30px_rgba(212,175,55,0.05)]' : 'border-white/5 hover:border-white/10'
    }`}
  >
    {/* Animated background glow */}
    <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 ${
      accent ? 'bg-luxury-accent' : 'bg-white'
    }`} />
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          accent ? 'bg-luxury-accent/10 text-luxury-accent' : 'bg-white/5 text-luxury-neutralGray'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="font-sans text-[9px] tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase">
            {trend}
          </span>
        )}
      </div>
      <p className="font-sans text-[10px] tracking-[0.3em] text-luxury-neutralGray uppercase mb-2">{label}</p>
      <p className={`font-serif text-3xl tracking-wide ${accent ? 'text-luxury-accent drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'text-luxury-cream'}`}>
        {value}
      </p>
    </div>
  </motion.div>
);

// ── Status badge ────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    pending:    'border-amber-400/30 text-amber-400 bg-amber-400/5',
    processing: 'border-blue-400/30 text-blue-400 bg-blue-400/5',
    shipped:    'border-purple-400/30 text-purple-400 bg-purple-400/5',
    delivered:  'border-emerald-400/30 text-emerald-400 bg-emerald-400/5',
    cancelled:  'border-red-400/30 text-red-400 bg-red-400/5',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded border font-sans text-[9px] tracking-widest uppercase ${map[status] || 'border-white/10 text-luxury-neutralGray'}`}>
      {status}
    </span>
  );
};

// ── Confirm Delete Modal ────────────────────────────────────
const ConfirmModal = ({ isOpen, title, description, onConfirm, onCancel, danger = true }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-black/80 backdrop-blur-md"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-luxury-darkGray border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto ${danger ? 'bg-red-500/10 border border-red-500/20' : 'bg-luxury-accent/10 border border-luxury-accent/20'}`}>
            <AlertTriangle className={`w-6 h-6 ${danger ? 'text-red-400' : 'text-luxury-accent'}`} />
          </div>
          <h3 className="font-serif text-xl text-luxury-cream text-center mb-2">{title}</h3>
          <p className="font-sans text-xs text-luxury-neutralGray text-center leading-relaxed mb-8">{description}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-white/10 rounded-xl font-sans text-[10px] tracking-widest uppercase text-luxury-neutralGray hover:text-luxury-cream hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-xl font-sans text-[10px] tracking-widest uppercase font-bold transition-colors ${
                danger ? 'bg-red-500/80 hover:bg-red-500 text-white' : 'bg-luxury-accent hover:bg-amber-400 text-luxury-black'
              }`}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Inline Select ───────────────────────────────────────────
const InlineSelect = ({ value, options, onChange, className = '' }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-luxury-black/60 border border-white/10 rounded-lg px-3 py-1.5 font-sans text-[10px] tracking-widest uppercase text-luxury-cream focus:outline-none focus:border-luxury-accent transition-colors cursor-pointer pr-7"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-luxury-neutralGray pointer-events-none" />
  </div>
);

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const ROLE_OPTIONS = [
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
];

// ── Main Component ─────────────────────────────────────────
const AdminDashboard = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const [stats, setStats]     = useState({ revenue: 0, orders: 0, products: 0, users: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders]   = useState([]);
  const [members, setMembers] = useState([]);

  // Confirm modal state
  const [modal, setModal] = useState({ open: false, title: '', description: '', onConfirm: null });
  const closeModal = () => setModal({ open: false, title: '', description: '', onConfirm: null });
  const openModal = (title, description, onConfirm) =>
    setModal({ open: true, title, description, onConfirm });

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, userRes, orderRes] = await Promise.all([
        api.get('/products?limit=200'),
        api.get('/auth/users'),
        api.get('/orders'),
      ]);
      if (prodRes.data.success) {
        setProducts(prodRes.data.products);
        setStats(prev => ({ ...prev, products: prodRes.data.products.length }));
      }
      if (userRes.data.success) {
        setMembers(userRes.data.users);
        setStats(prev => ({ ...prev, users: userRes.data.users.length }));
      }
      if (orderRes.data.success) {
        const allOrders = orderRes.data.orders;
        setOrders(allOrders);
        setStats(prev => ({
          ...prev,
          orders: allOrders.length,
          revenue: allOrders.reduce((acc, o) => acc + o.totalPrice, 0),
        }));
      }
    } catch {
      showToast({ message: 'Failed to sync dashboard data', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  // ── Product actions ──────────────────────────────────────
  const handleDeleteProduct = (id, name) => {
    openModal(
      'Erase from Catalog',
      `"${name}" will be permanently removed from the Velrovix collection and cannot be recovered.`,
      async () => {
        closeModal();
        try {
          await api.delete(`/products/${id}`);
          showToast({ message: `"${name}" removed from catalog`, type: 'success' });
          fetchAllData();
        } catch (err) {
          showToast({ message: err.response?.data?.message || 'Delete failed', type: 'error' });
        }
      }
    );
  };

  const handleImageUpload = async (e, productId) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    showToast({ message: 'Uploading to Cloudinary…', type: 'info' });
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.imageUrl) {
        await api.put(`/products/${productId}`, {
          images: [{ url: data.imageUrl, alt: 'product image', publicId: data.publicId || '' }],
        });
        showToast({ message: 'Image updated!', type: 'success' });
        fetchAllData();
      }
    } catch {
      showToast({ message: 'Upload failed', type: 'error' });
    }
  };

  // ── Order actions ────────────────────────────────────────
  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });
      showToast({ message: `Status updated to "${status}"`, type: 'success' });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch {
      showToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleMarkPaid = (orderId, currentPaid) => {
    if (currentPaid) return; // already paid
    openModal(
      'Mark Order as Paid',
      'This will confirm the payment has been received and cannot be undone.',
      async () => {
        closeModal();
        try {
          await api.put(`/orders/${orderId}/status`, { isPaid: true });
          showToast({ message: 'Order marked as paid', type: 'success' });
          setOrders(prev => prev.map(o => o._id === orderId ? { ...o, isPaid: true } : o));
        } catch {
          showToast({ message: 'Failed to mark as paid', type: 'error' });
        }
      }
    );
  };

  // ── Member actions ───────────────────────────────────────
  const handleRoleChange = (userId, name, newRole) => {
    openModal(
      `Change Role to "${newRole}"`,
      `${name}'s account will be ${newRole === 'admin' ? 'elevated to Administrator with full platform access' : 'reverted to a standard Member account'}.`,
      async () => {
        closeModal();
        try {
          await api.put(`/auth/users/${userId}/role`, { role: newRole });
          showToast({ message: `${name} is now a ${newRole}`, type: 'success' });
          setMembers(prev => prev.map(m => m._id === userId ? { ...m, role: newRole } : m));
        } catch {
          showToast({ message: 'Role update failed', type: 'error' });
        }
      }
    );
  };

  // ── TAB RENDERERS ────────────────────────────────────────

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Revenue"      value={`$${stats.revenue.toLocaleString()}`} icon={TrendingUp} trend="+14% MoM" accent />
        <StatCard label="Total Orders"       value={stats.orders}   icon={ShoppingBag} trend="Active" />
        <StatCard label="Curated Pieces"     value={stats.products} icon={Package} />
        <StatCard label="Registered Members" value={stats.users}    icon={Users} />
      </div>

      <div className="bg-luxury-darkGray/20 border border-white/5 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="font-sans text-[10px] tracking-luxury text-luxury-cream uppercase">Recent Acquisitions</h3>
          <button onClick={() => setActiveTab('orders')} className="font-sans text-[9px] tracking-luxury text-luxury-accent hover:underline">VIEW ALL</button>
        </div>
        {orders.length === 0 && <div className="text-center py-12 font-sans text-xs text-luxury-neutralGray">No acquisitions yet</div>}
        {orders.slice(0, 5).map((o) => (
          <div key={o._id} className="flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0">
            <div>
              <p className="font-mono text-xs text-luxury-cream">#{o._id.slice(-8).toUpperCase()}</p>
              <p className="font-sans text-[9px] text-luxury-neutralGray">{o.user?.name || 'Guest'}</p>
            </div>
            <StatusBadge status={o.orderStatus} />
            <p className="font-serif text-sm text-luxury-accent">${o.totalPrice.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-2xl text-luxury-cream">Catalog Management</h3>
        <Link to="/admin/product/new/edit"
          className="inline-flex items-center gap-2 bg-luxury-accent text-luxury-black font-sans text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-xl hover:bg-amber-400 transition-colors">
          <Plus className="w-4 h-4" /> Add New Piece
        </Link>
      </div>

      <div className="bg-luxury-darkGray/20 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              {['Product', 'Category', 'Mood', 'Price', 'Stock', 'Asset', 'Actions'].map(h => (
                <th key={h} className="p-4 font-sans text-[9px] tracking-widest text-luxury-neutralGray uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && <tr><td colSpan={7} className="p-8 text-center font-sans text-xs text-luxury-neutralGray">No products found</td></tr>}
            {products.map((p) => (
              <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-white/10 overflow-hidden bg-black flex-shrink-0">
                      {p.images?.[0] ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 m-auto mt-3 text-white/20" />}
                    </div>
                    <span className="font-serif text-sm text-luxury-cream truncate max-w-[140px]">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 font-sans text-xs text-luxury-neutralGray">{p.category?.name || '—'}</td>
                <td className="p-4">
                  <span className="font-sans text-[9px] border border-luxury-accent/20 text-luxury-accent px-2 py-0.5 rounded">{p.mood}</span>
                </td>
                <td className="p-4 font-sans text-xs text-luxury-accent font-semibold">${p.price.toLocaleString()}</td>
                <td className="p-4 font-sans text-xs text-luxury-cream">{p.countInStock}</td>
                <td className="p-4">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-luxury-accent/30 rounded-lg text-[9px] uppercase font-sans text-luxury-accent hover:bg-luxury-accent hover:text-black transition-colors">
                    <ImageIcon className="w-3 h-3" /> Upload
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, p._id)} />
                  </label>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link to={`/admin/product/${p._id}/edit`} className="text-luxury-neutralGray hover:text-luxury-cream transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDeleteProduct(p._id, p.name)} className="text-luxury-neutralGray hover:text-red-400 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h3 className="font-serif text-2xl text-luxury-cream">All Transactions</h3>
      <div className="bg-luxury-darkGray/20 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              {['Order ID', 'Client', 'Date', 'Total', 'Status', 'Payment', 'Actions'].map(h => (
                <th key={h} className="p-4 font-sans text-[9px] tracking-widest text-luxury-neutralGray uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan={7} className="p-8 text-center font-sans text-xs text-luxury-neutralGray">No transactions yet</td></tr>}
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                <td className="p-4 font-mono text-xs text-luxury-cream">#{o._id.slice(-8).toUpperCase()}</td>
                <td className="p-4 font-sans text-xs text-luxury-cream">{o.user?.name || '—'}</td>
                <td className="p-4 font-sans text-xs text-luxury-neutralGray whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-4 font-serif text-sm text-luxury-accent">${o.totalPrice?.toLocaleString()}</td>
                <td className="p-4">
                  {/* Inline status selector */}
                  <InlineSelect
                    value={o.orderStatus}
                    options={ORDER_STATUSES}
                    onChange={(val) => handleOrderStatusChange(o._id, val)}
                  />
                </td>
                <td className="p-4">
                  {o.isPaid ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-sans text-[9px] uppercase tracking-widest">Paid</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-400">
                      <XCircle className="w-4 h-4" />
                      <span className="font-sans text-[9px] uppercase tracking-widest">Unpaid</span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  {!o.isPaid && (
                    <button
                      onClick={() => handleMarkPaid(o._id, o.isPaid)}
                      className="font-sans text-[9px] tracking-widest uppercase border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      <h3 className="font-serif text-2xl text-luxury-cream">Client Dossiers</h3>
      <div className="bg-luxury-darkGray/20 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              {['Client', 'Email', 'Member Since', 'Role', 'Actions'].map(h => (
                <th key={h} className="p-4 font-sans text-[9px] tracking-widest text-luxury-neutralGray uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && <tr><td colSpan={5} className="p-8 text-center font-sans text-xs text-luxury-neutralGray">No members found</td></tr>}
            {members.map((m) => (
              <tr key={m._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-luxury-accent/10 border border-luxury-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-serif text-xs text-luxury-accent">{m.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-serif text-sm text-luxury-cream">{m.name}</span>
                  </div>
                </td>
                <td className="p-4 font-sans text-xs text-luxury-neutralGray">{m.email}</td>
                <td className="p-4 font-sans text-xs text-luxury-neutralGray">
                  {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-0.5 rounded border font-sans text-[9px] tracking-widest uppercase ${
                    m.role === 'admin' ? 'border-amber-400/30 text-amber-400 bg-amber-400/5' : 'border-white/10 text-luxury-neutralGray'
                  }`}>
                    {m.role === 'admin' ? '★ Admin' : 'Member'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleRoleChange(m._id, m.name, m.role === 'admin' ? 'member' : 'admin')}
                    className={`font-sans text-[9px] tracking-widest uppercase border px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                      m.role === 'admin'
                        ? 'border-red-400/20 text-red-400 hover:bg-red-400/10'
                        : 'border-luxury-accent/30 text-luxury-accent hover:bg-luxury-accent/10'
                    }`}
                  >
                    {m.role === 'admin' ? 'Demote' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const TABS = [
    { id: 'overview',  label: 'Overview',    icon: Activity },
    { id: 'products',  label: 'Catalog',     icon: Package },
    { id: 'orders',    label: 'Transactions',icon: ShoppingBag },
    { id: 'members',   label: 'Members',     icon: Users },
  ];

  return (
    <main className="min-h-screen bg-luxury-black pt-32 pb-20 px-6 md:px-12">
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modal.open}
        title={modal.title}
        description={modal.description}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />

      <div className="max-w-7xl mx-auto space-y-10">
        <header className="space-y-2">
          <span className="font-sans text-[9px] tracking-[0.4em] text-luxury-accent font-semibold uppercase">The Deck</span>
          <h1 className="font-serif text-4xl md:text-5xl tracking-luxury text-luxury-cream">Control Console</h1>
          <p className="font-sans text-xs text-luxury-neutralGray">Full autonomy over catalog, acquisitions, and members.</p>
        </header>

        {/* Tab Bar */}
        <div className="flex gap-1 p-1 bg-luxury-darkGray/30 border border-white/5 rounded-xl w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-sans text-[10px] tracking-widest uppercase transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-luxury-accent text-luxury-black font-bold'
                  : 'text-luxury-neutralGray hover:text-luxury-cream'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <span className="w-6 h-6 border border-luxury-accent/30 border-t-luxury-accent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'overview'  && renderOverview()}
              {activeTab === 'products'  && renderProducts()}
              {activeTab === 'orders'    && renderOrders()}
              {activeTab === 'members'   && renderMembers()}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
