import React, { useEffect, useState } from 'react'

export const Output = ({ output }) => {

  const [out, setOut] = useState('');


  useEffect(() => {
    setOut(output)
  }, [output])

  return (
    <div className="panel">
      <b>Ouput panel</b>
      <p> {out} </p>
    </div>
  )
}
