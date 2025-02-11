import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  code: '',  // This will hold the content of the code editor
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
  },
});

export const { setCode } = editorSlice.actions;
export default editorSlice.reducer;
