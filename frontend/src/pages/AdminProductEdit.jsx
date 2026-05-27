import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const MOODS = ['Royal', 'Bold', 'Minimal', 'Sensual', 'Ethereal', 'Warm', 'Mystique', 'Dark'];
const CATEGORIES = [
  { name: 'Watches', slug: 'watches' },
  { name: 'Perfumes', slug: 'perfumes' },
];

const AdminProductEdit = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    description: '',
    richDescription: '',
    mood: 'Royal',
    category: { name: 'Watches', slug: 'watches' },
    countInStock: 10,
    featured: false,
    bestseller: false,
    newArrival: false,
    images: [],
  });

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        const { data } = await api.get(`/products?limit=200`);
        const p = data.products.find((x) => x._id === id);
        if (p) {
          setForm({
            name: p.name || '',
            slug: p.slug || '',
            price: p.price || '',
            description: p.description || '',
            richDescription: p.richDescription || '',
            mood: p.mood || 'Royal',
            category: p.category || { name: 'Watches', slug: 'watches' },
            countInStock: p.countInStock ?? 10,
            featured: p.featured || false,
            bestseller: p.bestseller || false,
            newArrival: p.newArrival || false,
            images: p.images || [],
          });
        }
      } catch (err) {
        showToast({ message: 'Failed to load product data', type: 'error' });
      }
    };
    load();
  }, [id, isNew, showToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCategoryChange = (e) => {
    const cat = CATEGORIES.find((c) => c.slug === e.target.value);
    if (cat) setForm((prev) => ({ ...prev, category: cat }));
  };

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => ({ ...prev, name, slug: autoSlug(name) }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    showToast({ message: 'Uploading to Cloudinary…', type: 'info' });
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.imageUrl) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { url: data.imageUrl, alt: form.name, publicId: data.publicId || '' }],
        }));
        showToast({ message: 'Image uploaded!', type: 'success' });
      }
    } catch {
      showToast({ message: 'Image upload failed', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description) {
      showToast({ message: 'Name, price and description are required', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), countInStock: Number(form.countInStock) };
      if (isNew) {
        await api.post('/products', payload);
        showToast({ message: 'New piece added to catalog', type: 'success' });
      } else {
        await api.put(`/products/${id}`, payload);
        showToast({ message: 'Piece updated successfully', type: 'success' });
      }
      navigate('/admin');
    } catch (err) {
      showToast({ message: err.response?.data?.message || 'Save failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full bg-luxury-black/60 border border-white/10 rounded-xl px-4 py-3 font-sans text-sm text-luxury-cream placeholder-luxury-neutralGray/30 focus:outline-none focus:border-luxury-accent transition-colors";

  return (
    <main className="min-h-screen bg-luxury-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-3">
          <Link to="/admin" className="inline-flex items-center gap-2 font-sans text-[9px] tracking-luxury text-luxury-neutralGray hover:text-luxury-cream uppercase transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Control Console
          </Link>
          <span className="font-sans text-[9px] tracking-[0.4em] text-luxury-accent font-semibold uppercase block">
            {isNew ? 'New Acquisition Entry' : 'Curator Edit'}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-luxury-cream">
            {isNew ? 'Add New Piece' : 'Modify Piece'}
          </h1>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8 bg-luxury-darkGray/20 border border-white/5 rounded-2xl p-8"
        >
          {/* Name + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Piece Name *</label>
              <input name="name" value={form.name} onChange={handleNameChange} placeholder="e.g. Astral Tourbillon" className={fieldClass} required />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Slug (auto-generated)</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="astral-tourbillon" className={fieldClass} />
            </div>
          </div>

          {/* Price + Stock + Category + Mood */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Price (USD) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="14500" className={fieldClass} required />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Stock</label>
              <input name="countInStock" type="number" value={form.countInStock} onChange={handleChange} className={fieldClass} />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Category *</label>
              <select name="category" value={form.category.slug} onChange={handleCategoryChange} className={fieldClass}>
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Mood *</label>
              <select name="mood" value={form.mood} onChange={handleChange} className={fieldClass}>
                {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Short Description *</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="A compelling one-line description..." className={fieldClass} required />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Rich Narrative (displayed on product page)</label>
            <textarea name="richDescription" rows={5} value={form.richDescription} onChange={handleChange} placeholder="A deeper, editorial-style story about this piece..." className={fieldClass} />
          </div>

          {/* Flags */}
          <div className="space-y-3">
            <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Catalog Flags</label>
            <div className="flex flex-wrap gap-6">
              {[
                { key: 'featured', label: 'Featured' },
                { key: 'bestseller', label: 'Bestseller' },
                { key: 'newArrival', label: 'New Arrival' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name={key} checked={form[key]} onChange={handleChange}
                    className="w-4 h-4 accent-yellow-400 rounded"
                  />
                  <span className="font-sans text-xs text-luxury-cream">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Product Images</label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                    className="absolute inset-0 bg-red-500/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                    title="Remove image"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-luxury-accent/50 transition-colors gap-1">
                <ImageIcon className="w-5 h-5 text-luxury-neutralGray/40" />
                <span className="font-sans text-[8px] text-luxury-neutralGray/40 uppercase">{uploading ? '…' : 'Upload'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            {form.images.length > 0 && (
              <p className="font-sans text-[9px] text-luxury-neutralGray">Hover over an image and click the red ✕ to remove it.</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-luxury-accent text-luxury-black font-sans text-[10px] font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : isNew ? 'Create Piece' : 'Save Modifications'}
            </button>
            <Link
              to="/admin"
              className="flex-1 flex items-center justify-center border border-white/10 text-luxury-neutralGray font-sans text-[10px] tracking-widest uppercase py-4 rounded-xl hover:border-white/20 hover:text-luxury-cream transition-colors"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      </div>
    </main>
  );
};

export default AdminProductEdit;
