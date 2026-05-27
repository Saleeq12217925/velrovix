import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  // ── WATCHES ────────────────────────────────────────────────────
  {
    name: 'Astral Tourbillon Gold',
    slug: 'astral-tourbillon-gold',
    description: 'A radiant open-heart tourbillon with gold finishing and ceremonial wrist presence.',
    richDescription: 'Built for evening collectors, Astral Tourbillon Gold balances luminous polish with a precise mechanical heartbeat. Every gear is hand-finished with bevelled edges and polished to a mirror-grade perfection.',
    price: 24500,
    category: { name: 'Watches', slug: 'watches' },
    mood: 'Royal',
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', alt: 'Gold luxury watch' }],
    specifications: { Movement: 'Caliber V-26 Tourbillon', Case: '18k gold plated titanium', Reserve: '72 hours', Crystal: 'Sapphire anti-reflective', Diameter: '42mm' },
    tags: ['watch', 'tourbillon', 'gold', 'royal'],
    featured: true, newArrival: true, countInStock: 5,
  },
  {
    name: 'Obsidian Skeleton',
    slug: 'obsidian-skeleton',
    description: 'A black skeletonized automatic watch with architectural bridges and matte finishing.',
    richDescription: 'Obsidian Skeleton gives the movement centre stage, pairing technical exposure with restrained black geometry. The open-worked dial reveals every gear, spring, and balance wheel.',
    price: 18900,
    category: { name: 'Watches', slug: 'watches' },
    mood: 'Bold',
    images: [{ url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=80', alt: 'Black luxury watch' }],
    specifications: { Movement: 'Automatic skeleton', Case: 'Black DLC ceramic', Reserve: '60 hours', WaterResistance: '100m', Diameter: '44mm' },
    tags: ['watch', 'skeleton', 'black', 'bold'],
    bestseller: true, countInStock: 7,
  },
  {
    name: 'Glacier Perpetual',
    slug: 'glacier-perpetual',
    description: 'A perpetual calendar masterpiece in arctic white and brushed platinum.',
    richDescription: 'Glacier Perpetual tracks date, month, leap year, and moon phase across its ice-toned lacquer dial. A monument to complication, finished in aerospace-grade platinum.',
    price: 31200,
    category: { name: 'Watches', slug: 'watches' },
    mood: 'Minimal',
    images: [{ url: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=900&q=80', alt: 'Silver platinum dress watch' }],
    specifications: { Movement: 'Perpetual calendar automatic', Case: 'Grade 5 titanium', Reserve: '80 hours', Crystal: 'Double-domed sapphire', Diameter: '40mm' },
    tags: ['watch', 'perpetual calendar', 'minimal', 'platinum'],
    featured: true, newArrival: true, countInStock: 3,
  },
  {
    name: 'Noir Chronographe',
    slug: 'noir-chronographe',
    description: 'A column-wheel flyback chronograph in stealth matte black with red accents.',
    richDescription: 'Born from motorsport and haute horlogerie, Noir Chronographe splits seconds with ruthless precision. Its flyback mechanism resets and restarts at a single press.',
    price: 22800,
    category: { name: 'Watches', slug: 'watches' },
    mood: 'Bold',
    images: [{ url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=900&q=80', alt: 'Black chronograph watch' }],
    specifications: { Movement: 'Flyback chronograph, column wheel', Case: 'Black PVD steel', Reserve: '55 hours', WaterResistance: '200m', Diameter: '43mm' },
    tags: ['watch', 'chronograph', 'flyback', 'bold', 'black'],
    bestseller: true, countInStock: 10,
  },
  {
    name: 'Solar Meridian',
    slug: 'solar-meridian',
    description: 'A world-time dress watch with sunburst brass dial and polished rose gold case.',
    richDescription: 'Solar Meridian displays all 24 time zones on an engraved inner bezel, while the sunburst guilloche dial catches light at every angle. The ultimate companion for the global traveller.',
    price: 14700,
    category: { name: 'Watches', slug: 'watches' },
    mood: 'Royal',
    images: [{ url: 'https://res.cloudinary.com/dxg8k8rt3/image/upload/f_auto,q_auto/Gemini_Generated_Image_ojvz64ojvz64ojvz_x5sot4', alt: 'Dark gold luxury dress watch' }],
    specifications: { Movement: 'World-time automatic', Case: '18k rose gold', Reserve: '68 hours', Crystal: 'Sapphire', Diameter: '39mm' },
    tags: ['watch', 'world time', 'dress watch', 'rose gold', 'royal'],
    featured: true, countInStock: 6,
  },
  {
    name: 'Tempest Diver',
    slug: 'tempest-diver',
    description: 'A professional 600m diver with ceramic bezel, helium escape valve, and sapphire crystal.',
    richDescription: 'Tempest Diver descends where few dare — rated to 600 metres, tested in pressure chambers, and finished with the same care as any haute horlogerie piece in our collection.',
    price: 11400,
    category: { name: 'Watches', slug: 'watches' },
    mood: 'Bold',
    images: [{ url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80', alt: 'Professional diver watch' }],
    specifications: { Movement: 'Automatic COSC certified', Case: 'Titanium grade 2', Reserve: '72 hours', WaterResistance: '600m', Diameter: '45mm' },
    tags: ['watch', 'diver', 'sport', 'titanium', 'bold'],
    newArrival: true, countInStock: 12,
  },
  {
    name: 'Celeste Moonphase',
    slug: 'celeste-moonphase',
    description: 'A celestial moonphase watch with aventurine dial and gold constellation engravings.',
    richDescription: 'Celeste Moonphase captures the night sky in a 38mm case. Its aventurine dial — hand-set with 18k gold stars — mirrors the actual night sky from your latitude.',
    price: 19600,
    category: { name: 'Watches', slug: 'watches' },
    mood: 'Ethereal',
    images: [{ url: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80', alt: 'Moonphase luxury watch' }],
    specifications: { Movement: 'Moonphase automatic', Case: 'White gold', Reserve: '64 hours', Crystal: 'Anti-reflective sapphire', Diameter: '38mm' },
    tags: ['watch', 'moonphase', 'celestial', 'gold', 'ethereal'],
    featured: true, bestseller: true, countInStock: 4,
  },

  // ── PERFUMES ───────────────────────────────────────────────────
  {
    name: 'Oud Mystere Extrait',
    slug: 'oud-mystere-extrait',
    description: 'A concentrated oud fragrance shaped with saffron, incense, and polished woods.',
    richDescription: 'Oud Mystere Extrait opens with spice and settles into a low, resinous trail made for late hours. Sourced from Laotian agarwood aged over two decades.',
    price: 380,
    category: { name: 'Perfumes', slug: 'perfumes' },
    mood: 'Dark Luxury',
    images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80', alt: 'Luxury perfume bottle' }],
    specifications: { Concentration: 'Extrait de Parfum', Volume: '75ml', Longevity: '10-12 hours', Origin: 'Grasse, France' },
    notes: { top: ['Saffron', 'Pink Pepper'], heart: ['Oud', 'Incense'], base: ['Cedar', 'Ambergris'] },
    tags: ['perfume', 'oud', 'dark luxury', 'extrait'],
    featured: true, bestseller: true, countInStock: 18,
  },
  {
    name: 'Neroli Infini',
    slug: 'neroli-infini',
    description: 'A luminous neroli composition with bergamot, clean florals, and soft white musk.',
    richDescription: 'Neroli Infini is bright, polished, and minimal, built around sunlit citrus with a quiet musky finish. An icon of the modern Mediterranean wardrobe.',
    price: 320,
    category: { name: 'Perfumes', slug: 'perfumes' },
    mood: 'Minimal',
    images: [{ url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80', alt: 'Minimal perfume bottle' }],
    specifications: { Concentration: 'Eau de Parfum', Volume: '100ml', Longevity: '7-9 hours', Origin: 'Grasse, France' },
    notes: { top: ['Neroli', 'Bergamot'], heart: ['Orange Blossom', 'Rose'], base: ['White Musk', 'Cedar'] },
    tags: ['perfume', 'neroli', 'minimal', 'citrus'],
    featured: true, newArrival: true, countInStock: 22,
  },
  {
    name: 'Velvet Iris Noir',
    slug: 'velvet-iris-noir',
    description: 'A powdery, sensuous iris built on a base of dark woods and smoked vanilla.',
    richDescription: 'Velvet Iris Noir transforms the iris flower into something architectural — cool and powdery at the surface, warm and smoky at its roots. Unmistakably feminine yet worn by all.',
    price: 290,
    category: { name: 'Perfumes', slug: 'perfumes' },
    mood: 'Sensual',
    images: [{ url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80', alt: 'Dark iris perfume' }],
    specifications: { Concentration: 'Eau de Parfum', Volume: '50ml', Longevity: '8-10 hours', Origin: 'Paris, France' },
    notes: { top: ['Iris', 'Violet leaf'], heart: ['Orris root', 'Heliotrope'], base: ['Smoked vanilla', 'Vetiver'] },
    tags: ['perfume', 'iris', 'powdery', 'sensual', 'dark'],
    featured: true, bestseller: true, countInStock: 15,
  },
  {
    name: 'Ambre Solaire',
    slug: 'ambre-solaire',
    description: 'A warm amber composition with honey, benzoin, and Tonka bean — liquid sunlight.',
    richDescription: 'Ambre Solaire is an embrace made tangible. Rich without heaviness, sweet without cloying — it settles into skin like a second warmth that lingers well into the next morning.',
    price: 260,
    category: { name: 'Perfumes', slug: 'perfumes' },
    mood: 'Warm',
    images: [{ url: 'https://res.cloudinary.com/dxg8k8rt3/image/upload/f_auto,q_auto/ChatGPT_Image_May_26_2026_12_09_09_AM_q8wdpa', alt: 'Ambre Solaire warm amber perfume' }],
    specifications: { Concentration: 'Eau de Parfum', Volume: '100ml', Longevity: '9-11 hours', Origin: 'Grasse, France' },
    notes: { top: ['Bergamot', 'Honey'], heart: ['Amber', 'Benzoin'], base: ['Tonka Bean', 'Sandalwood'] },
    tags: ['watch', 'amber', 'warm', 'gourmand', 'sweet'],
    newArrival: true, countInStock: 30,
  },
  {
    name: 'Sillage Marine',
    slug: 'sillage-marine',
    description: 'A crisp ocean fragrance with sea salt, aquatic ozone, and a driftwood finish.',
    richDescription: 'Sillage Marine captures the precise moment before a wave breaks — all cold salt air, mineral stone, and sea-washed cedar. It is the ocean in a bottle.',
    price: 220,
    category: { name: 'Perfumes', slug: 'perfumes' },
    mood: 'Minimal',
    images: [{ url: 'https://images.unsplash.com/photo-1549049950-48d5887197a8?auto=format&fit=crop&w=900&q=80', alt: 'Clean aquatic marine perfume' }],
    specifications: { Concentration: 'Eau de Toilette', Volume: '100ml', Longevity: '5-7 hours', Origin: 'Cannes, France' },
    notes: { top: ['Sea Salt', 'Ozone'], heart: ['Aquatic florals', 'Marine accord'], base: ['Driftwood', 'White musk'] },
    tags: ['perfume', 'aquatic', 'marine', 'fresh', 'minimal'],
    bestseller: true, countInStock: 25,
  },
  {
    name: 'Rose Oud Imperial',
    slug: 'rose-oud-imperial',
    description: 'A classic Eastern rose and oud accord layered with spice and golden resins.',
    richDescription: 'Rose Oud Imperial is a testament to the centuries-old tradition of Middle Eastern perfumery. Rose absolute from Taif meets Cambodian oud in a marriage of East and West.',
    price: 450,
    category: { name: 'Perfumes', slug: 'perfumes' },
    mood: 'Royal',
    images: [{ url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80', alt: 'Royal rose oud imperial perfume' }],
    specifications: { Concentration: 'Extrait de Parfum', Volume: '50ml', Longevity: '12+ hours', Origin: 'Dubai & Grasse' },
    notes: { top: ['Saffron', 'Cardamom'], heart: ['Taif Rose', 'Oud'], base: ['Amber', 'Musk', 'Sandalwood'] },
    tags: ['perfume', 'rose', 'oud', 'royal', 'oriental', 'extrait'],
    featured: true, newArrival: true, countInStock: 10,
  },
  {
    name: 'Encens Sacre',
    slug: 'encens-sacre',
    description: 'A sacred incense composition of frankincense, myrrh, and meditative resins.',
    richDescription: 'Encens Sacre draws from ancient temple rituals — holy smoke, cold stone, and warm resin that builds as the day wears on. Spiritual perfumery at its most profound.',
    price: 340,
    category: { name: 'Perfumes', slug: 'perfumes' },
    mood: 'Dark Luxury',
    images: [{ url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=900&q=80', alt: 'Dark sacred incense perfume' }],
    specifications: { Concentration: 'Eau de Parfum', Volume: '75ml', Longevity: '10-13 hours', Origin: 'Paris, France' },
    notes: { top: ['Frankincense', 'Elemi'], heart: ['Myrrh', 'Labdanum'], base: ['Benzoin', 'Oud', 'Dark musk'] },
    tags: ['perfume', 'incense', 'frankincense', 'dark luxury', 'resinous'],
    bestseller: true, countInStock: 14,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { slug: product.slug },
          update: { $set: product },
          upsert: true,
        },
      }))
    );
    console.log(`[Seeder] ✅ Upserted ${products.length} products successfully`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder] ❌ Failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();
