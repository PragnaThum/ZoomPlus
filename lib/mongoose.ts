import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
import MeetingRoom from '@/models/MeetingRoom';

if (!MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to .env.local');
}

// Define global type for caching
interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Only for development: extend global with mongoose
  var mongooseGlobal: MongooseGlobal;
}

// Initialize global cache
let cached: MongooseGlobal = globalThis.mongooseGlobal || {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseGlobal) {
  globalThis.mongooseGlobal = cached;
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'zoomplus',
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
