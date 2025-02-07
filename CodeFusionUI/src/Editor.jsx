import React, { useState, useEffect, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

const Editor = () => {
  const [code, setCode] = useState(`def greet():
    print("Hello, World!")`);

  const [diagnostics, setDiagnostics] = useState([]);

  const editorOptions = {
    selectOnLineNumbers: true,
    minimap: { enabled: false },
    automaticLayout: true,
  };

  // Handle code changes in the editor
  const onEditorChange = useCallback((newValue, e) => {
    setCode(newValue);
  }, []);

  // Initialize Monaco and add Python-specific functionality
  const onEditorMount = useCallback((editor, monacoInstance) => {
    // Register a custom completion item provider for Python
    monacoInstance.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: () => {
        return {
          suggestions: [
            {
              label: 'print',
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertText: 'print()',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Inserts a print statement.',
            },
            {
              label: 'def',
              kind: monacoInstance.languages.CompletionItemKind.Keyword,
              insertText: 'def ${1:function_name}():\n\t${0}',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Inserts a function definition.',
            },
          ],
        };
      },
    });

    // Simulate Python diagnostics (errors/warnings)
    const validateCode = () => {
      // For demonstration purposes, we simulate an error if the code contains 'greet'
      const markers = code.includes('greet') ? [
        {
          severity: monacoInstance.Severity.Error,
          message: 'Syntax error: greet is not defined',
          startLineNumber: 1,
          startColumn: 0,
          endLineNumber: 1,
          endColumn: 5,
        },
      ] : [];

      setDiagnostics(markers);
    };

    editor.getModel().onDidChangeContent(validateCode);
    validateCode(); // Initial validation
  }, [code]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      monaco.editor.getModels().forEach((model) => {
        monaco.editor.setModelMarkers(model, 'owner', diagnostics);
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [diagnostics, code]);

  return (
    <div>
      <MonacoEditor
        height="100dvh"
        width={"1200px"}
        language="python"
        theme="vs-dark"
        value={code}
        options={editorOptions}
        onChange={onEditorChange}
        editorDidMount={onEditorMount}
      />
      <div>
        <h3>Diagnostics</h3>
        {diagnostics.length > 0 ? (
          <ul>
            {diagnostics.map((diag, index) => (
              <li key={index} style={{ color: diag.severity === 1 ? 'red' : 'orange' }}>
                {`${diag.message} at line ${diag.startLineNumber}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No issues detected</p>
        )}
      </div>
    </div>
  );
};

export default Editor;
