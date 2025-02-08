import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { io } from 'socket.io-client';

function Term() {
  const termRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize socket connection to the backend
    socket.current = io('http://localhost:3000');

    // Initialize xterm.js terminal
    const term = new Terminal({
      cursorBlink: true,
      scrollback: 1000,
      rows: 20,
      cols: 80,
    });

    term.open(termRef.current);

    // Handle output from the Python process
    socket.current.on('output', (data) => {
      console.log(data);
      term.write(data);
    });

    // Store the input line to be sent to Python
    let inputLine = '';

    // Send input to Python on Enter press
    term.onKey((event) => {
      const char = event.key;

      // If user presses Enter (carriage return), send the input line to Python
      if (char === '\r') {
        // Emit the input line to the backend (Python process)
        socket.current.emit('input', inputLine);

        // Write a new line to simulate "Enter"
        term.write('\r\n');

        // Clear the current input line in the terminal
        inputLine = '';

      } else if (char === '\u0008') { // Handle backspace
        // If backspace is pressed, remove the last character from inputLine
        if (inputLine.length > 0) {
          inputLine = inputLine.slice(0, -1);
          term.write('\b \b'); // Properly erase the character by writing backspace
        }
      } else {
        // Append the typed character to the input line
        inputLine += char;
        term.write(char); // Display the typed character
      }
    });
    return () => {
      socket.current.disconnect();
      term.dispose();
    };
  }, []);

  return (
    <div className="App">
      <h1>Python Terminal with xterm.js</h1>
      <div ref={termRef} style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
}

export default Term;
