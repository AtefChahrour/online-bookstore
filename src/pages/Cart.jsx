import React from "react";
import Navbar from "../components/Navbar";
import useCartStore from "../store/cartStore";
import "./Cart.css";

function Cart() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleBuy = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    alert("Books ordered successfully");
  };

  return (
    <>
      <Navbar />

      <div className="cart-container">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <p>Your cart is currently empty.</p>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-image" />

                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p>{item.author}</p>
                  <p>Quantity: {item.quantity}</p>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button className="buy-btn" onClick={handleBuy}>
              Buy
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
