import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

let server: Server;

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

main();
