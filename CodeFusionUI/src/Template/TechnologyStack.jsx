import React, { useState, useEffect } from "react";
import { FaHtml5, FaJava, FaJs, FaPython } from "react-icons/fa";
import {DiRuby} from "react-icons/di";
import {TbBrandCpp} from "react-icons/tb";
import { SiGo } from "react-icons/si";
import { FaC } from "react-icons/fa6";
import {useNavigate } from "react-router-dom";


function TechnologyStack() {
    // Simple array of technology options
    const technologies = [
        { name: "HTML", id: "html", icon: <FaHtml5 className="tech-icon html" /> },
        { name: "Go", id: "go", icon: <SiGo className="tech-icon go" /> },
        { name: "Java", id: "java", icon: <FaJava className="tech-icon java" /> },
        { name: "Ruby", id: "Ruby", icon: <DiRuby className="tech-icon Ruby" /> },
        { name: "Python", id: "python", icon: <FaPython className="tech-icon python" /> },
        {name : "C" , id : "C" ,icon : <FaC className="tech-icon C"/>},
        {name : "C++",id : "C++",icon : <TbBrandCpp className = "tech-icon Cpp"/>},

    ]

    const[isVisible,setIsVisible] = useState(true);
    // State to track selected technology
    const [selected, setSelected] = useState("")
    const navigate = useNavigate();
    // Handle technology selection
    const handleSelect = (techId) => {
        setSelected(techId)
      
    }

    const handleCancel = () =>{
        setIsVisible(false);
    }
    if(!isVisible){
        return null;
    }


    return (
        <div className="workspace-container1">

            <p className="workspace-title">Select a Technology Stack : </p>

            <div className="tech-grid">
                {technologies.map((tech) => (
                    <div
                        key={tech.id}
                        className={`tech-box ${selected === tech.id ? "selected" : ""}`}
                        onClick={() => handleSelect(tech.id)}
                    >
                        {tech.icon}
                        {/* Technology Name */}
                        <span className="tech-name">{tech.name}</span>

                        {/* Show checkmark only if selected */}
                        {selected === tech.id && <span className="checkmark">✓</span>}
                    </div>
                ))}
            </div>
            <div className="button-group">
           
                <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                    <span className="btn-text">Cancel</span>
                    <span className="btn-shine"></span>
                </button>
                <button type="submit" className="btn btn-next"  onClick={() => navigate("/cwTemplate")}>
                    <span className="btn-text" >Prev</span>
                    <span className="btn-shine"></span>
                </button>
                <button type="submit" className="btn btn-next">
                    <span className="btn-text">Create</span>
                    <span className="btn-shine"></span>
                </button>

            </div>
        </div>
    )
}

export default TechnologyStack