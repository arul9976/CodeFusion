import { useState, useEffect, useRef, useContext } from "react";
import { FaChevronDown, FaUser, FaRobot, FaPaperPlane, FaCopy, FaDownload, FaExpand, FaCompress } from "react-icons/fa";
import { ChevronDown, User, Bot, Send, Copy, Download, Clock, X } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Square } from "lucide-react";

import './Chat.css'
import { fetchCollaborators } from "../utils/Fetch";
import { useParams } from "react-router-dom";
import { UserContext } from "../LogInPage/UserProvider";
import { useWebSocket } from "../Websocket/WebSocketProvider";
import { setChatMessages, setMsgSeened } from "../Redux/editorSlice";
import { useSelector } from "react-redux";


const Chat = ({ isChatOpen, setIsChatOpen }) => {

  const { ownername, workspace } = useParams();
  const { user, dispatchUser } = useContext(UserContext);
  const [copied, setCopied] = useState(false);

  const chatMessages = useSelector(state => state.editor.chatMessages);

  const { socket } = useWebSocket();

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");
  const [isBotActive, setIsBotActive] = useState(false);

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
  const [users, setUsers] = useState([]);
  const websocket = useRef(null);
  const messagesEndRef = useRef(null);

  const [copiedIndex, setCopiedIndex] = useState(null);
  const codeRefs = useRef([]);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // console.log(chatMessages);

    scrollToBottom();
  }, [messages, chatMessages]);

  useEffect(() => {
    if (isChatOpen) {
      fetchCollaborators(workspace, ownername + "@gmail.com")
        .then(data => {
          console.log(data);
          const filtered = data.filter(u => u.username !== user.username);
          setUsers(user.username !== ownername ? [{ username: ownername }, ...filtered] : filtered);
        })
        .catch((err) => {
          console.log("Error fetching contributors " + err.message);
        })
    }
    //  else {
    //   const fetchedUsers = ["Manimekala", "Pravin", "ArulKumar"];
    //   setUsers(fetchedUsers);
    // }
  }, [isChatOpen]);

  // const getBotResponse = (userMessage) => {
  //   const responses = [
  //     "I understand. Can you tell me more about that?",
  //     "That's interesting! How can I help you with that?",
  //     "I'm here to assist you. What would you like to know?",
  //     "Let me know if you need any specific information.",
  //     "I'm processing your request. Is there anything else you'd like to know?",
  //   ];
  //   return responses[Math.floor(Math.random() * responses.length)];
  // };

  const getBotResponse = (userMessage) => {
    let response = "I'm sorry, I don't understand. Can you please rephrase?";

    if (userMessage.toLowerCase().includes("java")) {
      // response = `Here's a Java code snippet:\n\`\`\`java\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n\`\`\``;
      response = `Here's a JavaScript code snippet:\n\`\`\`javascript\nconsole.log("Hello, World!");\n\`\`\``;
    } else if (userMessage.toLowerCase().includes("help")) {
      response = "I'm here to help! What specific topic do you need assistance with?";
    }

    return {
      text: String(response),
      sender: "Bot",
      timestamp: new Date().toLocaleTimeString(),
      isBot: true,
    };
  };
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    setIsBotActive(option === "Bot");
    setMessages({
      ...messages,
      "All": [],
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const userMessage = {
        text: inputMessage,
        sender: user.username,
        receiver: selectedOption,
        timestamp: new Date().toLocaleTimeString(),
        isBot: false,
        roomId: (ownername + "$" + workspace),
        seen: false
      };

      console.log(socket, selectedOption);

      if (socket) {
        console.log("Client Send Message to ");

        socket.send(JSON.stringify({
          event: "chat",
          message: userMessage,
        }));
      }

      // if (selectedOption === "All") {

      dispatchUser(setChatMessages({ selectedOption, userMessage }));

      // setMessages((prev) => {
      //   const updatedMessages = { ...prev };
      //   Object.keys(prev).forEach((user) => {
      //     if (user !== "Bot") {
      //       updatedMessages[user] = prev[user] ? [...prev[user], userMessage] : [userMessage];
      //     }
      //   });
      //   return updatedMessages;
      // });
      // } else {

      // setMessages((prev) => ({
      //   ...prev,
      //   [selectedOption]: prev[selectedOption] ? [...prev[selectedOption], userMessage] : [userMessage],
      // }));
      // }

      // if (selectedOption === "Bot") {
      //   setIsTyping(true);
      //   setTimeout(() => {
      //     const botMessage = {
      //       text: getBotResponse(inputMessage),
      //       sender: "Bot",
      //       timestamp: new Date().toLocaleTimeString(),
      //       isBot: true,
      //     };

      //     setMessages((prev) => ({
      //       ...prev,
      //       "Bot": prev["Bot"] ? [...prev["Bot"], botMessage] : [botMessage],
      //     }));
      //     setIsTyping(false);
      //   }, 1500);
      // }

      setInputMessage("");
    }
  };

  // useEffect(() => {
  //   if (socket) {
  //     socket.onmessage = (event) => {
  //       console.log(event, typeof event.data);

  //       if (typeof event.data === 'string') {
  //         const res = JSON.parse(event.data);
  //         if (res.event === 'chat') {
  //           console.log(res);
  //           if (res.message.receiver === 'All') {
  //             console.log("Last  " + messages.All);

  //             if (messages.All.at(-1) && messages.All.at(-1)?.timestamp === res.message.timestamp) {
  //               return;
  //             }
  //             setMessages((prev) => ({
  //               ...prev,
  //               "All": prev["All"] ? [...prev["All"], res.message] : [res.message],
  //             }));
  //           } else {
  //             if (messages[res.message.receiver].at(-1) && messages[res.message.receiver].at(-1)?.timestamp === res.message.timestamp) {
  //               return;
  //             }
  //             setMessages((prev) => ({
  //               ...prev,
  //               [res.message.receiver]: prev[res.message.receiver] ? [...prev[res.message.receiver], res.message] : [res.message],
  //             }));
  //           }
  //         }
  //       }
  //     }
  //   }
  // }, [socket])


  return (
    <div className={`chat-container ${selectedOption === "Bot" ? "expanded" : ""} ${isFullScreen ? "full-screen" : ""}`}>
      <div className="chat-window">
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
                  {users.map((uinfo, idx) => {
                    const userMsg = chatMessages[uinfo.username];
                    let count = 0;
                    if (userMsg) {
                      for (let i = 0; i < userMsg.length; i++) {
                        if (!userMsg[i].seen && userMsg[i].sender !== user.username) {
                          count++;
                        }
                      }

                    }

                    return (
                      <div key={idx} className="dropdown-item" onClick={() => handleOptionClick(uinfo.username)}>
                        <User size={16} />
                        <span className="overflow-hidden">{uinfo.username}</span>
                        {
                          count > 0 && (<p className="w-[18px] h-[18px] flex iterm-center justify-center rounded-full bg-red-500 text-[12px] font-bold">
                            {count > 9 ? '9+' : count}
                          </p>)
                        }
                      </div>
                    )
                  })}
                  <div className="dropdown-item" onClick={() => handleOptionClick("All")}>
                    <User size={16} />
                    <span>All</span>
                    {
                      [1].map(v => {

                        let c = chatMessages['All'].reduce((acc, val) => {
                          if (val.sender != user.username) return acc + (val.seen ? 0 : 1);
                          return acc;
                        }, 0);
                        if (c) {
                          return (
                            < p className="w-[18px] h-[18px] flex iterm-center justify-center rounded-full bg-red-500 text-[12px] font-bold">
                              {c}
                            </p>
                          )
                        }
                      })
                    }
                  </div>
                </div>
              )}
            </div>
            <button className="bot-button" onClick={() => handleOptionClick("Bot")}>
              <FaRobot />
              <span>ChatBot</span>
              {isBotActive && <div className="status-indicator"></div>}
            </button>
          </div>
          <div className="CancelIcon">
            <button onClick={toggleFullScreen}>
              {isFullScreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
            </button>
            <button onClick={() => setIsChatOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="messages-container">
          {chatMessages[selectedOption]?.map((message, index) => {
            // console.log("Message object:", message);
            const messageText = typeof message.text === "object" ? message.text.text : message.text;
            const codeRegex = /```(?:[a-z]*)?\n([\s\S]*?)```/g;
            let parts = [];
            let lastIndex = 0;

            if (message.sender !== user.username)
              dispatchUser(setMsgSeened({ message, idx: index }));

            messageText.replace(codeRegex, (match, code, offset) => {
              if (offset > lastIndex) {
                parts.push({ type: "text", content: messageText.slice(lastIndex, offset) });
              }
              parts.push({ type: "code", content: code.trim() });
              lastIndex = offset + match.length;
              return match;
            });

            if (lastIndex < messageText.length) {
              parts.push({ type: "text", content: messageText.slice(lastIndex) });
            }

            return (
              <div
                key={index}
                className={`message-wrapper ${message.sender !== user.username ? "received" : "sent"
                  }`}
              >
                <div className="avatar">{message.isBot ? <FaRobot /> : <FaUser />}</div>
                <div className="message-content">
                  <div className="messageSender text-[13px] pl-1 pr-1 bg-[#228afa] rounded mt-1 mb-1">{message.sender === user.username ? 'you' : message.sender}</div>
                  {parts.map((part, partIndex) => (
                    part.type === "code" ? (
                      <div className="code-snippet-container" key={partIndex}>
                        <div ref={(el) => (codeRefs.current[index] = el)}>
                          <SyntaxHighlighter
                            language="java"
                            style={materialDark}
                            customStyle={{
                              padding: "1em",
                              borderRadius: "5px",
                              margin: "0.5em 0",
                            }}
                            showLineNumbers
                          >
                            {part.content}
                          </SyntaxHighlighter>
                        </div>
                        <button className="copy-button" onClick={() => copyToClipboard(part.content, index)}>
                          <Copy size={15} /> {copiedIndex === index ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="message-text" key={partIndex}>
                          {part.content}
                        </p>

                      </>

                    )
                  ))}

                  <p className="message-timestamp">{message.timestamp}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="message-wrapper received">
              <div className="avatar bot-message-avatar">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="message typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Message here"
            className="message-input"
          />
          <button type="submit" className="send-button">
            <FaPaperPlane size={20} />
          </button>
        </form>
      </div>
    </div >
  );
};

export default Chat;
