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

interface FinishedState {
  finishedBooks: { [id: string]: Book };
}

const initialState: FinishedState = {
  finishedBooks: {},
};

const finished = createSlice({
  name: "finished",
  initialState: {
    finishedBooks: {} as { [id: string]: Book },
  },
  reducers: {
    markAsFinished: (state, action: PayloadAction<Book>) => {
      const book = action.payload;
      state.finishedBooks[book.id] = book;
    },
    clearFinishedBooks: (state) => {
      state.finishedBooks = {};
    },
    loadFinishedBooks: (
      state,
      action: PayloadAction<{ [id: string]: Book }>
    ) => {
      state.finishedBooks = action.payload;
    },
    updateFinishedBookDuration: (
      state,
      action: PayloadAction<{ id: string; duration: string }>
    ) => {
      const { id, duration } = action.payload;
      if (state.finishedBooks[id]) {
        state.finishedBooks[id].duration = duration;
      }
    },
  },
});

export const {
  markAsFinished,
  clearFinishedBooks,
  loadFinishedBooks,
  updateFinishedBookDuration,
} = finished.actions;
export default finished.reducer;
