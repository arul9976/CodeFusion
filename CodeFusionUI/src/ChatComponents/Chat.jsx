// import React, { useState } from "react";
// import chat from "./Chat.module.css";
// import { FaArrowUp } from "react-icons/fa"; 

// const Chat = () => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [selectedOption, setSelectedOption] = useState("Users");


//     const handleOptionClick = (option) => {
//         setSelectedOption(option);
//         setIsDropdownOpen(false);
//     };

//     const line = "linear-gradient(135deg, #63A29D,#375F6C)";



//     return (
//         <div className={chat.bodyContainer}>
//             <div className={chat.sideContainer}>
//                 <div className={chat.chatHeader}>
//                     {/* User Button with Dropdown */}
//                     <div className={chat.dropdown}>
//                         <button
//                             className={chat.userBtn}
//                             style={{ background: line }}
//                             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                         >
//                             {selectedOption} {/* Display selected option */}
//                         </button>
//                         {isDropdownOpen && (
//                             <div className={chat.dropdownMenu}>
//                                 <p onClick={() => handleOptionClick("Manimekala")}>Manimekala</p>
//                                 <p onClick={() => handleOptionClick("Pravin")}>Pravin</p>
//                                 <p onClick={() => handleOptionClick("Arul Kumar")}>Arul Kumar</p>
//                             </div>
//                         )}
//                     </div>
//                     {/* Bot Button (Normal) */}
//                     <button className={chat.botBtn} style={{ background: line }}>ChatBot</button>
//                 </div>
//                 <div className={chat.textBox} ></div>
//                 {/* Chat Area */}
//                 {/* <div className={chat.chatBox}>
//                     <input
//                         className={chat.styleMessage}
//                         type="text"
//                         placeholder="Message here"
//                     />
//                     <button className={chat.sendBtn}>
//                         <FaPaperPlane />
//                     </button>
//                 </div> */}

//                 <div className={chat.inputContainer}>
//                     <input
//                         className={chat.styleMessage}
//                         type="text"
//                         placeholder="Message here"
//                     />
//                     <button className={chat.sendBtn}>
//                     <FaArrowUp className={chat.sendIcon} />

//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Chat;

import { useState } from "react"
import { FaArrowUp, FaChevronDown } from "react-icons/fa"
import "./Chat.css"

const Chat = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState("Users")
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsDropdownOpen(false)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: selectedOption }])
      setInputMessage("")
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-window">
        {/* Header Section */}
        <div className="chat-header">
          <div className="dropdown-container">
            <button className="user-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {selectedOption}
              <FaChevronDown className={`chevron ${isDropdownOpen ? "rotate" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {["Manimekala", "Pravin", "ArulKumar"].map((name) => (
                  <div key={name} className="dropdown-item" onClick={() => handleOptionClick(name)}>
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="bot-button">ChatBot</button>
        </div>

        {/* Messages Section */}
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === selectedOption ? "sent" : "received"}`}>
              {message.text}
            </div>
          ))}
        </div>

        {/* Input Section */}
        <form className="input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Message here"
            className="message-input"
          />
          <button type="submit" className="send-button">
            <FaArrowUp />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat
