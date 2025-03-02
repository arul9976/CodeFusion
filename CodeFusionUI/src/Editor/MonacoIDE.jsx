

import React, { useContext, useEffect, useRef, useState } from 'react';
import { MonacoBinding } from 'y-monaco';
import Editor from '@monaco-editor/react';

import { ClientContext } from './ClientContext';
import { getFileMode } from '../utils/GetIcon';
import { getFileContent } from '../utils/Fetch';
import { setCode, setLang } from '../Redux/editorSlice';
import { registerCompletion } from 'monacopilot';
import { debounce } from 'lodash';
import axios from 'axios';
const MonacoIDE = ({ activeFile }) => {

  const { initAndGetProvider, getYtext, editorsRef, bindings, dispatch, language } = useContext(ClientContext);

  const editorRef = useRef(null);
  const currFile = useRef(null);
  const monacoRef = useRef(null);


  const initiateFile = (file) => {
    currFile.current = file;
    console.log(file);

    if (!editorRef.current) {
      console.log("Editor is not available");
      return;

    }

    editorsRef.current.get(file.id);

    // const provider = initAndGetProvider(file.url);

    console.log("Commit");
    const model = editorRef.current.getModel();

    getFileContent(file.url).then((res) => {
      console.log(res);
      model.setValue(res);

    })

    // provider.on("sync", (isSynced) => {

    //   const model = editorRef.current.getModel();

    //   console.log("synced Initialized");

    //   if (isSynced) {
    //     console.log("synced");

    //   }
    //   console.log("Synced with server:", isSynced);
    // });
  }

  function handleEditorDidMount(editor, monaco, file) {
    console.log("Current Language " + getFileMode(activeFile.name));

    registerCompletion(monaco, editor, {
      language: getFileMode(activeFile.name),
      endpoint: `${import.meta.env.VITE_RUNNER_URL}/code-completion`,
    });

    console.log(file);
    currFile.current = file;
    if (!file) return;
    monacoRef.current = monaco;
    editorRef.current = editor;
    editorsRef.current.set(file.id, editor);
    initiateFile(file);

    // getFileContent(file.url).then((res) => {
    //   // yText.insert(0, res);
    // editorRef.current.getModel().setValue(res);
    // })
  }

  const handleChange = (value) => {
    console.log(value);
    dispatch(setCode(value));
  }



  useEffect(() => {
    console.log("Runned");

    const lan = getFileMode(activeFile.name);
    dispatch(setLang(lan))
    console.log(language);

    if (editorRef.current && currFile.current.id !== activeFile.id) {
      console.log(activeFile);

      monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), lan)
      // initiateFile(activeFile);
      console.log("Initiated");

    }
  })

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
        { token: 'interface', foreground: '93c5fd', fontStyle: 'bold' }
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
        'editorBracketMatch.background': '#3b4252'
      }
    });


    // Authorization: `Bearer ${'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'}`,



    // const debouncedFetch = debounce(async (text, callback) => {
    //   try {
    //     const response = await axios.post(
    //       "https://api-inference.huggingface.co/models/bigcode/starcoder",
    //       {
    //         inputs: text,
    //         parameters: { max_new_tokens: 50, return_full_text: false },
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${'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'}`,
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     const suggestion = response.data[0].generated_text.trim();
    //     callback({ suggestion });
    //   } catch (error) {
    //     // console.error("Hugging Face API error:", error);
    //     callback({ suggestion: "" });
    //   }
    // }, 150); // 150ms debounce for Tabnine-like speed

    // monaco.languages.registerCompletionItemProvider("javascript", {
    //   triggerCharacters: [".", " ", "(", "\n"], // Add newline for multi-line
    //   provideCompletionItems: (model, position) => {
    //     const textUntilPosition = model.getValueInRange({
    //       startLineNumber: Math.max(1, position.lineNumber - 5), // 5 lines of context
    //       startColumn: 1,
    //       endLineNumber: position.lineNumber,
    //       endColumn: position.column,
    //     });
    //     console.log("Input: ", textUntilPosition);

    //     return new Promise((resolve) => {
    //       debouncedFetch(textUntilPosition, (data) => {
    //         const suggestionText = data.suggestion || "";
    //         const suggestions = suggestionText
    //           ? [
    //             {
    //               label: suggestionText,
    //               kind: monaco.languages.CompletionItemKind.Snippet,
    //               insertText: suggestionText,
    //               detail: "Suggested by StarCoder (Tabnine-like)",
    //               range: {
    //                 startLineNumber: position.lineNumber,
    //                 startColumn: position.column,
    //                 endLineNumber: position.lineNumber,
    //                 endColumn: position.column,
    //               }, // Replace at cursor
    //             },
    //           ]
    //           : [];

    //         console.log("Suggestion: ", suggestionText);
    //         resolve({ suggestions });
    //       });
    //     });
    //   },
    // });
  };

  return (

    <div style={{
      height: '100%',
      width: '100%',
    }}>
      <Editor
        heigh={"100%"}
        width={"100%"}
        defaultLanguage={getFileMode(activeFile.name)}
        theme="modernDark"
        beforeMount={beforeMount}
        onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, activeFile)}
        onChange={handleChange}
        options={{
          suggestOnTriggerCharacters: true,
          quickSuggestions: { other: true, comments: true, strings: true },
          acceptSuggestionOnCommitCharacter: true, 
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on", 
          wordBasedSuggestions: false,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
          fontLigatures: true,
          lineHeight: 1.5,
          letterSpacing: 0.5,
          padding: { top: 16, bottom: 16 },
          minimap: {
            enabled: false
          },
          scrollbar: {
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8
          },
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
          bracketPairColorization: {
            enabled: true,
          }
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









