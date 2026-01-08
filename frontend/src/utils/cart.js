const CART_KEY = "cart";

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(book, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.book_id === book.id);

  if (idx >= 0) {
    cart[idx].quantity += qty;
  } else {
    cart.push({
      book_id: book.id,
      title: book.title,
      author: book.author,
      price: Number(book.price),
      quantity: qty,
      image_key: book.image_key || ""
    });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(bookId) {
  const cart = getCart().filter((x) => x.book_id !== bookId);
  saveCart(cart);
  return cart;
}

export function updateQty(bookId, quantity) {
  const cart = getCart().map((x) => {
    if (x.book_id !== bookId) return x;
    return { ...x, quantity: Math.max(1, Number(quantity) || 1) };
  });
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
  return [];
}

export function cartCount() {
  return getCart().reduce((sum, x) => sum + (Number(x.quantity) || 0), 0);
}

export function cartTotal() {
  return getCart().reduce((sum, x) => sum + (Number(x.price) || 0) * (Number(x.quantity) || 0), 0);
}
