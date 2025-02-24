// import { useContext, useEffect, useRef } from 'react';
// import { useXTerm } from 'react-xtermjs';
// import { FitAddon } from '@xterm/addon-fit';
// import { ClientContext } from '../Editor/ClientContext';
// import { UserContext } from '../LogInPage/UserProvider';

// const Term = ({ terminalOutput }) => {

//   const { user } = useContext(UserContext);

//   const { instance, ref } = useXTerm();
//   const fitAddon = new FitAddon();
//   const terminalDataRef = useRef('');
//   const listenerRef = useRef(null);

//   useEffect(() => {
//     if (!instance) return;


//     instance.loadAddon(fitAddon);
//     const handleResize = () => fitAddon.fit();

//     window.addEventListener('resize', handleResize);

//     const handleData = (data) => {
//       if (data === '\r') {
//         const inputData = terminalDataRef.current.trim();
//         if (inputData) {
//           if (inputData === 'clear') {
//             terminalDataRef.current = '';
//             instance.reset();
//             instance.write(` @${user.username}> `);
//             return;
//           }
//           if (terminalOutput.input) {
//             terminalOutput.ws.send(JSON.stringify({
//               "event": 'input',
//               "data": inputData,
//             }));
//           }

//           console.log('Sending data to server:', inputData);
//           terminalDataRef.current = '';
//           instance.writeln('');

//           return;

//         }
//         instance.writeln('');
//         instance.write(` @${user.username}> `);
//       } else if (data === '\u007f') {
//         console.log(terminalDataRef.current);
//         if (terminalDataRef.current.length <= 0) return;
//         terminalDataRef.current = terminalDataRef.current.slice(0, -1);
//         instance.write('\b \b');
//         return;

//       } else {
//         console.log(data);
//         terminalDataRef.current += data;
//         instance.write(data);
//         return;
//       }

//       instance.write(` @${user.username}`);
//       return;

//     };

//     listenerRef.current = instance.onData(handleData);


//     return () => {
//       window.removeEventListener('resize', handleResize);
//       listenerRef.current?.dispose();
//     };
//   }, [instance]);

//   useEffect(() => {


//     if (Object.keys(terminalOutput).length > 0) {
//       if (terminalOutput.input) {
//         terminalDataRef.current = '';
//         instance.reset();

//       }
//       // instance.writeln('');
//       // if (inputWantRef.current) {
//       //   terminalDataRef.current = '';
//       //   instance.reset();
//       // }
//       console.log(terminalOutput);

//       instance.writeln(`@${user.username} >  ${terminalOutput.output}`);
//       // instance.write(` @${user.username}> `);
//       // return;
//     }

//     return () => {
//       if (Object.keys(terminalOutput).length > 0 && !terminalOutput.input) {
//         instance.writeln(`@${user.username} >  `);

//       }
//     }

//   }, [terminalOutput])

//   return (
//     <div
//       ref={ref}
//       style={{ width: '100%', height: '100%', display: 'block', textAlign: 'start', padding: '0' }}
//     />
//   );
// };

// export default Term;

import React, { useState, useEffect, useContext, useRef } from 'react';
import { ReactTerminal } from 'react-terminal';
import { UserContext } from '../LogInPage/UserProvider';

const Term = ({ terminalOutput }) => {
  const { user } = useContext(UserContext) || { username: 'guest' };
  const outputHistoryRef = useRef([]);
  const [waitingForInput, setWaitingForInput] = useState(false);

  useEffect(() => {
    if (!terminalOutput || Object.keys(terminalOutput).length === 0) return;

    const prompt = `@${user?.username || 'guest'}> `;
    const outputLine = `${prompt}${terminalOutput.output || ''}`;
    if (terminalOutput.input) {
      setWaitingForInput(true);
      outputHistoryRef.current = [...outputHistoryRef.current, outputLine];
    } else {
      setWaitingForInput(false);
      outputHistoryRef.current = [...outputHistoryRef.current, outputLine];
    }
  }, [terminalOutput, user]);

  const commands = {
    run: () => {
      handleRunClick();
      return '';
    },
    clear: () => {
      outputHistoryRef.current = [''];
      console.log(outputHistoryRef.current);
      
      setWaitingForInput(false);
      return 'Terminal cleared.';
    },
  };

  const defaultHandler = (input) => {
    const prompt = `@${user?.username || 'guest'}> `;
    if (waitingForInput && terminalOutput?.ws?.readyState === WebSocket.OPEN) {
      terminalOutput.ws.send(JSON.stringify({
        event: 'input',
        data: input,
      }));
      outputHistoryRef.current = [...outputHistoryRef.current, `${prompt}${input}`];

      // setOutputHistory((prev) => [...prev, `${prompt}${input}`]);
      setWaitingForInput(false);
      return '';
    }
    return 'Command not found. Click "Run Server Process" or type "run".';
  };

  const prompt = `\n@${user?.username || 'guest'}> `;
  const welcomeMessageRef = useRef('');

  // useEffect(() => {


  // }, [outputHistoryRef])
  return (
    <div style={{ padding: '10px', background: '#272B36', height: '100%' }}>
      {/* <button
        onClick={handleRunClick}
        style={{
          marginBottom: '10px',
          padding: '5px 10px',
          background: '#DBDBDB',
          border: 'none',
          cursor: 'pointer',
          color: '#272B36',
          fontWeight: 'bold',
        }}
      >
        Run Server Process
      </button> */}
      <div style={{ height: '100%' }}>
        <ReactTerminal
          commands={commands}
          themes={{
            "my-custom-theme": {
              themeBGColor: '#272B36',
              themeToolbarColor: '#DBDBDB',
              themeColor: '#FFFEFC',
              themePromptColor: '#a917a8',
            }
          }}
          theme="my-custom-theme"
          prompt={prompt}
          welcomeMessage={outputHistoryRef.current.join('\n')}
          defaultHandler={defaultHandler}
        />
      </div>
    </div>
  );
};

export default Term;