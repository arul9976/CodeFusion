import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: '',
    username: '',
    email: '',
    isLoggedIn: false,
    profilePic: null
  },
  code: '',
  language: '',
  output: '',
  cursor: { row: 0, column: 0 },
  currentTheme: 'dark',
  activeFile: null,
  editorTheme: 'twilight',
  workspaces: [],
  terminalHistory: [
    { type: 'output', content: 'Welcome to Web IDE Terminal' },
    { type: 'output', content: 'Type "help" for available commands' }
  ],
  inputWant: false,
  notifications: [],
  IDELoading: true,
  Chat: {
    chatMessages: {
      "Bot": [
        {
          text: "Hello! I'm your assistant. How can I help you today?",
          sender: "Bot",
          timestamp: new Date().toLocaleTimeString(),
          isBot: true,
        },
      ],
      "All": [],
    },
    hasMore: true,
    oldestId: null,
    loading: false
  },
  workspaceFiles: [],

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
      const { name, username, email, isLoggedIn, profilePic } = action.payload;
      state.user.name = name ? name.charAt(0).toUpperCase() + name.substring(1) : email.split("@")[0];
      state.user.username = username;
      state.user.email = email;
      state.user.isLoggedIn = isLoggedIn;
      state.user.profilePic = profilePic;
      console.log("Profile " + state.user.profilePic);
    },

    updateNkname: (state, action) => {
      const { name, email, profilePic } = action.payload;
      console.log(name, email, profilePic);

      state.user.name = name.charAt(0).toUpperCase() + name.substring(1);
      state.user.email = email;
      state.user.profilePic = profilePic;
      localStorage.setItem('name', name);
      localStorage.setItem('profilePic', profilePic);
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
    },

    updateWorkspace: (state, action) => {
      const { workspaceName, newWsName } = action.payload;
      state.workspaces = state.workspaces.map(ws => {
        if (ws['workspaceName'] === workspaceName) {
          ws['workspaceName'] = newWsName;
        }
        return ws;
      });
    },

    deleteWorkspace: (state, action) => {
      const { workspaceName } = action.payload;
      state.workspaces = state.workspaces.filter(ws => ws['workspaceName'] !== workspaceName);
    },



    setTerminalHistory: (state, action) => {
      console.log(action.payload);
      // if (state.terminalHistory.length > 20) {
      //   state.terminalHistory.shift();
      //   state.terminalHistory.push(...action.payload);
      //   return;
      // }
      state.terminalHistory.push(...action.payload);
    },

    emptyTerminalHistory: (state, action) => {
      state.terminalHistory = [
        { type: 'output', content: 'Welcome to Web IDE Terminal' },
        { type: 'output', content: 'Type "help" for available commands' }
      ];
    },

    setInputWant: (state, action) => {
      const { isWant } = action.payload
      state.inputWant = isWant;
    },

    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },

    pushNotifications: (state, action) => {
      state.notifications.push(action.payload);
    },

    setOlderMessages: (state, action) => {

      const { messages, isFirst } = action.payload;

      const groupedByName = messages.reduce((acc, msg) => {
        if (!acc[msg.receiver]) {
          acc[msg.receiver] = [];
        }

        acc[msg.receiver].push(msg);
        return acc;
      }, {});

      // console.log(groupedByName);

      state.Chat.oldestId = messages[0].id;
      console.log("Oldest ID", state.Chat.oldestId);

      Object.keys(groupedByName).forEach(key => {
        const userMessages = groupedByName[key];
        console.log(key, userMessages);

        if (key === 'All') {
          if (isFirst) {
            state.Chat.chatMessages[key] = userMessages;

          } else
            state.Chat.chatMessages[key] = [...userMessages, ...(state.Chat.chatMessages[key] || [])];
        } else {
          if (isFirst) {
            state.Chat.chatMessages[key] = userMessages;
          } else
            state.Chat.chatMessages[key] = [...userMessages.filter(msg => msg.receiver === state.user.username || msg.sender === state.user.username), ...(state.Chat.chatMessages[key] || [])];

        }
      })


      // const allMessages = messages.filter(message => message.receiver === 'All');
      // state.Chat.chatMessages['All'] = [...allMessages, ...state.Chat.chatMessages['All'] || {}];


      //  else {
      //   // console.log("User -> ", selectedOption);
      //   state.Chat.chatMessages[selectedOption] = state.Chat.chatMessages[selectedOption] || [];
      //   state.Chat.chatMessages[selectedOption] = [userMessage, ...state.Chat.chatMessages[selectedOption] || {}];
      // }

    },


    setChatMessages: (state, action) => {
      const { selectedOption, userMessage } = action.payload;
      if (userMessage.receiver === 'All') {
        // console.log(userMessage);
        state.Chat.chatMessages['All'] = [...state.Chat.chatMessages['All'] || {}, userMessage];

      } else if (userMessage.isBot) {
        state.Chat.chatMessages['Bot'] = [...state.Chat.chatMessages['Bot'] || {}, userMessage];

      } else {
        // console.log("User -> ", selectedOption);
        state.Chat.chatMessages[selectedOption] = state.Chat.chatMessages[selectedOption] || [];
        state.Chat.chatMessages[selectedOption] = [...state.Chat.chatMessages[selectedOption] || {}, userMessage];
      }

    },

    setMsgSeened: (state, action) => {
      const { message, idx } = action.payload;
      // console.log(message, idx);
      let msg = null;
      if (message.receiver === 'All') {
        msg = state.Chat.chatMessages['All'].find((msg, i) => i == idx);
      } else {
        msg = state.Chat.chatMessages[message.sender].find((msg, i) => i == idx);
      }
      // console.log("--->\n", msg);

      if (msg) {
        msg.seen = true;
        // console.log(msg);

      }
    },

    setLoading: (state, action) => {
      state.Chat.loading = action.payload;
    },


    setHasMore: (state, action) => {
      state.Chat.hasMore = action.payload;
    },

    emptyChat: (state, action) => {
      Object.keys(state.Chat.chatMessages).forEach(key => {
        state.Chat.chatMessages[key] = [];
      })
    },


    setIDELoading: (state, action) => {
      state.IDELoading = action.payload;
    },

    setworkspaceFiles: (state, action) => {
      state.workspaceFiles = action.payload;
    }
  },
});

export const {

  setCode, setLang, setOutput, setCursor, setCurrentTheme, setActiveFile, setEditorTheme, removeYdoc, setUser,
  setWorkspaces, pushWorkspace, setTerminalHistory, emptyTerminalHistory, setInputWant, pushNotifications,
  setNotifications, updateWorkspace, deleteWorkspace, updateNkname, setChatMessages, setMsgSeened,
  setOlderMessages, setLoading, setHasMore, emptyChat, setIDELoading, setworkspaceFiles

} = editorSlice.actions;

export default editorSlice.reducer;
