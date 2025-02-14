import React, { useState } from "react";
import chat from "./Chat.module.css" ;


const Chat = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Users"); 

    
    const handleOptionClick = (option) => {
        setSelectedOption(option); 
        setIsDropdownOpen(false); 
    };

    return (
        <div className={chat.bodyContainer}>
            <div className={chat.sideContainer}> 
                <div className={chat.chatHeader}> 
                    {/* User Button with Dropdown */}
                    <div className={chat.dropdown}>
                        <button 
                            className={chat.userBtn} 
                            style ={{background :  "#27445D"}}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {selectedOption} {/* Display selected option */}
                        </button>
                        {isDropdownOpen && (
                            <div className={chat.dropdownMenu}> 
                                <p onClick={() => handleOptionClick("Manimekala")}>Manimekala</p>
                                <p onClick={() => handleOptionClick("Pravin")}>Pravin</p>
                                <p onClick={() => handleOptionClick("Arul Kumar")}>Arul Kumar</p>
                            </div>
                        )}
                    </div>               
                    {/* Bot Button (Normal) */}
                    <button className={chat.botBtn} style ={{background :  "#27445D"}}>ChatBot</button> 
                </div>
                <div className={chat.textBox} ></div>
                {/* Chat Area */}
                <div className={chat.chatBox}>
                    <input  
                        className ={chat.styleMessage}
                        type="text" 
                        placeholder="Message here"
                    />
                </div>
            </div>
        </div>
    );
};

export default Chat;
