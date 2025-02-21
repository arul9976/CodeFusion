import { useContext, useEffect, useRef } from 'react';
import { useXTerm } from 'react-xtermjs';
import { FitAddon } from '@xterm/addon-fit';
import { ClientContext } from '../Editor/ClientContext';
import { UserContext } from '../LogInPage/UserProvider';

const Term = ({ terminalOutput, inputWantRef }) => {

  const { user } = useContext(UserContext);

  const { instance, ref } = useXTerm();
  const fitAddon = new FitAddon();
  const terminalDataRef = useRef('');
  const listenerRef = useRef(null);

  useEffect(() => {
    if (!instance) return;


    instance.loadAddon(fitAddon);
    const handleResize = () => fitAddon.fit();

    window.addEventListener('resize', handleResize);

    const handleData = (data) => {
      if (data === '\r') {
        const inputData = terminalDataRef.current.trim();
        if (inputData) {
          if (inputData === 'clear') {
            terminalDataRef.current = '';
            instance.reset();
            instance.write(` @${user.username}`);
            return;
          }
          if (inputWantRef.current) {
            terminalOutput.ws.send(JSON.stringify({
              "event": 'input',
              "data": inputData,
            }));
          }
          // if()
          console.log('Sending data to server:', inputData);
          terminalDataRef.current = '';
          instance.writeln('');

          return;

        }
        instance.writeln('');
        instance.write(` @${user.username}`);
      } else if (data === '\u007f') {
        console.log(terminalDataRef.current);
        if (terminalDataRef.current.length <= 0) return;
        terminalDataRef.current = terminalDataRef.current.slice(0, -1);
        instance.write('\b \b');
      } else {
        console.log(data);
        // console.log(user);

        terminalDataRef.current += data;
        instance.write(data);
        return;
      }

      instance.write(` @${user.username}`);

    };

    listenerRef.current = instance.onData(handleData);


    if (Object.keys(terminalOutput).length > 0) {
      // instance.writeln('');
      if (inputWantRef.current)
        instance.write(` @${user.username}`);

      console.log(inputWantRef);

      console.log(terminalOutput);

      terminalOutput.output.split('\n').forEach((o) => {
        instance.writeln(" " + o);
      });

      instance.write(` @${user.username}`);
      return;
    }




    return () => {
      window.removeEventListener('resize', handleResize);
      listenerRef.current?.dispose();
    };
  }, [instance, terminalOutput]);

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%', display: 'block', textAlign: 'start', padding: '0' }}
    />
  );
};

export default Term;