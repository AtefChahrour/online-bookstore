import React from "react";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />

      <div className="home-container">
        <h1 className="home-title">Featured Books</h1>

        <div className="books-grid">
          <img src="/src/assets/book1.jpg" alt="IT" className="book-image" />
          <img src="/src/assets/book2.jpg" alt="HARRY" className="book-image" />
          <img src="/src/assets/book3.jpg" alt="PET" className="book-image" />

        </div>
      </div>
    </>
  );
}

export default Home;
