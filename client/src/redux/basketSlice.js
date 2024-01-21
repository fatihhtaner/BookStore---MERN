import { createSlice } from '@reduxjs/toolkit';

export const basketSlice = createSlice({
  name: 'basket',
  initialState: {
    list: [],
    count: 0,
  },
  reducers: {
     addBook: (state, action) => {
      const existingBook = state.list.find(book => book.ISBN === action.payload.ISBN);
      
      if (existingBook) {
        existingBook.quantity += 1;
      } else {
        state.list.push({ ...action.payload, quantity: 1 });
      }

      state.count += 1;
    },
    removeBook: (state, action) => {
      const existingBook = state.list.find(book => book.ISBN === action.payload.ISBN);
      
      if (existingBook) {
        existingBook.quantity -= 1;
        
        if (existingBook.quantity <= 0) {
          state.list = state.list.filter(book => book.ISBN !== action.payload.ISBN);
        }

        state.totalCount -= 1;
      }
    }
  },
});

export const { addBook, removeBook } = basketSlice.actions;

export const selectBooks = state => state.basket.list;
export const selectBasketCount = state => state.basket.count;
export const selectBookQuantity = (state, ISBN) => {
  const book = state.basket.list.find(book => book.ISBN === ISBN);
  return book ? book.quantity : 0;
};
export const selectTotalCost = state => {
  const books = state.basket.list;

  // Her bir kitabın miktarını ve maliyetini çarpar, toplar
  const totalCost = books.reduce((total, book) => {
    return total + (book.quantity * book.cost);
  }, 0);

  return totalCost;
};

export default basketSlice.reducer;
