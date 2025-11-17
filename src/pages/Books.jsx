import React from "react";
import Navbar from "../components/Navbar";
import useCartStore from "../store/cartStore";
import "./Books.css";
function Books() {
  const addToCart = useCartStore((state) => state.addToCart);
  const books = [
    {
      id: 1,
      title: "IT",
      author: "Stephen King",
      image: "/src/assets/book1.jpg",
    },
    {
      id: 2,
      title: "Harry Potter & The Half Blooded Prince",
      author: "Author Two",
      image: "/src/assets/book2.jpg",
    },
    {
      id: 3,
      title: "Pet Semetary",
      author: "Stephen King",
      image: "/src/assets/book3.jpg",
    },
    {
      id: 4,
      title: "The Davinci Code",
      author: "Dan Brown",
      image: "/src/assets/book4.jpg",
    },
    {
      id: 5,
      title: "Murder On The Orient Express",
      author: "Agatha Christie",
      image: "/src/assets/book5.jpg",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="books-page-container">
        <h1>Our Books</h1>

        <div className="books-list">
          {books.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => addToCart(book)}
            >
              <img src={book.image} alt={book.title} className="book-cover" />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Books;
