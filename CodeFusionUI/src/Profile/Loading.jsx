

import { useEffect, useState } from "react"
import "./Loading.css"

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing")

  useEffect(() => {
    const texts = ["Initializing", "Loading Modules", "Starting IDE", "Almost Ready"]
    let currentIndex = 0

    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length
      setLoadingText(texts[currentIndex])
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          clearInterval(textInterval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [])

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="logo-container">
          <div className="logo-circle">
            <div className="logo-inner"></div>
          </div>
          <div className="logo-squares">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="square" style={{ "--delay": `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>

        <div className="loading-text">{loadingText}</div>

        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-percentage">{progress}%</div>
        </div>

        <div className="loading-indicators">
          <div className="pulse-container">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="pulse" style={{ "--delay": `${i * 0.15}s` }}></div>
            ))}
          </div>
          <div className="code-lines">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="code-line"
                style={{ "--width": `${70 - i * 20}%`, "--delay": `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen