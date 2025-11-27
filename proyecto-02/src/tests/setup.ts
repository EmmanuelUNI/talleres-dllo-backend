import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';