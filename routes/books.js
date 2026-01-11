const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET all books + search + pagination
router.get("/", async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 5 } = req.query;

    let query = {};
    if (author) query.author = author;
    if (genre) query.genre = genre;

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET single book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// POST add new book
router.post("/", async (req, res) => {
  const { title, author, price } = req.body;

  if (!title || !author || !price) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update book
router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book)
      return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
