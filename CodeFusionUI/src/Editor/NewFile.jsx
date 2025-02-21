import React, { useEffect, useRef, useState } from "react";
const NewFile = ({ fileOnClick }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const selectedOptionRef = useRef(".html");

  const fileType = (event) => {
    selectedOptionRef.current = event.target.value;
  }

  const filename = (event) => {
    const value = event.target.value;
    setInputValue(value);
    const symbolRegex = /[^a-zA-Z0-9\s]/g;
    if (symbolRegex.test(value)) {
      setError(" Input shoudn't contain any special characters!");
    } else {
      setError("");
      setInputValue(value);
    }
  }



  const handleFinalName = () => {
    console.log(selectedOptionRef.current);
    
    if (inputValue != "" && error === "") {
      const resultantFileName = inputValue.split('.')[0] + selectedOptionRef.current;
      console.log(resultantFileName)
      fileOnClick(resultantFileName);
      return;
    }
    fileOnClick(null);
  }

  useEffect(() => {
    console.log("Running");

  }, [])


  return (
    <div style={{ pointerEvents: 'auto', display: 'block', position: 'absolute', height: '220px', width: '500px', top: '200px', left: '700px', border: '1px solid #37546D', backgroundColor: '#102C47', borderRadius: '10px', boxShadow: '5px 10px 30px rgba(0, 0, 0, 0.5)' }}>
      <h1 style={{ color: '#EFE9D5', padding: '8px', letterSpacing: '1px', fontSize: '1.2em', borderBottom: '1px solid #37546D', margin: '0px', backgroundColor: '#07243D', marginBottom: '20px', borderRadius: '10px 10px 0px 0px' }}>New File</h1>
      <div>

        <div style={{ margin: '20px' }}>
          <label htmlFor="username" style={{ paddingRight: '10px', fontSize: '1.1em', color: '#EFE9D5', letterSpacing: '1px' }}>Name</label>
          <input
            type="text"
            id="username"
            value={inputValue}
            onChange={filename}
            style={{
              padding: "5px",
              fontSize: "16px",
              border: "1px solid #37546D",
              borderRadius: "5px",
              outline: "none",
              width: "300px",
              backgroundColor: '#27445D',
              color: '#EFE9D5'
            }}
          />
        </div>

        <div style={{ margin: '20px' }}>
          <label htmlFor="type" style={{ paddingRight: '20px', fontSize: '1.1em', color: '#EFE9D5', letterSpacing: '1px' }}>Type</label>
          <select id="dropdown" value={selectedOptionRef.current} onChange={fileType}
            style={{
              padding: "5px",
              fontSize: "16px",
              border: "1px solid #37546D",
              borderRadius: "5px",
              outline: "none",
              width: "310px",
              backgroundColor: '#27445D',
              color: '#EFE9D5'
            }}>
            <option value=".html">.html</option>
            <option value=".css">.css</option>
            <option value=".js">.js</option>
            <option value=".java">.java</option>
            <option value=".py">.py</option>
            <option value=".ruby">.ruby</option>
            <option value=".go">.go</option>
            <option value=".jsx">.jsx</option>
          </select>
        </div>
        <div style={{ color: '#EFE9D5', padding: '5px 30px', width: '100px', border: "3px solid #37546D", borderRadius: '8px', position: 'absolute', top: '160px', left: '240px' }} onClick={handleFinalName}>Cancel</div>
        <div style={{ color: '#EFE9D5', padding: '5px 30px', width: '100px', border: "3px solid #37546D", borderRadius: '8px', position: 'absolute', top: '160px', left: '370px' }} onClick={handleFinalName}>Done</div>
      </div>
    </div>
  )
}

export default NewFile;