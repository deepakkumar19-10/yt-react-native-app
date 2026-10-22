import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { INITIAL_ITEMS } from '../../data/initialItems';

// ==========================================
// 1. ASYNC THUNK: Dummy / Mock API Call
// ==========================================
export const fetchInventoryFromApi = createAsyncThunk(
  'inventory/fetchInventoryFromApi',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Real grocery items fetch kar rahe hain
      const response = await axios.get(
        'https://dummyjson.com/products/category/groceries',
      );

      // 2. API ke data ko hamare app ke format me convert kar rahe hain:
      const formattedItems = response.data.products.map(product => ({
        id: product.id,
        name: product.title,
        stock: product.stock,
        unit: 'kg',
        category: 'Grains & Cereals',
        description: product.description,
        image: product.thumbnail || product.images?.[0],
      }));

      // Yeh formattedItems fulfilled action ke payload me jayenge
      return formattedItems;
    } catch (error) {
      return rejectWithValue(error.message || 'API request failed');
    }
  },
);

// ==========================================
// 2. INVENTORY SLICE
// ==========================================
const inventorySlice = createSlice({
  name: 'inventory',

  // Shuruati State (initialItems.js se 6 items)
  initialState: {
    items: INITIAL_ITEMS,
    loading: false,
    error: null,
  },

  // Synchronous Reducers
  reducers: {
    // A. Stock +25 kg badhana
    restockItem: (state, action) => {
      const { id, amount = 25 } = action.payload;
      const target = state.items.find(item => item.id === id);
      if (target) {
        target.stock = Number(target.stock) + amount;
      }
    },

    // B. Item delete karna
    deleteItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },

    // C. Naya item add karna
    addItem: (state, action) => {
      state.items.unshift(action.payload); // List ke top par add karega
    },

    // D. Item edit karna
    updateItem: (state, action) => {
      const updated = action.payload;
      const index = state.items.findIndex(item => item.id === updated.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updated };
      }
    },
  },

  // Asynchronous Lifecycle Actions (API ke liye)
  extraReducers: builder => {
    builder
      // 1. PENDING: Jab API call start ho
      .addCase(fetchInventoryFromApi.pending, state => {
        state.loading = true;
        state.error = null;
      })

      // 2. FULFILLED: Jab API success ho jaye
      .addCase(fetchInventoryFromApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // <-- Server se aaya naya data store me save ho gaya!
      })
      // 3. REJECTED: Jab API fail ho jaye
      .addCase(fetchInventoryFromApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch items';
      });
  },
});

// Actions aur Reducer ko export karein
export const { restockItem, deleteItem, addItem, updateItem } =
  inventorySlice.actions;
export default inventorySlice.reducer;
