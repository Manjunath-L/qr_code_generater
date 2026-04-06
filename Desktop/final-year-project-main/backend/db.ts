import mongoose from 'mongoose';
import { log } from './vite';

const MONGODB_URI = 'mongodb://localhost:27017/concept-crafter';

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

// Create user schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export { connectToDatabase, User };