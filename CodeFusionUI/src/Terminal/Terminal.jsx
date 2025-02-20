import { useContext, useEffect, useRef } from 'react'
import { useXTerm } from 'react-xtermjs'
import { FitAddon } from '@xterm/addon-fit'
import { ClientContext } from '../Editor/ClientContext'

const Term = () => {
  const socket = useContext(ClientContext);


  const { instance, ref } = useXTerm()
  const fitAddon = new FitAddon()
  const terminalDataRef = useRef('') // Use ref to track terminal input data

  useEffect(() => {
    instance?.loadAddon(fitAddon)
    const handleResize = () => fitAddon.fit()

    // instance?.setOption('theme', {
    //   background: '#000000', // Set background to black
    //   foreground: '#FFFFFF', // Set foreground (text) to white
    // });

    window.addEventListener('resize', handleResize)
    instance?.write(' @arul > ')


    const handleData = (data) => {

      if (data === '\r') {
        const inputData = terminalDataRef.current.trim()
        if (inputData) {
          if (inputData == "clear") {
            terminalDataRef.current = '';
            instance.reset();
            instance?.write(' @arul > ')

            return;
          }

          console.log("Sending data to server:", inputData)
          socket.current?.emit('input', inputData)
          terminalDataRef.current = '';

        }
        instance?.writeln("")
        instance?.write(' @arul > ')

      } else if (data === '\u007f') {
        terminalDataRef.current = terminalDataRef.current.slice(0, -1)
        instance?.write('\b \b')
      } else {
        terminalDataRef.current += data
        instance?.write(data)
      }
    }

    instance?.onData(handleData)

    socket.current?.on('output', (data) => {
      let lines = data.split("\n").filter(v => v.length > 0);
      console.log(lines);


      lines.forEach(v => {
        console.log(v);
        instance?.writeln(v);
      })

      instance?.write(' @arul > ')

    })

    return () => {
      window.removeEventListener('resize', handleResize)
      instance?.offData(handleData)
    }
  }, [instance])

  return <div ref={ref} style={{ width: '100%', height: '100%', display: 'block', textAlign: 'start', padding: '0' }} />
}

export default Term
