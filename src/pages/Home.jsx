import React from "react";
import Navbar from "../components/Navbar";
import "./Home.css";

import book1 from "../assets/book1.jpg";
import book2 from "../assets/book2.jpg";
import book3 from "../assets/book3.jpg";

function Home() {
  return (
    <>
      <Navbar />

      <div className="home-container">
        <h1 className="home-title">Featured Books</h1>

        <div className="books-grid">
          <img src={book1} alt="Book 1" className="book-image" />
          <img src={book2} alt="Book 2" className="book-image" />
          <img src={book3} alt="Book 3" className="book-image" />

        </div>
      </div>
    </>
  );
}

export default Home;
