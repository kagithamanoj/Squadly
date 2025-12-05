import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('Connecting to MongoDB...');
await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected!');

console.log('Creating user...');
const user = await User.create({
    name: 'Debug User',
    email: 'debug@test.com',
    password: 'password123'
});

console.log('User created:', user._id);
process.exit(0);
