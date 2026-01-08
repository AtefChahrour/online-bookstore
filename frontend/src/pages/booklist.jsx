import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToCart, cartCount } from "../utils/cart.js";

export default function BookList() {
  const API = import.meta.env.VITE_API_URL;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [count, setCount] = useState(cartCount());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/books`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load books.");
        setBooks(data);
      } catch (e) {
        setError(e.message || "Network error.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [API]);

  function buy(book) {
    addToCart(book, 1);
    setCount(cartCount());
    setMsg(`Added "${book.title}" to cart.`);
    setTimeout(() => setMsg(""), 1500);
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Shop</h1>
        <div style={{ marginLeft: "auto" }}>
          <Link to="/cart">Cart ({count})</Link>
        </div>
      </div>

      {msg && <div style={{ marginTop: 10, color: "green" }}>{msg}</div>}
      {loading && <div style={{ marginTop: 10 }}>Loading...</div>}
      {error && <div style={{ marginTop: 10, color: "crimson" }}>{error}</div>}

      {!loading && !error && (
        <div style={{ marginTop: 16, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {books.map((b) => (
            <div key={b.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{b.title}</div>
              <div style={{ opacity: 0.8 }}>{b.author}</div>
              <div style={{ marginTop: 8 }}>${Number(b.price).toFixed(2)}</div>

              <button onClick={() => buy(b)} style={{ marginTop: 10, padding: "8px 10px", cursor: "pointer" }}>
                Buy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
