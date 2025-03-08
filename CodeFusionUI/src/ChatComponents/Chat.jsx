import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { FaChevronDown, FaUser, FaRobot, FaPaperPlane, FaCopy, FaDownload, FaExpand, FaCompress } from "react-icons/fa";
import { ChevronDown, User, Bot, Send, Copy, Download, Clock, X, Users } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import './Chat.css'
import { addChatsToDB, fetchCollaborators, getBotResponseAPI, getChats } from "../utils/Fetch";
import { useParams } from "react-router-dom";
import { UserContext } from "../LogInPage/UserProvider";
import { useWebSocket } from "../Websocket/WebSocketProvider";
import { emptyChat, setChatMessages, setHasMore, setLoading, setMsgSeened, setOlderMessages } from "../Redux/editorSlice";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import { usePopup } from "../PopupIndication/PopUpContext";


const Chat = ({ isChatOpen, setIsChatOpen }) => {

  const { ownername, workspace } = useParams();
  const { user, dispatchUser } = useContext(UserContext);
  const chatContainerRef = useRef(null);

  const { chatMessages, hasMore, oldestId, loading } = useSelector(state => state.editor.Chat);

  const { socket } = useWebSocket();
  const { showPopup } = usePopup();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const lastScrollTop = useRef(0);
  const fetchTriggered = useRef(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectedOption = useRef("All");
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

  const messagesEndRef = useRef(null);
  const endMsgRef = useRef(null);

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

  const scrollToOlderMsg = () => {
    endMsgRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    console.log("ChatScroll", loading);

    if (container && !loading) {
      scrollToBottom();
    }
  }, [chatMessages]);

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
    selectedOption.current = option;
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
        receiver: selectedOption.current,
        timestamp: new Date().toLocaleTimeString(),
        isBot: false,
        roomId: (ownername + "$" + workspace),
        seen: false
      };

      console.log(socket, selectedOption.current);

      if (selectedOption.current === "Bot") {
        dispatchUser(setChatMessages({ selectedOption:selectedOption.current, userMessage }));

        setIsTyping(true);
        // setTimeout(() => {
        //   const botMessage = {
        //     text: getBotResponse(inputMessage),
        //     sender: "Bot",
        //     timestamp: new Date().toLocaleTimeString(),
        //     isBot: true,
        //   };

        //   // setMessages((prev) => ({
        //   //   ...prev,
        //   //   "Bot": prev["Bot"] ? [...prev["Bot"], botMessage] : [botMessage],
        //   // }));

        //   setIsTyping(false);
        // }, 1500);


        getBotResponseAPI(inputMessage).then((botMessage) => {
          // setMessages((prev) => ({
          //   ...prev,
          //   "Bot": prev["Bot"] ? [...prev["Bot"], botMessage] : [botMessage],
          // }));
          dispatchUser(setChatMessages({ selectedOption:selectedOption.current, userMessage: botMessage }));
          setIsTyping(false);
        });

        setInputMessage("");
        return;
      }

      if (socket) {
        console.log("Client Send Message to ");

        socket.send(JSON.stringify({
          event: "chat",
          message: userMessage,
        }));
      }

      // if (selectedOption.current === "All") {

      dispatchUser(setChatMessages({ selectedOption:selectedOption.current, userMessage }));

      addChatsToDB(
        ownername,
        workspace,
        userMessage
      )
        .then((data) => showPopup(data.message, 'success', 3000))
      // .catch(err => showPopup("Error Add Chat to DB", 'error', 3000))


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
      //   [selectedOption.current]: prev[selectedOption.current] ? [...prev[selectedOption.current], userMessage] : [userMessage],
      // }));
      // }

      setInputMessage("");
    }
  };


  // const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleScroll = useCallback(
    debounce(() => {
      const container = chatContainerRef.current;
      console.log(!container, loading, !hasMore, fetchTriggered.current, selectedOption.current);

      if (!container || loading || !hasMore || fetchTriggered.current || selectedOption.current === 'Bot') return;

      const { scrollTop } = container;

      if (scrollTop < 50) {
        const prevScrollHeight = container.scrollHeight;
        fetchTriggered.current = true;
        dispatchUser(setLoading(true));

        setTimeout(() => {
          getChats(ownername, workspace, oldestId)
            .then(data => {
              console.log(data);

              if (data === "Chats Over") {
                fetchTriggered.current = false;
                dispatchUser(setLoading(false));
                dispatchUser(setHasMore(false));
                return;
              }
              dispatchUser(setOlderMessages({ messages: data }));
              requestAnimationFrame(() => {
                const newScrollHeight = container.scrollHeight;
                const scrollDifference = newScrollHeight - prevScrollHeight;
                container.scrollTop = scrollDifference;
              });
              showPopup("More messages loaded", 'success', 2000);
            })
            .catch(error => {
              showPopup('Failed to load more messages', 'error', 2000);
            })
            .finally(() => {
              fetchTriggered.current = false;
              dispatchUser(setLoading(false));
            });
        }, 1000);
      }
    }, 200),
    [ownername, workspace, oldestId, hasMore, loading]
  );

  const AnimatedLoadingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="loading-chat"
    >
      <div className="loading-progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${loadingProgress}%` }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        />
      </div>
      <motion.div
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading more messages...
      </motion.div>
      <motion.div
        className="loading-spinner"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            stroke="#3498db"
            strokeDasharray="125.66"
            strokeDashoffset="125.66"
            style={{
              animation: 'progress 1.5s linear infinite'
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );

  const MessageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };


  const smoothScroll = (container, scrollTop, newHeight, prevHeight, duration = 500) => {
    const start = container.scrollTop;
    const change = (scrollTop + (newHeight - prevHeight)) - start;
    const startTime = performance.now();

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollTop = start + change * progress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  };


  useEffect(() => {
    if (ownername && workspace && !fetchTriggered.current) {
      fetchTriggered.current = true;
      dispatchUser(setLoading(true));
      dispatchUser(setHasMore(true));
      dispatchUser(emptyChat());

      getChats(ownername, workspace, null)
        .then(data => {
          dispatchUser(setOlderMessages({ messages: data, isFirst: true }));
          // scrollToBottom();
          showPopup("Messages Fetched Successfully", 'success', 3000);
          // fetchTriggered.current = false;
          // dispatchUser(setLoading(false));
        })
        .catch(err => {
          showPopup("Messages Fetching failed", 'error', 3000);

        }).finally(() => {
          fetchTriggered.current = false;
          dispatchUser(setLoading(false));

        })
    }
  }, [])


  return (
    <div className={`chat-container ${selectedOption.current === "Bot" ? "expanded" : ""} ${isFullScreen && isChatOpen ? "full-screen" : ""}`}>
      <div className="chat-window">
        <div className="chat-header">
          <div className="header-left">
            <div className="dropdown-container">
              <button className="user-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="avatar">
                  {selectedOption.current === "Bot" ? <FaRobot /> : <FaUser />}
                </div>
                <span>{selectedOption.current}</span>
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
                    <Users size={16} />
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
        <div className="messages-container" ref={chatContainerRef} onScroll={handleScroll}>
          {loading && <AnimatedLoadingIndicator />}
          {chatMessages[selectedOption.current]?.map((message, index) => {
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
            // if(oldestId === message.id){
            //   endMsgRef.current = 
            // }

            return (
              <div
                key={message.id}
                className={`message-wrapper ${message.sender !== user.username ? "received" : "sent"
                  }`}
              >
                <div className="avatar">{message.isBot ? <FaRobot /> : <FaUser />}</div>
                <div className="message-content">
                  <div className="messageSender text-[13px] pl-1 pr-1 bg-[#228afa] rounded mt-1 mb-1">{message.sender === user.username || message.sender === 'Bot' ? '' : message.sender}</div>
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
