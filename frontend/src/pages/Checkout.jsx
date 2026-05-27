import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, CreditCard, MapPin, CheckCircle2, ShieldCheck, Star, Truck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const SHIPPING_THRESHOLD = 10000;
const TAX_RATE = 0.08;
const WHITE_GLOVE_FEE = 250;

const STEPS = [
  { id: 1, title: 'Destination' },
  { id: 2, title: 'Payment' },
  { id: 3, title: 'Confirm' },
];

const InputField = ({ label, name, value, onChange, placeholder, type = 'text', colSpan = '' }) => (
  <div className={`relative group ${colSpan}`}>
    <label className="font-sans text-[8px] tracking-[0.4em] text-luxury-neutralGray/60 font-semibold uppercase absolute -top-5 left-0">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-transparent border-0 border-b border-white/10 pb-3 font-sans text-sm text-luxury-cream placeholder-luxury-neutralGray/30 focus:outline-none transition-all duration-500 focus:placeholder-transparent"
    />
    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-accent group-focus-within:w-full transition-all duration-500 ease-out" />
  </div>
);

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [whiteGlove, setWhiteGlove] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: '', address: '', city: '', postalCode: '', country: '',
  });

  // Totals
  const shippingCost = cartTotal > SHIPPING_THRESHOLD ? 0 : 150;
  const whiteGloveCost = whiteGlove ? WHITE_GLOVE_FEE : 0;
  const tax = Math.round(cartTotal * TAX_RATE);
  const orderTotal = cartTotal + shippingCost + whiteGloveCost + tax;

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart.length, navigate]);

  const handleShippingChange = (e) =>
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const nextStep = () => {
    setError('');
    if (currentStep === 1) {
      if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.postalCode || !shipping.country) {
        return setError('Please complete all consignment destination fields.');
      }
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => { setError(''); setCurrentStep((s) => Math.max(s - 1, 1)); };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const orderData = {
        items: cart.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images?.[0]?.url || '',
          price: item.product.price,
          qty: item.qty,
        })),
        shippingAddress: shipping,
        paymentMethod: 'Credit Card',
        whiteGloveDelivery: whiteGlove,
      };
      const { data } = await api.post('/orders', orderData);
      clearCart();
      navigate('/order-success', { state: { order: data.order }, replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-luxury-black relative pt-32 pb-24 px-6 md:px-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15,
          filter: 'brightness(0.4) saturate(0.1)',
        }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, #060606 80%)' }} />
      </div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">

        {/* Header */}
        <header className="space-y-4 text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-sans text-[9px] tracking-[0.4em] text-luxury-accent font-semibold block">
            VELROVIX · SECURE CHECKOUT
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl tracking-luxury text-luxury-cream">
            Checkout
          </motion.h1>
        </header>

        {/* Progress Bar */}
        <div className="relative pt-4 pb-8 max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-0 h-[1px] bg-luxury-accent -translate-y-1/2 z-0 transition-all duration-700 ease-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
          <div className="relative z-10 flex justify-between">
            {STEPS.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-luxury-black ${
                    isCompleted ? 'border-luxury-accent text-luxury-accent' :
                    isCurrent   ? 'border-luxury-cream text-luxury-cream shadow-[0_0_20px_rgba(197,165,114,0.15)]' :
                    'border-white/10 text-luxury-neutralGray/40'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <span className="font-sans text-xs">{step.id}</span>}
                  </div>
                  <span className={`font-sans text-[9px] tracking-[0.2em] uppercase transition-colors duration-500 ${
                    isCurrent || isCompleted ? 'text-luxury-cream' : 'text-luxury-neutralGray/40'
                  }`}>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-luxury-darkGray/20 border border-white/5 rounded-2xl p-6 md:p-10 relative overflow-hidden min-h-[400px]">

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
              <span className="font-sans text-xs">{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">

            {/* ── STEP 1: DESTINATION ── */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-10">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <MapPin className="w-5 h-5 text-luxury-accent" />
                  <h2 className="font-serif text-2xl text-luxury-cream">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-10 pt-4">
                  <InputField label="Full Name" name="fullName" value={shipping.fullName} onChange={handleShippingChange} placeholder="Your Full Name" colSpan="md:col-span-2" />
                  <InputField label="Street Address" name="address" value={shipping.address} onChange={handleShippingChange} placeholder="Street Address, Suite, etc." colSpan="md:col-span-2" />
                  <InputField label="City" name="city" value={shipping.city} onChange={handleShippingChange} placeholder="City" />
                  <InputField label="Postal Code" name="postalCode" value={shipping.postalCode} onChange={handleShippingChange} placeholder="Postal / Zip Code" />
                  <InputField label="Country" name="country" value={shipping.country} onChange={handleShippingChange} placeholder="Country / Region" colSpan="md:col-span-2" />
                </div>

                {/* White-Glove toggle */}
                <div className={`relative rounded-xl border p-6 transition-all duration-300 cursor-pointer ${
                  whiteGlove ? 'border-luxury-accent/50 bg-luxury-accent/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`} onClick={() => setWhiteGlove(!whiteGlove)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        whiteGlove ? 'bg-luxury-accent text-luxury-black' : 'bg-white/5 text-luxury-neutralGray'
                      }`}>
                        <Star className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg text-luxury-cream mb-1">Premium Hand Delivery</h4>
                        <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
                          Your order is personally hand-delivered in a signed, signature-required luxury presentation case. Includes a Certificate of Authenticity and 72-hour care consultation.
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                        whiteGlove ? 'border-luxury-accent bg-luxury-accent' : 'border-white/20'
                      }`}>
                        {whiteGlove && <Check className="w-3 h-3 text-luxury-black" />}
                      </div>
                      <p className={`font-sans text-xs mt-2 text-right font-semibold ${whiteGlove ? 'text-luxury-accent' : 'text-luxury-neutralGray'}`}>
                        +${WHITE_GLOVE_FEE}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button onClick={nextStep}
                    className="group flex items-center gap-3 bg-luxury-accent text-luxury-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-8 py-4 rounded-xl hover:bg-amber-400 transition-all duration-300">
                    CONTINUE TO PAYMENT
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: PAYMENT ── */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <CreditCard className="w-5 h-5 text-luxury-accent" />
                  <h2 className="font-serif text-2xl text-luxury-cream">Payment Method</h2>
                </div>

                <div className="bg-luxury-black/40 border border-luxury-accent/30 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <CheckCircle2 className="w-5 h-5 text-luxury-accent" />
                  </div>
                  <div className="flex items-start gap-4">
                    <Lock className="w-5 h-5 text-luxury-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-sans text-sm text-luxury-cream mb-2">Secure Credit Card</h3>
                      <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
                        For this exclusive preview, detailed card information is not required. Your acquisition is backed by the full Velrovix guarantee. Payment will be confirmed upon final review.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security badges */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Lock, label: '256-bit SSL Encrypted' },
                    { icon: ShieldCheck, label: 'PCI DSS Compliant' },
                    { icon: CheckCircle2, label: 'Fraud Protected' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                      <Icon className="w-5 h-5 text-luxury-accent/50" />
                      <span className="font-sans text-[9px] text-luxury-neutralGray tracking-widest">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-8">
                  <button onClick={prevStep}
                    className="flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] text-luxury-neutralGray hover:text-luxury-cream uppercase transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> BACK
                  </button>
                  <button onClick={nextStep}
                    className="group flex items-center gap-3 bg-luxury-accent text-luxury-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-8 py-4 rounded-xl hover:bg-amber-400 transition-all duration-300">
                    REVIEW ORDER
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: FINAL REVIEW ── */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-10">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <CheckCircle2 className="w-5 h-5 text-luxury-accent" />
                  <h2 className="font-serif text-2xl text-luxury-cream">Final Review</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left — Shipping + delivery info */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-sans text-[9px] tracking-[0.3em] text-luxury-neutralGray uppercase font-semibold">Consignment Destination</h3>
                      <div className="bg-luxury-black/40 border border-white/5 rounded-xl p-5 font-sans text-xs text-luxury-cream leading-loose">
                        <p className="font-semibold">{shipping.fullName}</p>
                        <p>{shipping.address}</p>
                        <p>{shipping.city}, {shipping.postalCode}</p>
                        <p>{shipping.country}</p>
                      </div>
                    </div>
                    {whiteGlove && (
                      <div className="flex items-center gap-3 bg-luxury-accent/5 border border-luxury-accent/20 rounded-xl p-4">
                        <Star className="w-4 h-4 text-luxury-accent flex-shrink-0" />
                        <div>
                          <p className="font-sans text-[10px] font-bold tracking-widest text-luxury-accent uppercase">Premium Delivery Active</p>
                          <p className="font-sans text-[9px] text-luxury-neutralGray mt-0.5">Hand delivery with luxury presentation case</p>
                        </div>
                      </div>
                    )}
                    {/* CoA notice */}
                    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                      <ShieldCheck className="w-4 h-4 text-luxury-accent/60 flex-shrink-0" />
                      <p className="font-sans text-[9px] text-luxury-neutralGray">
                        NFC-chipped Certificate of Authenticity will be included for each piece in your allocation.
                      </p>
                    </div>
                  </div>

                  {/* Right — Summary */}
                  <div className="bg-luxury-black/60 border border-luxury-accent/20 rounded-xl p-6 md:p-8 space-y-6">
                    <h3 className="font-sans text-[9px] tracking-[0.3em] text-luxury-cream uppercase font-semibold border-b border-white/10 pb-4">
                      Order Summary
                    </h3>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="font-sans text-luxury-neutralGray truncate pr-4">
                            {item.qty}× {item.product.name}
                          </span>
                          <span className="font-sans text-luxury-cream flex-shrink-0">${(item.product.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-4 space-y-3">
                      <div className="flex justify-between font-sans text-xs text-luxury-neutralGray">
                        <span>Subtotal</span>
                        <span className="text-luxury-cream">${cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-sans text-xs text-luxury-neutralGray">
                        <span>Standard Shipping</span>
                        <span className={shippingCost === 0 ? 'text-emerald-400' : 'text-luxury-cream'}>
                          {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                        </span>
                      </div>
                      {whiteGlove && (
                        <div className="flex justify-between font-sans text-xs text-luxury-neutralGray">
                          <span>Premium Delivery</span>
                          <span className="text-luxury-accent">+${WHITE_GLOVE_FEE}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-sans text-xs text-luxury-neutralGray">
                        <span>Tax (8%)</span>
                        <span className="text-luxury-cream">${tax.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="border-t border-luxury-accent/30 pt-4 flex justify-between items-baseline">
                      <span className="font-sans text-[10px] tracking-luxury text-luxury-cream uppercase">Total</span>
                      <span className="font-serif text-2xl text-luxury-accent">${orderTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <button onClick={prevStep} disabled={loading}
                    className="flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] text-luxury-neutralGray hover:text-luxury-cream uppercase transition-colors disabled:opacity-50">
                    <ArrowLeft className="w-3.5 h-3.5" /> BACK
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="group flex items-center gap-3 bg-luxury-accent text-luxury-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-8 py-4 rounded-xl hover:bg-amber-400 transition-all duration-300 disabled:opacity-70">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border border-luxury-black/40 border-t-luxury-black rounded-full animate-spin" />
                        PROCESSING…
                      </span>
                    ) : (
                      <>
                        PLACE ORDER
                        <Check className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
