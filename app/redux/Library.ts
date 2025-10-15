import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Book {
  id: string;
  imageLink: string;
  audioLink: string;
  title: string;
  author: string;
  subTitle: string;
  averageRating: number;
  duration: string;
}

interface LibraryState {
  savedBooks: { [id: string]: Book };
}

const initialState: LibraryState = {
  savedBooks: {},
};

const library = createSlice({
  name: "library",
  initialState: {
    savedBooks: {} as { [id: string]: Book },
  },
  reducers: {
    toggleSavedState: (state, action: PayloadAction<Book>) => {
      const book = action.payload;
      if (state.savedBooks[book.id]) {
        delete state.savedBooks[book.id];
      } else {
        state.savedBooks[book.id] = book;
      }
    },

    saveBook: (state, action: PayloadAction<Book>) => {
      const book = action.payload;
      state.savedBooks[book.id] = book;
    },

    removeBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      delete state.savedBooks[bookId];
    },

    loadSavedBooks: (state, action: PayloadAction<{ userId: string }>) => {
      const { userId } = action.payload;
      const savedBooks = localStorage.getItem(`savedBooks_${userId}`);
      if (savedBooks) {
        state.savedBooks = JSON.parse(savedBooks);
      }
    },

    clearSavedBooks: (state) => {
      state.savedBooks = {};
    },
    updateBookDuration: (
      state,
      action: PayloadAction<{ id: string; duration: string }>
    ) => {
      const { id, duration } = action.payload;
      if (state.savedBooks[id]) {
        state.savedBooks[id].duration = duration;
      }
    },
  },
});

export const {
  toggleSavedState,
  saveBook,
  removeBook,
  loadSavedBooks,
  clearSavedBooks,
  updateBookDuration,
} = library.actions;
export default library.reducer;
