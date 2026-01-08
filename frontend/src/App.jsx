import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home.jsx";
import Books from "./pages/Books.jsx";
import BookList from "./pages/booklist.jsx";
import Cart from "./pages/cart.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <div>
      <div className="navbar">
        <div className="nav-inner">
          <Link to="/" className="brand">
            Online Bookstore
          </Link>

          <Link to="/">Home</Link>
          <Link to="/books">Admin Books</Link>
          <Link to="/booklist">Shop</Link>
          <Link to="/cart">Cart</Link>

          <div className="spacer" />

          {user ? (
            <div className="row">
              <span style={{ color: "var(--muted)", fontSize: 14 }}>
                Welcome{user.name ? `, ${user.name}` : ""}!
              </span>
              <button className="btn" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="row">
              <Link to="/login">Login</Link>
              <Link className="btn btn-primary" to="/signup">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/booklist" element={<BookList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login onLogin={(u) => setUser(u)} />} />
        <Route path="/signup" element={<Signup onSignup={(u) => setUser(u)} />} />
      </Routes>
    </div>
  );
}
