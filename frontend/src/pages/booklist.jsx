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
    setTimeout(() => setMsg(""), 1200);
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 className="h1">Shop</h1>
        <Link className="btn" to="/cart">Cart ({count})</Link>
      </div>

      {msg && <div className="msg-ok" style={{ marginTop: 12 }}>{msg}</div>}
      {loading && <div style={{ marginTop: 12, color: "var(--muted)" }}>Loading...</div>}
      {error && <div className="msg-err" style={{ marginTop: 12 }}>{error}</div>}

      {!loading && !error && (
        <div className="grid" style={{ marginTop: 16 }}>
          {books.map((b) => {
            const src = b.image_key ? `/covers/${b.image_key}` : "";
            return (
              <div key={b.id} className="card">
                {b.image_key ? (
                  <img className="cover" src={src} alt={`${b.title} cover`} />
                ) : null}

                <div style={{ marginTop: 12, fontSize: 18, fontWeight: 800 }}>
                  {b.title}
                </div>
                <div style={{ color: "var(--muted)", marginTop: 4 }}>{b.author}</div>
                <div style={{ marginTop: 10, fontWeight: 800 }}>
                  ${Number(b.price).toFixed(2)}
                </div>

                <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => buy(b)}>
                  Buy
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
