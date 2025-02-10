import React from "react";
import Editor from "@monaco-editor/react";

function EditorPage() {
  return (
    <div>
      <h2>Code Editor</h2>
      <Editor
        height="90vh"
        width="100%"
        defaultLanguage="python"
        theme="vs-dark"
      />
    </div>
  );
}

export default EditorPage;