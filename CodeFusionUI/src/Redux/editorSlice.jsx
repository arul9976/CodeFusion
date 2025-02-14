import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  code: '',
  language: 'javascript',
  output: '',
  cursor: { row: 0, column: 0 },
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setLang: (state, action) => {
      state.language = action.payload;
    },
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    setCursor: (state, action) => {
      console.log(action.payload);
      
      state.cursor = action.payload;
    },
  },
});

export const { setCode, setLang, setOutput, setCursor } = editorSlice.actions;

export default editorSlice.reducer;
