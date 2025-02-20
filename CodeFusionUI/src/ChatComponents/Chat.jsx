import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";
import "./Chat.css";

const Chat = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Users");
  const [isBotActive, setIsBotActive] = useState(false); // State to control bot's status indicator visibility
  const [messages, setMessages] = useState({
    "Bot": [
      {
        text: "Hello! I'm your assistant. How can I help you today?",
        sender: "Bot",
        timestamp: new Date().toLocaleTimeString(),
        isBot: true,
      },
    ],
    "All": [],
  });
  
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [users, setUsers] = useState([]); // State to store users dynamically
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch the list of users from your backend (for now, using mock data)
    // Replace this with an actual API call to fetch users
    const fetchedUsers = ["Manimekala", "Pravin", "ArulKumar"]; // Example of dynamic users
    setUsers(fetchedUsers);
  }, []);

  const getBotResponse = (userMessage) => {
    const responses = [
      "I understand. Can you tell me more about that?",
      "That's interesting! How can I help you with that?",
      "I'm here to assist you. What would you like to know?",
      "Let me know if you need any specific information.",
      "I'm processing your request. Is there anything else you'd like to know?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    setIsBotActive(option === "Bot"); // Activate bot status indicator when "Bot" is selected
    setMessages({
      ...messages,
      "All": [],
    }); // Clear the "All" conversation when switching to a specific user/chatbot
  };


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const userMessage = {
        text: inputMessage,
        sender: selectedOption,
        timestamp: new Date().toLocaleTimeString(),
        isBot: false,
      };
  
      if (selectedOption === "All") {
        // Send message to all users except the bot
        setMessages((prev) => {
          const updatedMessages = { ...prev };
          Object.keys(prev).forEach((user) => {
            if (user !== "Bot") {
              updatedMessages[user] = prev[user] ? [...prev[user], userMessage] : [userMessage];
            }
          });
          return updatedMessages;
        });
      } else {
        // Normal behavior: send message to selected user
        setMessages((prev) => ({
          ...prev,
          [selectedOption]: prev[selectedOption] ? [...prev[selectedOption], userMessage] : [userMessage],
        }));
      }
  
      // Handle bot response if "Bot" is selected
      if (selectedOption === "Bot") {
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            text: getBotResponse(inputMessage),
            sender: "Bot",
            timestamp: new Date().toLocaleTimeString(),
            isBot: true,
          };
  
          setMessages((prev) => ({
            ...prev,
            "Bot": prev["Bot"] ? [...prev["Bot"], botMessage] : [botMessage],
          }));
          setIsTyping(false);
        }, 1500);
      }
  
      setInputMessage(""); // Clear input field
    }
  };



  return (
    <div className="chat-container">
      <div className="chat-window">
        {/* Header Section */}
        <div className="chat-header">
          <div className="header-left">
            <div className="dropdown-container">
              <button className="user-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="avatar">
                  {selectedOption === "Bot" ? <FaRobot /> : <FaUser />}
                </div>
                <span>{selectedOption}</span>
                <FaChevronDown className={`chevron ${isDropdownOpen ? "rotate" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {/* Render dynamically fetched users */}
                  {users.map((name) => (
                    <div key={name} className="dropdown-item" onClick={() => handleOptionClick(name)}>
                      {name}
                    </div>
                  ))}
                  <div
                    className="dropdown-item"
                    onClick={() => handleOptionClick("All")}
                  >
                    All
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleOptionClick("Bot")}
                  >
                    Bot
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bot Status */}
          {selectedOption === "Bot" && (
            <div className="bot-status">
              <div className="bot-avatar">
                <FaRobot />
              </div>
              <span>ChatBot</span>
              {/* Conditional rendering of status indicator */}
              {isBotActive && <div className="status-indicator"></div>}
            </div>
          )}
        </div>

        {/* Messages Section */}
        <div className="messages-container">
          {messages[selectedOption]?.map((message, index) => (
            <div key={index} className={`message-wrapper ${message.isBot ? "received" : "sent"}`}>
              <div className="avatar">
                {message.isBot ? <FaRobot /> : <FaUser />}
              </div>
              <div className="message-content">
                <div className="messageBot">{message.text}</div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-wrapper received">
              <div className="avatar bot-message-avatar">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="message typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
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
            <FaPaperPlane style={{ width: "20px", height: "20px" }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;



// import { useState, useEffect, useRef } from "react";
// import { FaChevronDown, FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";
// import "./Chat.css";

// const Chat = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("Users");
//   const [isBotActive, setIsBotActive] = useState(false);
//   const [messages, setMessages] = useState({
//     "Bot": [
//       {
//         text: "Hello! I'm your assistant. How can I help you today?",
//         sender: "Bot",
//         timestamp: new Date().toLocaleTimeString(),
//         isBot: true,
//       },
//     ],
//     "All": [],
//   });
  
//   const [inputMessage, setInputMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [users, setUsers] = useState([]);
//   const messagesEndRef = useRef(null);

//   // WebSocket reference
//   const socketRef = useRef(null);

//   // Scroll to bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     // Fetch the list of users from your backend (for now, using mock data)
//     const fetchedUsers = ["Manimekala", "Pravin", "ArulKumar"];
//     setUsers(fetchedUsers);

//     // Create WebSocket connection when component mounts
//     socketRef.current = new WebSocket("ws://localhost:8080/chat"); // WebSocket URL of your backend

//     socketRef.current.onopen = () => {
//       console.log("Connected to WebSocket server.");
//     };

//     socketRef.current.onmessage = (event) => {
//       const newMessage = JSON.parse(event.data);
//       // Update the messages state with the new message from the WebSocket
//       setMessages((prevMessages) => ({
//         ...prevMessages,
//         [newMessage.sender]: [...prevMessages[newMessage.sender], newMessage],
//       }));
//     };

//     socketRef.current.onclose = () => {
//       console.log("WebSocket connection closed.");
//     };

//     socketRef.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     // Clean up WebSocket connection on component unmount
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   const getBotResponse = (userMessage) => {
//     const responses = [
//       "I understand. Can you tell me more about that?",
//       "That's interesting! How can I help you with that?",
//       "I'm here to assist you. What would you like to know?",
//       "Let me know if you need any specific information.",
//       "I'm processing your request. Is there anything else you'd like to know?",
//     ];
//     return responses[Math.floor(Math.random() * responses.length)];
//   };

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//     setIsDropdownOpen(false);
//     setIsBotActive(option === "Bot");
//     setMessages({ ...messages, "All": [] });
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (inputMessage.trim()) {
//       const userMessage = {
//         text: inputMessage,
//         sender: selectedOption,
//         timestamp: new Date().toLocaleTimeString(),
//         isBot: false,
//       };

//       if (selectedOption === "All") {
//         // Send message to all users except the bot
//         Object.keys(messages).forEach((user) => {
//           if (user !== "Bot") {
//             setMessages((prev) => ({
//               ...prev,
//               [user]: [...prev[user], userMessage],
//             }));
//           }
//         });
//       } else {
//         // Send message to the selected user
//         setMessages((prev) => ({
//           ...prev,
//           [selectedOption]: [...prev[selectedOption], userMessage],
//         }));
//       }

//       // Send the message through WebSocket
//       if (socketRef.current) {
//         socketRef.current.send(JSON.stringify(userMessage));
//       }

//       // If the selected option is "Bot", simulate bot response
//       if (selectedOption === "Bot") {
//         setIsTyping(true);
//         setTimeout(() => {
//           const botMessage = {
//             text: getBotResponse(inputMessage),
//             sender: "Bot",
//             timestamp: new Date().toLocaleTimeString(),
//             isBot: true,
//           };
//           setMessages((prev) => ({
//             ...prev,
//             "Bot": [...prev["Bot"], botMessage],
//           }));
//           setIsTyping(false);
//         }, 1500);
//       }

//       // Clear the input message after sending
//       setInputMessage("");
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-window">
//         {/* Header Section */}
//         <div className="chat-header">
//           <div className="header-left">
//             <div className="dropdown-container">
//               <button
//                 className="user-button"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               >
//                 <div className="avatar">
//                   {selectedOption === "Bot" ? <FaRobot /> : <FaUser />}
//                 </div>
//                 <span>{selectedOption}</span>
//                 <FaChevronDown
//                   className={`chevron ${isDropdownOpen ? "rotate" : ""}`}
//                 />
//               </button>

//               {isDropdownOpen && (
//                 <div className="dropdown-menu">
//                   {users.map((name) => (
//                     <div
//                       key={name}
//                       className="dropdown-item"
//                       onClick={() => handleOptionClick(name)}
//                     >
//                       {name}
//                     </div>
//                   ))}
//                   <div
//                     className="dropdown-item"
//                     onClick={() => handleOptionClick("All")}
//                   >
//                     All
//                   </div>
//                   <div
//                     className="dropdown-item"
//                     onClick={() => handleOptionClick("Bot")}
//                   >
//                     Bot
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Bot Status */}
//           {selectedOption === "Bot" && (
//             <div className="bot-status">
//               <div className="bot-avatar">
//                 <FaRobot />
//               </div>
//               <span>ChatBot</span>
//               {isBotActive && <div className="status-indicator"></div>}
//             </div>
//           )}
//         </div>

//         {/* Messages Section */}
//         <div className="messages-container">
//           {messages[selectedOption]?.map((message, index) => (
//             <div
//               key={index}
//               className={`message-wrapper ${
//                 message.isBot ? "received" : "sent"
//               }`}
//             >
//               <div className="avatar">
//                 {message.isBot ? <FaRobot /> : <FaUser />}
//               </div>
//               <div className="message-content">
//                 <div className="messageBot">{message.text}</div>
//                 <div className="message-timestamp">{message.timestamp}</div>
//               </div>
//             </div>
//           ))}
//           {isTyping && (
//             <div className="message-wrapper received">
//               <div className="avatar bot-message-avatar">
//                 <FaRobot />
//               </div>
//               <div className="message-content">
//                 <div className="message typing-indicator">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Section */}
//         <form className="input-container" onSubmit={handleSendMessage}>
//           <input
//             type="text"
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             placeholder="Message here"
//             className="message-input"
//           />
//           <button type="submit" className="send-button">
//             <FaPaperPlane style={{ width: "20px", height: "20px" }} />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Chat;

// import { useState, useEffect, useRef } from "react";
// import { FaArrowUp, FaChevronDown, FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";
// import "./Chat.css";

// const Chat = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("Users");
//   const [isBotActive, setIsBotActive] = useState(false); // State to control bot's status indicator visibility
//   const [messages, setMessages] = useState({
//     "Bot": [
//       {
//         text: "Hello! I'm your assistant. How can I help you today?",
//         sender: "Bot",
//         timestamp: new Date().toLocaleTimeString(),
//         isBot: true,
//       },
//     ],
//     "Manimekala": [],
//     "Pravin": [],
//     "ArulKumar": [],
//     "All": [],
//   });
//   const [inputMessage, setInputMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const getBotResponse = (userMessage) => {
//     const responses = [
//       "I understand. Can you tell me more about that?",
//       "That's interesting! How can I help you with that?",
//       "I'm here to assist you. What would you like to know?",
//       "Let me know if you need any specific information.",
//       "I'm processing your request. Is there anything else you'd like to know?",
//     ];
//     return responses[Math.floor(Math.random() * responses.length)];
//   };

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//     setIsDropdownOpen(false);
//     setIsBotActive(option === "Bot"); // Activate bot status indicator when "Bot" is selected
//     setMessages({
//       ...messages,
//       "All": [],
//     }); // Clear the "All" conversation when switching to a specific user/chatbot
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (inputMessage.trim()) {
//       // Add user message to the selected option's chat container
//       const userMessage = {
//         text: inputMessage,
//         sender: selectedOption,
//         timestamp: new Date().toLocaleTimeString(),
//         isBot: false,
//       };
   


//       if (selectedOption === "All") {
//         // Send message to all users except the bot
//         Object.keys(messages).forEach((user) => {
//           if (user !== "Bot") {
//             setMessages((prev) => ({
//               ...prev,
//               [user]: [...prev[user], userMessage],
//             }));
//           }
//         });
//       } else {
//         // Normal behavior: send message to selected user
//         setMessages((prev) => ({
//           ...prev,
//           [selectedOption]: [...prev[selectedOption], userMessage],
//         }));
//       }
  
//       // If the selected option is "Bot", simulate bot response
//       if (selectedOption === "Bot") {
//         setIsTyping(true);
//         setTimeout(() => {
//           const botMessage = {
//             text: getBotResponse(inputMessage),
//             sender: "Bot",
//             timestamp: new Date().toLocaleTimeString(),
//             isBot: true,
//           };
//           setMessages((prev) => ({
//             ...prev,
//             "Bot": [...prev["Bot"], botMessage],
//           }));
//           setIsTyping(false);
//         }, 1500);
//       }
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-window">
//         {/* Header Section */}
//         <div className="chat-header">
//           <div className="header-left">
//             <div className="dropdown-container">
//               <button className="user-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
//                 <div className="avatar">
//                   {selectedOption === "Bot" ? <FaRobot /> : <FaUser />}
//                 </div>
//                 <span>{selectedOption}</span>
//                 <FaChevronDown className={`chevron ${isDropdownOpen ? "rotate" : ""}`} />
//               </button>

//               {isDropdownOpen && (
//                 <div className="dropdown-menu">
//                   {["Manimekala", "Pravin", "ArulKumar", "All", "Bot"].map((name) => (
//                     <div key={name} className="dropdown-item" onClick={() => handleOptionClick(name)}>
//                       {name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Bot Status */}
//           {selectedOption === "Bot" && (
//             <div className="bot-status">
//               <div className="bot-avatar">
//                 <FaRobot />
//               </div>
//               <span>ChatBot</span>
//               {/* Conditional rendering of status indicator */}
//               {isBotActive && <div className="status-indicator"></div>}
//             </div>
//           )}
//         </div>

//         {/* Messages Section */}
//         <div className="messages-container">
//           {messages[selectedOption]?.map((message, index) => (
//             <div key={index} className={`message-wrapper ${message.isBot ? "received" : "sent"}`}>
//               <div className="avatar">
//                 {message.isBot ? <FaRobot /> : <FaUser />}
//               </div>
//               <div className="message-content">
//                 <div className="messageBot">{message.text}</div>
//                 <div className="message-timestamp">{message.timestamp}</div>
//               </div>
//             </div>
//           ))}
//           {isTyping && (
//             <div className="message-wrapper received">
//               <div className="avatar bot-message-avatar">
//                 <FaRobot />
//               </div>
//               <div className="message-content">
//                 <div className="message typing-indicator">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Section */}
//         <form className="input-container" onSubmit={handleSendMessage}>
//           <input
//             type="text"
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             placeholder="Message here"
//             className="message-input"
//           />
//           <button type="submit" className="send-button">
//             <FaPaperPlane style={{ width: "20px", height: "20px" }} />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Chat;



