import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI;
const DB_NAME = 'formbuilder';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) {
    return { client, db };
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    
    console.log('Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase();
  }
  return db;
}

// Collections
export const COLLECTIONS = {
  FORMS: 'forms',
  RESPONSES: 'form_responses'
} as const;