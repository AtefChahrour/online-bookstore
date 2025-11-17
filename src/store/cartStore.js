import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],

  addToCart: (book) =>
    set((state) => {
      // if book already exists, do not duplicate, just increase quantity
      const existing = state.cart.find((item) => item.id === book.id);

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === book.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      // if not exists, add with quantity = 1
      return {
        cart: [...state.cart, { ...book, quantity: 1 }],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
