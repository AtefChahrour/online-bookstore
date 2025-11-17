import React from "react";
import Navbar from "../components/Navbar";
import useCartStore from "../store/cartStore";
import "./Books.css";

import book1 from "../assets/book1.jpg";
import book2 from "../assets/book2.jpg";
import book3 from "../assets/book3.jpg";
import book4 from "../assets/book4.jpg";
import book5 from "../assets/book5.jpg";

function Books() {
  const addToCart = useCartStore((state) => state.addToCart);
  const books = [
    {
      id: 1,
      title: "IT",
      author: "Stephen King",
      image: book1,
    },
    {
      id: 2,
      title: "Harry Potter & The Half Blooded Prince",
      author: "Author Two",
      image: book2,
    },
    {
      id: 3,
      title: "Pet Semetary",
      author: "Stephen King",
      image: book3,
    },
    {
      id: 4,
      title: "The Davinci Code",
      author: "Dan Brown",
      image: book4,
    },
    {
      id: 5,
      title: "Murder On The Orient Express",
      author: "Agatha Christie",
      image: book5,
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
