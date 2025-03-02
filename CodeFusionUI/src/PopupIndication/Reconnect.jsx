import { useState, useEffect } from "react"
import { AlertCircle, X, Dot } from "lucide-react"
import "./Reconnect.css"

const Reconnect = ({ reconnecting, setIsReconnecting }) => {
  const [countdown, setCountdown] = useState(10)
  const [isVisible, setIsVisible] = useState(true)

  const handleReconnect = () => {
    setIsVisible(false)
    setIsReconnecting(false);
    reconnecting();
  }

  useEffect(() => {
    if (!isVisible) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
      
        if (prev <= 1) {
          setIsVisible(false)
          setIsReconnecting(false);
          reconnecting();
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isVisible])

  return (
    <div className={`reconnect-container ${isVisible ? "slide-in" : "slide-out"}`}>
      <div className="messages-content">
        <AlertCircle className="alert-icon" size={20} />
        <div className="message-text">
          <span>Sorry, we're having a temporary issue with the messaging server. Please hold on.<span className="style-Span" onClick={handleReconnect}>Try now</span></span>
          <span className="connecting-text">
            Connecting in {String(0).padStart(2, "0")}:{String(countdown).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}
export default Reconnect
