import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const makeAdmin = async () => {
  try {
    await connectDB();
    
    // You can change the email below to match your registered account email
    const email = process.argv[2]; 

    if (!email) {
      console.error('Please provide an email. Usage: node utils/makeAdmin.js your@email.com');
      process.exit(1);
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`\n✅ Success! ${user.name} (${user.email}) is now an ADMIN.\n`);
    process.exit(0);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

makeAdmin();
