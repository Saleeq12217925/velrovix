import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

// Load models
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exportData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/velrovix');
    console.log('Connected to local database.');

    const users = await User.find({});
    const products = await Product.find({});
    const orders = await Order.find({});

    const backupDir = path.join(__dirname, 'backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    fs.writeFileSync(path.join(backupDir, 'users.json'), JSON.stringify(users, null, 2));
    fs.writeFileSync(path.join(backupDir, 'products.json'), JSON.stringify(products, null, 2));
    fs.writeFileSync(path.join(backupDir, 'orders.json'), JSON.stringify(orders, null, 2));

    console.log('Data successfully exported to /backup folder.');
    process.exit();
  } catch (error) {
    console.error('Error exporting data:', error);
    process.exit(1);
  }
};

exportData();
