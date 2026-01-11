const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins (or restrict to your frontend later)
app.use(express.json()); // Parse JSON

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: String,
  price: { type: Number, required: true },
  publishedDate: { type: Date, default: Date.now },
  inStock: { type: Boolean, default: true }
});

const Book = mongoose.model('Book', bookSchema);

// Routes

// GET all books (with optional search & pagination)
app.get('/api/books', async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const filter = {};
    if(author) filter.author = author;
    if(genre) filter.genre = genre;

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if(!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new book
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, genre, price, publishedDate, inStock } = req.body;
    const book = new Book({
      title,
      author,
      genre,
      price,
      publishedDate: publishedDate || Date.now(),
      inStock: inStock !== undefined ? inStock : true
    });
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update book
app.put('/api/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if(!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
