import { model, Schema } from "mongoose";
import { IBook } from "../interfaces/book.interfaces";



export const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: [true, "Book title is required"],
    trim: true,
    minlength: [3, "Book title must be at least 3 characters long, got {VALUE}"],
    maxlength: [100, "Book title can be at most 100 characters, got {VALUE}"]
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
    minlength: [3, "Author name must be at least 3 characters long, got {VALUE}"],
    maxlength: [50, "Author name can be at most 50 characters, got {VALUE}"]
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    enum: {
      values: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
      message: "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY"
    }
  },
  isbn: {
    type: String,
    required: [true, "ISBN is required"],
    unique: true,
    validate: {
      validator: function (value: string) {
        return /^(97(8|9))?\d{9}(\d|X)$/.test(value);
      },
      message: "ISBN {VALUE} is not a valid format"
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description can be at most 500 characters long"]
  },
  copies: {
    type: Number,
    required: [true, "Number of copies is required"],
    min: [0, "Copies must be a positive number"],
    validate: {
      validator: function (value: number) {
        return Number.isInteger(value);
      },
      message: "Copies must be a valid integer"
    }
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false,
  timestamps: true
});

bookSchema.methods.updateAvailability = function () {
  this.available = this.copies > 0;
};

bookSchema.pre('save', function (next) {
  this.available = this.copies > 0;
  next();
});

bookSchema.pre('findOneAndUpdate', async function (next) {
  const update: any = this.getUpdate();

  if (update && update.copies !== undefined) {
    update.available = update.copies > 0;
    this.setUpdate(update);
  }

  next();
});

export const Book = model<IBook>("Book", bookSchema);
