import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";

import APIFunctionality from "../utils/apiFunctionality";

import { errorHandler } from '../utils/errorHandler';

export const bookRoutes = express.Router();



// Create Book
bookRoutes.post('/', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {

    const validatedBody = req.body


    const existingBook = await Book.findOne({ isbn: validatedBody.isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists.',
        error: {
          field: 'isbn',
          value: validatedBody.isbn
        }
      });
    }


    const book = await Book.create(validatedBody);

    const bookObj = book.toObject();

    const reorderedBook = {
      _id: bookObj._id,
      title: bookObj.title,
      author: bookObj.author,
      genre: bookObj.genre,
      isbn: bookObj.isbn,
      description: bookObj.description,
      copies: bookObj.copies,
      available: bookObj.available,
      createdAt: bookObj.createdAt,
      updatedAt: bookObj.updatedAt,
    };


    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: reorderedBook
    });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.isbn) {
      return res.status(400).json({
        success: false,
        message: 'ISBN already exists.',
        error: {
          field: 'isbn',
          value: error.keyValue?.isbn
        }
      });
    }
    return errorHandler(error, req, res, next);
  }
});

//Get All Books
// bookRoutes.get('/', async (req: Request, res: Response, next: NextFunction)=> {
//   try {
//     const books = await Book.find(); 

//     res.status(200).json({
//       success: true,
//       message: "Books retrieved successfully",
//       data: books,
//     });

//   } catch (error) {
//     next(error);
//   }
// });

//Get All Books
bookRoutes.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 12;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sort === "desc" ? -1 : 1;
    const page = Number(req.query.page) || 1;

    const apiFeatures = new APIFunctionality(Book.find(), req.query)
      .filter();

    // Clone the filtered query BEFORE pagination to get total count
    const filteredQuery = apiFeatures.query.clone();

    const bookCount = await filteredQuery.countDocuments();

    const totalPages = Math.ceil(bookCount / limit);

    if (page > totalPages && bookCount > 0) {
      res.status(404).json({
        success: false,
        message: "This page does not exist"
      });
      return;
    }

    // Apply consistent sorting (including _id to ensure deterministic order)
    apiFeatures.query = apiFeatures.query.sort({
      [sortBy as string]: sortOrder,
      _id: 1,
    });

    // Then apply pagination
    apiFeatures.pagination(limit);

    const books = await apiFeatures.query;

    if (!books || books.length === 0) {
      res.status(404).json({
        success: false,
        message: "No books found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
      totalPages,
      currentPage: page,
    });

  } catch (error) {
    next(error);
  }
});



// 1. Specific routes first
bookRoutes.get("/category-count", async (req, res, next) => {
  try {
    const counts = await Book.aggregate([
      {
        $group: {
          _id: "$genre",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json({
      success: true,
      data: counts,
    });
  } catch (err) {
    console.error("Aggregation error:", err);
    next(err);
  }
});

//Specific routes first
bookRoutes.get('/category-count', async (req, res) => {
  try {
    const counts = await Book.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: counts });
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Unknown error"
    });
  }
});



//Get Book by ID
bookRoutes.get('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book
    });

  } catch (error) {
    next(error);
  }
});


//Update Book
bookRoutes.put('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const updateData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook
    });

  } catch (error) {
    next(error);
  }
});

//delete book
bookRoutes.delete('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;


    const deletedBook = await Book.findByIdAndDelete(bookId);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null
    });

  } catch (error) {
    next(error);
  }
});


