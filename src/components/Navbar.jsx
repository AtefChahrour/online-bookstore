import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import useCartStore from "../store/cartStore";

function Navbar() {
  const cart = useCartStore((state) => state.cart);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <h2 className="nav-logo">Bookstore</h2>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>
          <Link to="/cart">Cart ({count})</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
