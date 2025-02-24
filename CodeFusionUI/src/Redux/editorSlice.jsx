import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: '',
    username: '',
    email: '',
    isLoggedIn: false
  },
  code: '',
  language: 'javascript',
  output: '',
  cursor: { row: 0, column: 0 },
  currentTheme: 'dark',
  activeFile: null,
  editorTheme: 'twilight',
  workspaces: [],
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

    setCurrentTheme: (state, action) => {
      state.cursor = action.payload;
    },

    setActiveFile: (state, action) => {
      state.activeFile = action.payload;
    },

    setEditorTheme: (state, action) => {
      state.editorTheme = action.payload;
    },

    setUser: (state, action) => {
      console.log(action.payload);
      const { name, username, email, isLoggedIn } = action.payload;
      state.user.name = name.charAt(0).toUpperCase() + name.substring(1);
      state.user.username = username;
      state.user.email = email;
      state.user.isLoggedIn = isLoggedIn;
      console.log(state.user.username);
    },

    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },

    pushWorkspace: (state, action) => {
      const { name, ownerEmail, techStack, dTime } = action.payload;
      state.workspaces.push({
        "workspaceName": name,
        "techStack": techStack,
        "lastAccess": dTime,
        "ownerName": ownerEmail.split("@")[0]
      });
    }

  },
});

export const {
  setCode, setLang, setOutput, setCursor, setCurrentTheme, setActiveFile, setEditorTheme, removeYdoc, setUser,
  setWorkspaces, pushWorkspace
} = editorSlice.actions;

export default editorSlice.reducer;
