import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Books() {
  const API = import.meta.env.VITE_API_URL;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [price, setPrice] = useState("");

  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState("");

  const token = localStorage.getItem("token");

  async function fetchBooks() {
    setError("");
    setLoading(true);
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

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setAddMsg("");
    setError("");

    if (!token) {
      setAddMsg("You must be logged in to add books.");
      return;
    }

    if (!title.trim()) return setAddMsg("Title is required.");
    if (!author.trim()) return setAddMsg("Author is required.");
    if (price === "" || Number.isNaN(Number(price))) return setAddMsg("Price must be a number.");

    setAdding(true);
    try {
      const res = await fetch(`${API}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          author,
          image_key: imageKey,
          price: Number(price)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(data?.message || "Failed to add book.");
      }

      setAddMsg("Book added.");
      setTitle("");
      setAuthor("");
      setImageKey("");
      setPrice("");

      await fetchBooks();
    } catch (e) {
      setError(e.message || "Network error.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 16 }}>
      <h1>Books</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>Add a book</h3>

          {!token ? (
            <div>
              <div style={{ marginBottom: 10, color: "crimson" }}>
                You must be logged in to add books.
              </div>
              <Link to="/login">Go to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleAdd} style={{ display: "grid", gap: 10 }}>
              <label>
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: 8 }}
                  placeholder="IT"
                />
              </label>

              <label>
                Author
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  style={{ width: "100%", padding: 8 }}
                  placeholder="Stephen King"
                />
              </label>

              <label>
                Image key (optional)
                <input
                  value={imageKey}
                  onChange={(e) => setImageKey(e.target.value)}
                  style={{ width: "100%", padding: 8 }}
                  placeholder="it.jpg"
                />
              </label>

              <label>
                Price
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ width: "100%", padding: 8 }}
                  placeholder="19.99"
                />
              </label>

              {addMsg && (
                <div style={{ color: addMsg === "Book added." ? "green" : "crimson" }}>
                  {addMsg}
                </div>
              )}
              {error && <div style={{ color: "crimson" }}>{error}</div>}

              <button disabled={adding} style={{ padding: 10 }}>
                {adding ? "Adding..." : "Add book"}
              </button>
            </form>
          )}
        </div>

        <div>
          <h3>All books</h3>

          {loading && <div>Loading...</div>}
          {!loading && !error && books.length === 0 && <div>No books yet.</div>}

          {!loading && books.length > 0 && (
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {books.map((b) => (
                <div key={b.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontWeight: 700 }}>{b.title}</div>
                  <div style={{ opacity: 0.8 }}>{b.author}</div>
                  <div style={{ marginTop: 8 }}>${Number(b.price).toFixed(2)}</div>
                  {b.image_key ? <div style={{ marginTop: 6, opacity: 0.7 }}>Image: {b.image_key}</div> : null}
                </div>
              ))}
            </div>
          )}

          {error && <div style={{ color: "crimson" }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
