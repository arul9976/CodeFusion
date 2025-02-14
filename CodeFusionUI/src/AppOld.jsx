


{/* <div style={styles.container}>
  <div style={styles.controls}>
    <div>
      <label style={styles.label}>Language:</label>
      <select
        value={language}
        onChange={handleLanguageChange}
        style={styles.select}
      >
        {languageOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label style={styles.label}>Theme:</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        style={styles.select}
      >
        {themeOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>

  <AceEditor
    ref={editorRef}
    mode={languageOptions.find(l => l.value === language)?.mode}
    theme={theme}
    name="code-editor"
    value={code}
    width="1200px"
    height="400px"
    fontSize={14}
    onCursorChange={handleCursorChange}
    showPrintMargin={true}
    showGutter={true}
    highlightActiveLine={true}
    setOptions={{
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      showLineNumbers: true,
      tabSize: 2,
    }}
  />

  <button onClick={runCode} style={styles.button}>
    Run Code
  </button>

  <Term socket={socket} />

</div> */}