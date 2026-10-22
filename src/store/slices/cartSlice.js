import { createSlice } from '@reduxjs/toolkit';

// Helper function: Cart ka total amount calculate karne ke liye
const calculateTotal = items => {
  return items.reduce((total, item) => {
    // Har item ka default price 60 Rs/kg maan rahe hain agar item me price na ho
    const itemPrice = item.price || 60;
    return total + itemPrice * item.quantity;
  }, 0);
};

const initialState = {
  cartItems: [],
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Cart me item add karna
    addToCart: (state, action) => {
      const itemToAdd = action.payload;
      const existingItem = state.cartItems.find(
        item => item.id === itemToAdd.id,
      );

      if (existingItem) {
        // Agar pehle se hai, toh sirf quantity badhao
        existingItem.quantity += 1;
      } else {
        // Agar pehli baar add ho raha hai, toh quantity 1 set karo
        state.cartItems.push({
          id: itemToAdd.id,
          name: itemToAdd.name,
          stock: itemToAdd.stock,
          unit: itemToAdd.unit || 'kg',
          price: itemToAdd.price || 60, // Rs. 60 / kg
          image: itemToAdd.image,
          quantity: 1,
        });
      }

      // Total bill calculate karein
      state.totalAmount = calculateTotal(state.cartItems);
    },

    // 2. Cart se item remove karna
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== id);
      state.totalAmount = calculateTotal(state.cartItems);
    },

    // 3. Quantity badhana ya ghatana (+ / -)
    updateQuantity: (state, action) => {
      const { id, change } = action.payload; // change = +1 ya -1
      const item = state.cartItems.find(i => i.id === id);

      if (item) {
        item.quantity += change;

        // Agar quantity 0 ho jaye, toh cart se remove kar do
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter(i => i.id !== id);
        }
      }

      state.totalAmount = calculateTotal(state.cartItems);
    },

    // 4. Cart khali karna (Checkout hone par)
    clearCart: state => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
