import { useEffect, useRef } from 'react'
import { useXTerm } from 'react-xtermjs'
import { FitAddon } from '@xterm/addon-fit'

const Term = ({ socket }) => {
  const { instance, ref } = useXTerm()
  const fitAddon = new FitAddon()
  const terminalDataRef = useRef('') // Use ref to track terminal input data

  useEffect(() => {
    instance?.loadAddon(fitAddon)
    const handleResize = () => fitAddon.fit()

    instance?.writeln('Type something and press Enter to send.')

    window.addEventListener('resize', handleResize)
    instance?.write('$ ')

    const handleData = (data) => {

      if (data === '\r') {
        const inputData = terminalDataRef.current.trim()
        if (inputData) {
          if (inputData == "clear") {
            terminalDataRef.current = '';
            instance.reset();
            instance?.writeln('Type something and press Enter to send.')
            instance?.write('$ ')
            return;
          }
          console.log("Sending data to server:", inputData)
          socket.emit('input', inputData)
          terminalDataRef.current = '';
        }
        instance?.writeln("")
        instance?.write('$ ')

      } else if (data === '\u007f') {
        terminalDataRef.current = terminalDataRef.current.slice(0, -1)
        instance?.write('\b \b')
      } else {
        terminalDataRef.current += data
        instance?.write(data)
      }
    }

    instance?.onData(handleData)

    socket.on('output', (data) => {
      let lines = data.split("\n").filter(v => v.length > 0);
      console.log(lines);


      lines.forEach(v => {
        console.log(v);        
        instance?.writeln(v);
      })
      // if (data && socket) {
      //   socket.off('output');
      // }

      instance?.write('$ ')
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      instance?.offData(handleData)
    }
  }, [instance])

  return <div ref={ref} style={{ maxWidth: '1200px', width: '100%', height: '100%', display: 'block', textAlign: 'start' }} />
}

export default Term
