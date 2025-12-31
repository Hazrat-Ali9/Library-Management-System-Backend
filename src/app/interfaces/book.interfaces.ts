import { Document } from 'mongoose';

export interface BaseDocument {
  createdAt: Date;
  updatedAt: Date;
}


export interface IBook extends BaseDocument{
  title: string;
  author: string;
  genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
}

export interface BookDocument extends IBook, Document {
  updateAvailability: () => void;
}