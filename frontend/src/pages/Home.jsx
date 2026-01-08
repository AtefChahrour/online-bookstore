import { useEffect, useState } from "react";

export default function Home() {
  const API = import.meta.env.VITE_API_URL;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/books/featured`);
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

  return (
    <div className="container">
      <h1 className="h1">Featured books</h1>
      <div className="p">Top picks from the store</div>

      {loading && <div style={{ marginTop: 12, color: "var(--muted)" }}>Loading...</div>}
      {error && <div className="msg-err" style={{ marginTop: 12 }}>{error}</div>}

      {!loading && !error && (
        <div className="grid" style={{ marginTop: 16 }}>
          {books.map((b) => (
            <div key={b.id} className="card">
              {b.image_key ? (
                <img className="cover" src={`/covers/${b.image_key}`} alt={`${b.title} cover`} />
              ) : null}

              <div style={{ marginTop: 12, fontSize: 18, fontWeight: 800 }}>{b.title}</div>
              <div style={{ color: "var(--muted)", marginTop: 4 }}>{b.author}</div>
              <div style={{ marginTop: 10, fontWeight: 800 }}>
                ${Number(b.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
