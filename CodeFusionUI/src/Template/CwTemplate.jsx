import React, { useState, useEffect } from "react";
import "./CwTemplate1.css";


import { Navigate, useNavigate } from "react-router-dom";


const CreateWorkspace = () => {
    const [workspaceName, setWorkspaceName] = useState("")
    const [isFocused, setIsFocused] = useState(false);
    const [isVisible, setIsVisible] = useState(true); 

    const navigate = useNavigate();
    const handleSubmit = (e) => {
      e.preventDefault()
      // Handle form submission
      if (workspaceName.trim() === "") {
        alert("Workspace name cannot be empty!");
        return;
      }
      console.log("Workspace name:", workspaceName);
     navigate("/technologyStack");
    }
    const handleCancel = () => {
        setIsVisible(false);
    };

if (!isVisible) {
    return null;
}
  
    return (
        <div className="workspace-container" style = {{top: "250px" ,  left: "600px"}}>
          <h2 className="workspace-title">Create WorkSpace</h2>
  
          <form className="workspace-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="form-input"
                placeholder="Enter the Name"
              />
            </div>
  
            <div className="button-group">
            <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                <span className="btn-text">Cancel</span>
                <span className="btn-shine"></span>
              </button>
              <button type="submit" className="btn btn-next">
                <span className="btn-text">Next</span>
                <span className="btn-shine"></span>
              </button>
              
            </div>
          </form>
        </div>
    )
  }
  
  export default CreateWorkspace
  

