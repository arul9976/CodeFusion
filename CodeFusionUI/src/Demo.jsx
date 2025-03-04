import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const MonacoCollaborativeEditor = () => {
  const [editorValue, setEditorValue] = useState(
    `export default class GuestbookGrid extends Component {
  constructor(props) {
    super(props)
    this.state = { signatures }
  }
  
  render() {
    const cells = this.state.signatures.map((signature, index) => (
      <GuestbookGridCell key={index} {...signature} />
    ))
    return <div className="grid">{cells}</div>
  }
}`);

  const editorRef = useRef(null);
  const cursorLabelsRef = useRef({});
  const decorationsRef = useRef({});

  // Simulate other users' cursor movements
  const simulateUserCursors = (editor) => {
    const users = [
      { id: 'user1', name: 'arul', color: 'rgba(0, 150, 136, 0.8)', position: { lineNumber: 3, column: 10 } },
      // { id: 'user2', name: 'sarah', color: 'rgba(233, 30, 99, 0.8)', position: { lineNumber: 7, column: 15 } },
      // { id: 'user3', name: 'mike', color: 'rgba(63, 81, 181, 0.8)', position: { lineNumber: 10, column: 20 } }
    ];

    users.forEach(user => {
      createUserCursor(editor, user);

      // Simulate random cursor movements
      setInterval(() => {
        const lineCount = editor.getModel().getLineCount();
        const randomLine = Math.floor(Math.random() * lineCount) + 1;
        const lineContent = editor.getModel().getLineContent(randomLine);
        const randomColumn = Math.min(Math.floor(Math.random() * 30) + 1, lineContent.length + 1);

        updateUserCursor(editor, {
          ...user,
          position: { lineNumber: randomLine, column: randomColumn }
        });
      }, 2000 + Math.random() * 3000); 
    });
  };

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

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // setTimeout(() => {
    //   simulateUserCursors(editor);
    // }, 1000);

    const localUser = { id: 'local', name: 'you', color: 'rgba(255, 152, 0, 0.8)', position: { lineNumber: 1, column: 1 } };
    createUserCursor(editor, localUser);

    editor.onDidChangeCursorPosition((e) => {
      updateUserCursor(editor, {
        ...localUser,
        position: e.position
      });

      // In a real implementation, you would send this cursor position to the server
      // sendCursorPosition(e.position);
    });

    editor.onDidBlurEditorText(() => {
      if (cursorLabelsRef.current[localUser.id]) {
        cursorLabelsRef.current[localUser.id].style.display = 'none';
      }
    });

    editor.onDidFocusEditorText(() => {
      if (cursorLabelsRef.current[localUser.id]) {
        cursorLabelsRef.current[localUser.id].style.display = 'block';
      }
    });
  };

  useEffect(() => {
    // Cleanup function to remove all cursor elements when component unmounts
    return () => {
      Object.values(cursorLabelsRef.current).forEach(label => {
        if (label && label.parentNode) {
          label.parentNode.removeChild(label);
        }
      });
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-900">
      <Editor
        height="100vh"
        defaultLanguage="javascript"
        value={editorValue}
        onChange={setEditorValue}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible'
          }
        }}
      />
    </div>
  );
};

export default MonacoCollaborativeEditor;