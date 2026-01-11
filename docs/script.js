const form = document.getElementById("bookForm");
const booksList = document.getElementById("booksList");

// Use local API first (or replace with Render URL later)
const API_URL = "https://online-bookstore-api-production.up.railway.app/api/books";

fetch(API_URL)
  .then(res => res.json())
  .then(data => console.log(data));
// Fetch all books
async function fetchBooks() {
  const res = await fetch(API_URL);
  const books = await res.json();
  booksList.innerHTML = "";
  books.forEach(book => {
    const li = document.createElement("li");
    li.textContent = `${book.title} by ${book.author} - $${book.price}`;
    booksList.appendChild(li);
  });
}

// Add new book
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const book = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    genre: document.getElementById("genre").value,
    price: parseFloat(document.getElementById("price").value),
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  });

  form.reset();
  fetchBooks();
});

// Initial fetch
fetchBooks();
