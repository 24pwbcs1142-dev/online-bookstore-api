document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookForm");
  const booksList = document.getElementById("booksList");

  const API_URL = "https://online-bookstore-api-production.up.railway.app/api/books";

  // Fetch all books
  async function fetchBooks() {
    try {
      const res = await fetch(API_URL);
      const books = await res.json();
      booksList.innerHTML = "";
      books.forEach(book => {
        const li = document.createElement("li");
        li.textContent = `${book.title} by ${book.author} - $${book.price}`;
        booksList.appendChild(li);
      });
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  }

  // Add new book
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const book = {
      title: document.getElementById("title").value.trim(),
      author: document.getElementById("author").value.trim(),
      genre: document.getElementById("genre").value.trim(),
      price: parseFloat(document.getElementById("price").value),
      publishedDate: new Date().toISOString(),
      inStock: true
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add book");
      }

      form.reset();
      fetchBooks();
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book. Check console.");
    }
  });

  // Initial fetch
  fetchBooks();
});
