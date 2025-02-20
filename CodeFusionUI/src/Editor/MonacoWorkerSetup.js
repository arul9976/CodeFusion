import * as monaco from 'monaco-editor';

if (typeof window !== 'undefined') {
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === 'javascript' || label === 'typescript') {
        return 'https://unpkg.com/monaco-editor@latest/min/vs/language/typescript/ts.worker.js';
      }
      return 'https://unpkg.com/monaco-editor@latest/min/vs/editor/editor.worker.js';
    }
  };
}
