

import React, { useContext, useEffect, useRef, useState } from 'react';
import { MonacoBinding } from 'y-monaco';
import Editor from '@monaco-editor/react';
import { Parser } from "web-tree-sitter";

import { ClientContext } from './ClientContext';
import { getFileMode } from '../utils/GetIcon';
import { getFileContent } from '../utils/Fetch';
import { setCode, setLang } from '../Redux/editorSlice';
import { registerCompletion } from 'monacopilot';
import { debounce, throttle } from 'lodash';
import { useWebSocket } from '../Websocket/WebSocketProvider';
import { usePopup } from '../PopupIndication/PopUpContext';
import { UserContext } from '../LogInPage/UserProvider';
import { getRandomColor } from '../utils/Utilies';
import { Language } from 'web-tree-sitter';
const MonacoIDE = ({ activeFile }) => {

  const {  editorsRef, dispatch, language } = useContext(ClientContext);
  const { getWorkspaceProvider } = useWebSocket();
  const { showPopup } = usePopup();
  const { user } = useContext(UserContext);

  const editorRef = useRef(null);
  const languageWorkers = useRef({});

  const cursorLabelsRef = useRef({});

  const decorationsRef = useRef({});

  const currFile = useRef(null);
  const monacoRef = useRef(null);
  const monacoBind = useRef(null);
  const providerRef = useRef(null);

  const parserRef = useRef(null);

  const loadTreeSitter = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/web-tree-sitter@0.20.8/lib/index.js";
      script.onload = () => resolve(window.TreeSitter);
      document.head.appendChild(script);
    });

  const languageGrammars = {
    javascript: "https://unpkg.com/tree-sitter-javascript@0.20.1/tree-sitter-javascript.wasm",
    python: "/tree-sitter-python.wasm",
    java: "/tree-sitter-java.wasm",
    cpp: "https://unpkg.com/tree-sitter-cpp@0.20.3/tree-sitter-cpp.wasm",
    csharp: "https://unpkg.com/tree-sitter-c-sharp@0.20.0/tree-sitter-c-sharp.wasm",
    go: "https://unpkg.com/tree-sitter-go@0.20.0/tree-sitter-go.wasm",
    rust: "https://unpkg.com/tree-sitter-rust@0.20.1/tree-sitter-rust.wasm",
    php: "https://unpkg.com/tree-sitter-php@0.19.0/tree-sitter-php.wasm",
    ruby: "https://unpkg.com/tree-sitter-ruby@0.20.1/tree-sitter-ruby.wasm",
  };

  const updateErrors = (parser, editor, monacoInstance) => {
    const code = editor.getValue();
    const tree = parser.parse(code);
    console.log('Full syntax tree:', tree.rootNode.toString());

    const errors = [];
    const collectErrors = (node) => {
      if (node.type === 'ERROR') {
        console.log('Error node:', node.toString(), node.startPosition, node.endPosition);
        errors.push({
          severity: monaco.MarkerSeverity.Error,
          message: `Syntax error: ${node.text || 'invalid syntax'}`,
          startLineNumber: node.startPosition.row + 1,
          startColumn: node.startPosition.column + 1,
          endLineNumber: node.endPosition.row + 1,
          endColumn: node.endPosition.column + 1,
        });
      }
      node.children.forEach(collectErrors);
    };

    collectErrors(tree.rootNode);

    // if (tree.rootNode.hasError()) {
    //   console.log('Tree contains errors');
    // } else {
    //   console.log('No syntactic errors detected in tree');
    // }

    console.log('Detected errors:', errors);
    monacoInstance.editor.setModelMarkers(editor.getModel(), 'tree-sitter', errors);
  };

  const updateCursor = debounce(() => {

      const states = providerRef.current.awareness.getStates();
      // console.log("States ", states);

      states.forEach((state, clientId) => {
        // console.log("Client " + clientId, state.cursor);

        if (clientId !== providerRef.current.awareness.clientID && state.cursor && activeFile.id === state.activeFile) {
          const { lineNumber, column } = state.cursor;
          // console.log("Client " + clientId, lineNumber, column);
          // console.log(cursorLabelsRef.current);

          createUserCursor(editorRef.current, {
            id: clientId,
            name: state.username,
            color: getRandomColor(),
            position: { lineNumber, column }
          });
        }
      });

  }, 300)

  const initiateFile = (file) => {
    currFile.current = file;
    console.log(file);

    if (!editorRef.current) {
      console.log("Editor is not available");
      return;

    }

    editorsRef.current.get(file.id);
    const model = editorRef.current.getModel();

    const provider = getWorkspaceProvider(activeFile.id, bindMonaco, model);
    providerRef.current = provider;

    // provider.awareness.setLocalStateField('username', user.username);
    // provider.awareness.setLocalStateField('name', 'Alice');
    // provider.awareness.setLocalStateField('color', '#ff0000');

    console.log("Provider Initiated ", monacoBind.current, providerRef.current);



    provider.awareness.on('update', updateCursor);




  }

  const initParser = async (lan) => {
    try {
      console.log("+++ " + lan);
      let path = languageGrammars[lan]
      console.log("Path ", path);

      await Parser.init({
        locateFile: (file) => {
          return '/tree-sitter.wasm'; 
        },
      });

      const parser = new Parser();
      console.log("Path1 ", path);

      const lang = await Language.load(path);
      parser.setLanguage(lang);

      

      parserRef.current = parser;
      
      console.log('Parser initialized successfully');
      return parser;

    } catch (error) {
      console.error('Failed to initialize parser:', error);
    }
  };

  // useEffect(() => {

  //   console.log("Treesitter Init", language);
  //   if(language)
  //     initParser();
 
  // }, [language]);

  const bindMonaco = (yText, model, provider) => {
    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editorRef.current]),
      provider.awareness,
      {
        throttle: debounce((fn) => fn(), 700)
      }
    );

    monacoBind.current = binding;
  }

  function handleEditorDidMount(editor, monaco, file) {

    let lan = getFileMode(activeFile.name);

    console.log("Current Language " + lan);


    registerCompletion(monaco, editor, {
      language: lan,
      endpoint: `${import.meta.env.VITE_RUNNER_URL}/code-completion`,
    });

    initParser(lan).then(parser => {
      parserRef.current = parser;
      let c = 'def hello(): print("Hello, world!")';
      let t = parser.parse(c);
      console.log('Syntax tree:', t);
      console.log('Root node:', t.rootNode.toString());

      monaco.languages.registerCompletionItemProvider(lan, {
        provideCompletionItems: (model, position) => {
          if (!parser) {
            console.log("Not registered completion");
             return {  suggestions: [] }
          };

          const code = model.getValue();
          console.log("Curr Code ", code);

          const tree = parser.parse(code);
          const cursorPosition = { row: position.lineNumber - 1, column: position.column - 1 };
          const node = tree.rootNode.namedDescendantForPosition(cursorPosition);

          const suggestions = [];
          
          const collectSuggestions = (n) => {
            if (n.type === "identifier" || n.type === "variable_name" || n.type === "function_definition" || n.type === "class_definition") {
              suggestions.push({
                label: n.text,
                kind: monaco.languages.CompletionItemKind[n.type.includes("function") ? "Function" : "Variable"],
                insertText: n.text,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column - 1,
                  endColumn: position.column,
                },
              });
            }
            n.children.forEach(collectSuggestions);
          };

          // const collectSuggestions = (n) => {
          //   if (!n) return;
          //   let kind;
          //   switch (n.type) {
          //     case 'function_definition':
          //       kind = monaco.languages.CompletionItemKind.Function;
          //       break;
          //     case 'class_definition':
          //       kind = monaco.languages.CompletionItemKind.Class;
          //       break;
          //     case 'identifier':
          //     case 'variable_name':
          //       kind = monaco.languages.CompletionItemKind.Variable;
          //       break;
          //     default:
          //       return;
          //   }
          //   suggestions.push({
          //     label: n.text,
          //     kind,
          //     insertText: n.text,
          //     range: {
          //       startLineNumber: position.lineNumber,
          //       endLineNumber: position.lineNumber,
          //       startColumn: position.column,
          //       endColumn: position.column,
          //     },
          //   });
          //   n.children.forEach(collectSuggestions);
          // };

          collectSuggestions(node || tree.rootNode);

          console.log("Suggestions ", suggestions);
          
          return { suggestions:suggestions };
        },
      });
    })

   

    // console.log(file);
    currFile.current = file;
    if (!file) return;
    monacoRef.current = monaco;
    editorRef.current = editor;
    editorsRef.current.set(file.id, editor);
    initiateFile(file);

    // const localUser = { id: 'local', name: 'you', color: getRandomColor(), position: { lineNumber: 1, column: 1 } };
   
    // createUserCursor(editor, localUser);

    editor.onDidChangeCursorPosition((e) => {
      // console.log('Local cursor moved to:', e.position);
      // console.log('Local awareness state:', providerRef.current.awareness.getLocalState());

      // updateUserCursor(editor, {
      //   ...localUser,
      //   position: e.position
      // });

      providerRef.current.awareness.setLocalStateField('cursor', e.position)
    
    });

    // editor.onDidBlurEditorText(() => {
    //   if (cursorLabelsRef.current[localUser.id]) {
    //     cursorLabelsRef.current[localUser.id].style.display = 'none';
    //   }
    // });

    // editor.onDidFocusEditorText(() => {
    //   if (cursorLabelsRef.current[localUser.id]) {
    //     cursorLabelsRef.current[localUser.id].style.display = 'block';
    //   }
    // });

    editor.onDidChangeModelContent((e) => {
      if (parserRef.current) {
        updateErrors(parserRef.current, editor, monaco);
        console.log("Error updating");

      }
    });

  }

  const handleChange = (value) => {
    // console.log(value);
    dispatch(setCode(value));

  }


  useEffect(() => {
    if (!monacoBind.current) return;

    // monacoBind.current.update();
    
    return () => {
      if (monacoBind.current) {
        monacoBind.current.destroy();
      }
    };

  }, [monacoBind]);


  useEffect(() => {

    const lan = getFileMode(activeFile.name);
    dispatch(setLang(lan))
    console.log("Runned", language);

    if (editorRef.current && currFile.current.id !== activeFile.id) {
      console.log(activeFile);

      monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), lan)
      // initiateFile(activeFile);
      console.log("Initiated");

    }
    return () => {
      Object.values(cursorLabelsRef.current).forEach(label => {
        if (label && label.parentNode) {
          label.parentNode.removeChild(label);
        }
      });
    };

  }, []);

  const createUserCursor = (editor, user) => {
    const domNode = editor.getDomNode();

    if (domNode) {

      if (!cursorLabelsRef.current[user.id]) {
        const userDiv = document.createElement('div');
        userDiv.className = `user-tag ${user.id}-tag`;
        userDiv.textContent = user.name;
        userDiv.style.position = 'absolute';
        userDiv.style.backgroundColor = user.color;
        userDiv.style.color = 'white';
        userDiv.style.padding = '2px 6px';
        userDiv.style.borderRadius = '3px';
        userDiv.style.fontSize = '12px';
        userDiv.style.zIndex = '10';
        userDiv.style.transition = 'all 0.2s ease-out';
        userDiv.style.pointerEvents = 'none';
        domNode.appendChild(userDiv);

        cursorLabelsRef.current[user.id] = userDiv;
      }

      updateUserCursor(editor, user);
    }
  };

  const beforeMount = (monaco) => {
    monaco.editor.defineTheme('modernDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: '9ca3af' },
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '93c5fd' },
        { token: 'string', foreground: '86efac' },
        { token: 'number', foreground: 'fca5a5' },
        { token: 'regexp', foreground: 'fdba74' },
        { token: 'function', foreground: 'c4b5fd' },
        { token: 'variable', foreground: 'd1d5db' },
        { token: 'variable.predefined', foreground: '93c5fd' },
        { token: 'constant', foreground: 'f9a8d4' },
        { token: 'type', foreground: '93c5fd' },
        { token: 'delimiter', foreground: '6b7280' },
        { token: 'delimiter.bracket', foreground: '9ca3af' },
        { token: 'tag', foreground: '93c5fd' },
        { token: 'attribute.name', foreground: 'c4b5fd' },
        { token: 'attribute.value', foreground: '86efac' },
        { token: 'class', foreground: 'c4b5fd', fontStyle: 'bold' },
        { token: 'interface', foreground: '93c5fd', fontStyle: 'bold' },

        { token: 'error', foreground: 'ef4444' },
        { token: 'warning', foreground: 'f59e0b' },
        { token: 'info', foreground: '3b82f6' }
      ],
      colors: {
        'editor.background': '#1a1d24',
        'editor.foreground': '#9ca3af',
        'editor.lineHighlightBackground': '#2d323c',
        'editor.selectionBackground': '#3b4252',
        'editor.inactiveSelectionBackground': '#2e3440',
        'editorWidget.background': '#1f2937',
        'editorWidget.border': '#374151',
        'editorSuggestWidget.background': '#1f2937',
        'editorSuggestWidget.border': '#374151',
        'editorSuggestWidget.selectedBackground': '#3b4252',
        'scrollbar.shadow': '#00000000',
        'scrollbarSlider.background': '#374151',
        'scrollbarSlider.hoverBackground': '#4b5563',
        'scrollbarSlider.activeBackground': '#6b7280',
        'activityBar.background': '#1a1d24',
        'activityBar.foreground': '#9ca3af',
        'sideBar.background': '#1a1d24',
        'sideBar.foreground': '#9ca3af',
        'editorLineNumber.foreground': '#4b5563',
        'editorLineNumber.activeForeground': '#9ca3af',
        'editorGutter.background': '#1a1d24',
        'editorIndentGuide.background': '#2d323c',
        'editorIndentGuide.activeBackground': '#4b5563',
        'editorBracketMatch.border': '#4f46e5',
        'editorBracketMatch.background': '#3b4252',

        'editorError.foreground': '#ef4444',
        'editorWarning.foreground': '#f59e0b',
        'editorInfo.foreground': '#3b82f6',
        'editorError.border': '#ef4444',
        'editorWarning.border': '#f59e0b',
        'editorInfo.border': '#3b82f6',

        'editorRuler.foreground': '#374151',
        'minimap.errorHighlight': '#ef4444',
        'minimap.warningHighlight': '#f59e0b',

        'editorOverviewRuler.errorForeground': '#ef4444',
        'editorOverviewRuler.warningForeground': '#f59e0b',
        'editorOverviewRuler.infoForeground': '#3b82f6'
      }
    });


    // Authorization: `Bearer ${'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'}`,


  };


  const updateUserCursor = (editor, user) => {
    if (cursorLabelsRef.current[user.id]) {
      const coordinates = editor.getScrolledVisiblePosition(user.position);

      if (coordinates) {
        cursorLabelsRef.current[user.id].style.left = `${coordinates.left + 20}px`;
        cursorLabelsRef.current[user.id].style.top = `${coordinates.top}px`;
        cursorLabelsRef.current[user.id].style.display = 'block';

        if (decorationsRef.current[user.id]) {
          decorationsRef.current[user.id].clear();
        }

        const userColor = user.color.replace('0.8', '0.3');
        decorationsRef.current[user.id] = editor.createDecorationsCollection([
          {
            range: new monaco.Range(
              user.position.lineNumber,
              user.position.column,
              user.position.lineNumber,
              user.position.column + 1
            ),
            options: {
              className: `${user.id}-cursor`,
              hoverMessage: { value: user.name },
              inlineClassName: `${user.id}-highlight`,
              stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
            }
          }
        ]);
      }
    }
  };

  return (

    <div style={{
      height: '100%',
      width: '100%',
    }}>
      <Editor
        height={"100%"} 
        width={"100%"}
        defaultLanguage={getFileMode(activeFile.name)}
        theme="modernDark"
        beforeMount={beforeMount}
        onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, activeFile)}
        onChange={handleChange}
        options={{
          // readOnly: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: { other: true, comments: true, strings: true },
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          semanticHighlighting: { enabled: true },
          wordBasedSuggestions: false,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
          fontLigatures: true,
          lineHeight: 1.5,
          letterSpacing: 0.5,
          padding: { top: 16, bottom: 16 },
          minimap: { enabled: false },
          scrollbar: { useShadows: false, verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          renderLineHighlight: 'all',
          roundedSelection: true,
          wordWrap: 'on',
          wordWrapColumn: 100,
          formatOnPaste: true,
          formatOnType: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          links: true,
          mouseWheelZoom: true,
          suggest: {
            insertMode: 'replace',
            snippetsPreventQuickSuggestions: false,
          },
          languages: {
            java: {
              diagnostics: true,
              validate: true
            }
          },
          codeActionsOnSave: {
            source: true
          },
          bracketPairColorization: {
            enabled: true,
          },
          "editor.diagnostics.enabled": true,
        }}
      />
    </div >

  )






};

export default MonacoIDE;


// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { MonacoBinding } from 'y-monaco';
// import Editor from '@monaco-editor/react';

// import { ClientContext } from './ClientContext';
// import { getFileMode } from '../utils/GetIcon';
// import { getFileContent } from '../utils/Fetch';
// import { setCode, setLang } from '../Redux/editorSlice';
// import { debounce } from 'lodash';
// import axios from 'axios';

// const MonacoIDE = ({ activeFile }) => {
//   const { initAndGetProvider, getYtext, editorsRef, bindings, dispatch, language } = useContext(ClientContext);

//   const editorRef = useRef(null);
//   const currFile = useRef(null);
//   const monacoRef = useRef(null);
//   const [currentSuggestion, setCurrentSuggestion] = useState("");
//   const [suggestionVisible, setSuggestionVisible] = useState(false);
//   const decorationsRef = useRef([]);

//   const initiateFile = (file) => {
//     currFile.current = file;
//     console.log(file);

//     if (!editorRef.current) {
//       console.log("Editor is not available");
//       return;
//     }

//     editorsRef.current.get(file.id);

//     const model = editorRef.current.getModel();

//     getFileContent(file.url).then((res) => {
//       console.log(res);
//       model.setValue(res);
//     });
//   };

//   function handleEditorDidMount(editor, monaco, file) {
//     console.log(file);
//     currFile.current = file;
//     if (!file) return;
//     monacoRef.current = monaco;
//     editorRef.current = editor;
//     editorsRef.current.set(file.id, editor);
//     initiateFile(file);

//     // Add keyboard event listener for Ctrl + Right Arrow to complete next word
//     editor.onKeyDown((e) => {
//       // Check if Ctrl + Right Arrow was pressed
//       if (e.ctrlKey && e.keyCode === monaco.KeyCode.RightArrow) {
//         e.preventDefault();
//         e.stopPropagation();

//         if (suggestionVisible && currentSuggestion) {
//           completeNextWord(currentSuggestion);
//         } else {
//           // If no suggestion is visible, request one and then complete
//           requestSuggestion().then(suggestion => {
//             if (suggestion) {
//               completeNextWord(suggestion);
//             }
//           });
//         }

//         return false; // Prevent default editor behavior
//       }
//     });

//     // Add a command for Ctrl + Right Arrow
//     editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.RightArrow, () => {
//       if (suggestionVisible && currentSuggestion) {
//         completeNextWord(currentSuggestion);
//       } else {
//         requestSuggestion().then(suggestion => {
//           if (suggestion) {
//             completeNextWord(suggestion);
//           }
//         });
//       }
//     });

//     // Request initial suggestion when the editor loads
//     setTimeout(() => {
//       requestSuggestion();
//     }, 1000);

//     // Set up cursor position change listener to update suggestions
//     editor.onDidChangeCursorPosition(() => {
//       // Hide the suggestion when cursor position changes
//       updateGhostText("");
//     });

//     // Set up content change listener
//     editor.onDidChangeModelContent(() => {
//       requestSuggestion();
//     });
//   }

//   // Function to update ghost text decoration
//   const updateGhostText = (suggestion) => {
//     if (!editorRef.current || !monacoRef.current) return;

//     const editor = editorRef.current;
//     const monaco = monacoRef.current;
//     const position = editor.getPosition();

//     // Clear previous decorations
//     decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);

//     if (!suggestion) {
//       setSuggestionVisible(false);
//       return;
//     }

//     // Add new decoration with ghost text
//     decorationsRef.current = editor.deltaDecorations([], [
//       {
//         range: {
//           startLineNumber: position.lineNumber,
//           startColumn: position.column,
//           endLineNumber: position.lineNumber,
//           endColumn: position.column
//         },
//         options: {
//           after: {
//             content: suggestion,
//             inlineClassName: 'suggestion-ghost'
//           }
//         }
//       }
//     ]);

//     setSuggestionVisible(true);
//   };

//   // Function to request a suggestion
//   const requestSuggestion = async () => {
//     if (!editorRef.current) return null;

//     const model = editorRef.current.getModel();
//     const position = editorRef.current.getPosition();

//     const textUntilPosition = model.getValueInRange({
//       startLineNumber: Math.max(1, position.lineNumber - 5),
//       startColumn: 1,
//       endLineNumber: position.lineNumber,
//       endColumn: position.column,
//     });

//     try {
//       const response = await axios.post(
//         "https://api-inference.huggingface.co/models/bigcode/starcoder",
//         {
//           inputs: textUntilPosition,
//           parameters: { max_new_tokens: 50, return_full_text: false },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${'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'}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const suggestion = response.data[0].generated_text.trim();
//       setCurrentSuggestion(suggestion);
//       updateGhostText(suggestion);
//       return suggestion;
//     } catch (error) {
//       console.error("Failed to get suggestion:", error);
//       updateGhostText("");
//       return null;
//     }
//   };

//   // Function to complete the next word from suggestion
//   const completeNextWord = (suggestion) => {
//     if (!editorRef.current || !suggestion) return;

//     // Extract the next word (handling code-specific delimiters)
//     const wordMatch = suggestion.match(/^(\S+)(\s+|$)/);
//     if (!wordMatch) return;

//     const nextWord = wordMatch[1];

//     const editor = editorRef.current;
//     const position = editor.getPosition();

//     // Insert the next word at the current position
//     editor.executeEdits('completion', [
//       {
//         range: {
//           startLineNumber: position.lineNumber,
//           startColumn: position.column,
//           endLineNumber: position.lineNumber,
//           endColumn: position.column
//         },
//         text: nextWord
//       }
//     ]);

//     // Update the current suggestion by removing the used word
//     const remainingSuggestion = suggestion.substring(nextWord.length).trim();
//     setCurrentSuggestion(remainingSuggestion);
//     updateGhostText(remainingSuggestion);

//     // Move cursor after the inserted word
//     editor.setPosition({
//       lineNumber: position.lineNumber,
//       column: position.column + nextWord.length
//     });
//   };

//   const handleChange = (value) => {
//     console.log(value);
//     dispatch(setCode(value));
//     // We'll request suggestions in the content change listener instead of here
//   };

//   useEffect(() => {
//     console.log("Runned");

//     const lan = getFileMode(activeFile.name);
//     dispatch(setLang(lan));
//     console.log(language);

//     if (editorRef.current && currFile.current && currFile.current.id !== activeFile.id) {
//       console.log(activeFile);

//       monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), lan);
//       console.log("Initiated");

//       // Request suggestion when file changes
//       setTimeout(() => {
//         requestSuggestion();
//       }, 500);
//     }
//   });

//   const beforeMount = (monaco) => {
//     monaco.editor.defineTheme('modernDark', {
//       base: 'vs-dark',
//       inherit: true,
//       rules: [
//         { token: '', foreground: '9ca3af' },
//         { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
//         { token: 'keyword', foreground: '93c5fd' },
//         { token: 'string', foreground: '86efac' },
//         { token: 'number', foreground: 'fca5a5' },
//         { token: 'regexp', foreground: 'fdba74' },
//         { token: 'function', foreground: 'c4b5fd' },
//         { token: 'variable', foreground: 'd1d5db' },
//         { token: 'variable.predefined', foreground: '93c5fd' },
//         { token: 'constant', foreground: 'f9a8d4' },
//         { token: 'type', foreground: '93c5fd' },
//         { token: 'delimiter', foreground: '6b7280' },
//         { token: 'delimiter.bracket', foreground: '9ca3af' },
//         { token: 'tag', foreground: '93c5fd' },
//         { token: 'attribute.name', foreground: 'c4b5fd' },
//         { token: 'attribute.value', foreground: '86efac' },
//         { token: 'class', foreground: 'c4b5fd', fontStyle: 'bold' },
//         { token: 'interface', foreground: '93c5fd', fontStyle: 'bold' }
//       ],
//       colors: {
//         'editor.background': '#1a1d24',
//         'editor.foreground': '#9ca3af',
//         'editor.lineHighlightBackground': '#2d323c',
//         'editor.selectionBackground': '#3b4252',
//         'editor.inactiveSelectionBackground': '#2e3440',
//         'editorWidget.background': '#1f2937',
//         'editorWidget.border': '#374151',
//         'editorSuggestWidget.background': '#1f2937',
//         'editorSuggestWidget.border': '#374151',
//         'editorSuggestWidget.selectedBackground': '#3b4252',
//         'scrollbar.shadow': '#00000000',
//         'scrollbarSlider.background': '#374151',
//         'scrollbarSlider.hoverBackground': '#4b5563',
//         'scrollbarSlider.activeBackground': '#6b7280',
//         'activityBar.background': '#1a1d24',
//         'activityBar.foreground': '#9ca3af',
//         'sideBar.background': '#1a1d24',
//         'sideBar.foreground': '#9ca3af',
//         'editorLineNumber.foreground': '#4b5563',
//         'editorLineNumber.activeForeground': '#9ca3af',
//         'editorGutter.background': '#1a1d24',
//         'editorIndentGuide.background': '#2d323c',
//         'editorIndentGuide.activeBackground': '#4b5563',
//         'editorBracketMatch.border': '#4f46e5',
//         'editorBracketMatch.background': '#3b4252'
//       }
//     });

//     // Add custom CSS for the ghost text suggestion
//     const style = document.createElement('style');
//     style.innerHTML = `
//       .suggestion-ghost {
//         opacity: 0.5;
//         font-style: italic;
//         color: #6b7280;
//         letter-spacing: 0;
//       }
      
//       .suggestion-tooltip {
//         background: #1f2937;
//         color: #93c5fd;
//         padding: 2px 8px;
//         border-radius: 4px;
//         font-size: 12px;
//         box-shadow: 0 2px 8px rgba(0,0,0,0.3);
//       }
//     `;
//     document.head.appendChild(style);
//   };

//   return (
//     <div style={{ height: '100%', width: '100%', position: 'relative' }}>
//       <Editor
//         height={"100%"}
//         width={"100%"}
//         defaultLanguage={getFileMode(activeFile.name)}
//         theme="modernDark"
//         beforeMount={beforeMount}
//         onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, activeFile)}
//         onChange={handleChange}
//         options={{
//           suggestOnTriggerCharacters: true,
//           quickSuggestions: { other: true, comments: true, strings: true },
//           acceptSuggestionOnCommitCharacter: true,
//           acceptSuggestionOnEnter: "on",
//           tabCompletion: "on",
//           wordBasedSuggestions: false,
//           fontSize: 14,
//           fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
//           fontLigatures: true,
//           lineHeight: 1.5,
//           letterSpacing: 0.5,
//           padding: { top: 16, bottom: 16 },
//           minimap: {
//             enabled: false
//           },
//           scrollbar: {
//             useShadows: false,
//             verticalScrollbarSize: 8,
//             horizontalScrollbarSize: 8
//           },
//           smoothScrolling: true,
//           cursorBlinking: 'smooth',
//           cursorSmoothCaretAnimation: true,
//           renderLineHighlight: 'all',
//           roundedSelection: true,
//           wordWrap: 'on',
//           wordWrapColumn: 100,
//           formatOnPaste: true,
//           formatOnType: true,
//           autoClosingBrackets: 'always',
//           autoClosingQuotes: 'always',
//           links: true,
//           mouseWheelZoom: true,
//           suggest: {
//             insertMode: 'replace',
//             snippetsPreventQuickSuggestions: false,
//             showWords: false,
//             localityBonus: true,
//             shareSuggestSelections: true,
//             previewMode: 'prefix',
//             filterGraceful: true,
//             showIcons: true,
//           },
//           bracketPairColorization: {
//             enabled: true,
//           }
//         }}
//       />
//       {suggestionVisible && currentSuggestion && (
//         <div className="suggestion-tooltip" style={{
//           position: 'absolute',
//           bottom: '8px',
//           right: '8px',
//           background: '#1f2937',
//           color: '#93c5fd',
//           padding: '4px 8px',
//           borderRadius: '4px',
//           fontSize: '12px',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
//           zIndex: 1000,
//           pointerEvents: 'none',
//           opacity: 0.9,
//           maxWidth: '300px',
//           whiteSpace: 'nowrap',
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//         }}>
//           Press Ctrl+→ to accept: {currentSuggestion.split(/\s+/)[0]}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MonacoIDE;









