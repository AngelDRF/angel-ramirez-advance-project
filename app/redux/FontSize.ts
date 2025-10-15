import { createSlice } from "@reduxjs/toolkit";

const fontSize = createSlice({
  name: "fontSize",
  initialState: "small",
  reducers: {
    setFontSize: (state, action) => action.payload,
  },
});

export const { setFontSize } = fontSize.actions;
export default fontSize.reducer;
