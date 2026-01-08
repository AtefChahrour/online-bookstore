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
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Home</h1>
      <p>Featured books</p>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {books.map((b) => (
            <div key={b.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              {/* If you enabled backend static images, this will work when you add files */}
              {/* <img src={`${API}/images/${b.image_key}`} alt={b.title} style={{ width: "100%", borderRadius: 8 }} /> */}

              <h3 style={{ margin: "8px 0" }}>{b.title}</h3>
              <div style={{ opacity: 0.8 }}>{b.author}</div>
              <div style={{ marginTop: 8, fontWeight: 600 }}>${Number(b.price).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
