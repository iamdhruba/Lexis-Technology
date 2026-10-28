import mongoose from 'mongoose';
import { config } from './config';

export async function connectDB() {
  await mongoose.connect(config.mongodbUri, {
    dbName: config.mongodbDb,
    serverSelectionTimeoutMS: 10_000,
  });
  console.log('MongoDB connected');
}
