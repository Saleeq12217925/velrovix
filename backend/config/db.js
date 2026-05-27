import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/velrovix');
    
    console.log(`\x1b[35m[Database] Connected to MongoDB Atlas: ${conn.connection.host}\x1b[0m`);
    
    // Connection status listeners
    mongoose.connection.on('disconnected', () => {
      console.log('\x1b[31m[Database] MongoDB disconnected. Attempting to reconnect...\x1b[0m');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`\x1b[31m[Database] MongoDB connection error: ${err.message}\x1b[0m`);
    });

  } catch (error) {
    console.error(`\x1b[31m[Error] Database connection failed: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

export default connectDB;
