  import { useEffect, useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import {
    clearCart,
    getCart,
    removeFromCart,
    updateQty,
    cartTotal,
  } from "../utils/cart.js";

  export default function Cart() {
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutMsg, setCheckoutMsg] = useState("");
    const [checkoutErr, setCheckoutErr] = useState("");

    useEffect(() => {
      setItems(getCart());
    }, []);

    function onRemove(bookId) {
      setItems(removeFromCart(bookId));
    }

    function onQty(bookId, q) {
      setItems(updateQty(bookId, q));
    }

    function onClear() {
      setItems(clearCart());
    }

    async function checkout() {
      setCheckoutErr("");
      setCheckoutMsg("");

      const token = localStorage.getItem("token");
      if (!token) {
        setCheckoutErr("Please login first.");
        navigate("/login");
        return;
      }

      if (items.length === 0) {
        setCheckoutErr("Your cart is empty.");
        return;
      }

      setCheckoutLoading(true);
      try {
        const res = await fetch(`${API}/api/orders/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: items.map((x) => ({
              book_id: x.book_id,
              quantity: Number(x.quantity),
            })),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Checkout failed.");

        clearCart();
        setItems([]);
        setCheckoutMsg(
          `Order #${data.orderId} placed. Total: $${Number(data.total).toFixed(2)}`
        );
      } catch (e) {
        setCheckoutErr(e.message || "Checkout failed.");
      } finally {
        setCheckoutLoading(false);
      }
    }

    const total = cartTotal();

    return (
      <div className="container">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 className="h1">Cart</h1>
          <Link className="btn" to="/booklist">
            Back to Shop
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="card" style={{ marginTop: 16 }}>
            Your cart is empty.{" "}
            <Link to="/booklist" style={{ textDecoration: "underline" }}>
              Go shopping
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
              {items.map((it) => (
                <div key={it.book_id} className="card">
                  <div
                    className="row"
                    style={{ justifyContent: "space-between", alignItems: "start" }}
                  >
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>
                        {it.title}
                      </div>
                      <div style={{ color: "var(--muted)", marginTop: 4 }}>
                        {it.author}
                      </div>
                      <div style={{ color: "var(--muted)", marginTop: 8 }}>
                        ${Number(it.price).toFixed(2)} each
                      </div>

                      <div style={{ marginTop: 10, fontWeight: 700 }}>
                        Subtotal: $
                        {(Number(it.price) * Number(it.quantity)).toFixed(2)}
                      </div>
                    </div>

                    <div className="row" style={{ gap: 10 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <span style={{ color: "var(--muted)" }}>Qty</span>
                        <input
                          className="input"
                          style={{ width: 90 }}
                          value={it.quantity}
                          onChange={(e) => onQty(it.book_id, e.target.value)}
                        />
                      </div>

                      <button className="btn" onClick={() => onRemove(it.book_id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="row"
              style={{ marginTop: 16, justifyContent: "space-between" }}
            >
              <button className="btn" onClick={onClear}>
                Clear cart
              </button>

              <div style={{ fontSize: 20, fontWeight: 800 }}>
                Total: ${Number(total).toFixed(2)}
              </div>
            </div>

            <div className="row" style={{ marginTop: 16, gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={checkout}
                disabled={checkoutLoading || items.length === 0}
              >
                {checkoutLoading ? "Checking out..." : "Checkout"}
              </button>

              {checkoutMsg && <div className="msg-ok">{checkoutMsg}</div>}
              {checkoutErr && <div className="msg-err">{checkoutErr}</div>}
            </div>

            <div style={{ marginTop: 12, color: "var(--muted)" }}>
              Next step: we will add Checkout to create rows in `orders` and
              `order_items`.
            </div>
          </>
        )}
      </div>
    );
  }
