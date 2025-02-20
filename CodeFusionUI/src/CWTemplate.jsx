import React, { useState, useEffect } from "react";
import "./CWTemplate1.css";

function cwTemplate() {
    <div className="dashboardMainDiv" >
        <div className="dashboardSidePannel">
            <h1 style={{ fontSize: '1.5em', padding: '10px', margin: '0px', backgroundColor: '#37546D', color: '#EFE9D5' }}>Code Fusion</h1>
            <div className="dashboardSidePannelButtons" style={{ backgroundColor: buttonColors[0] }} onClick={() => handleClick(0)}>Recent Workspaces</div>
            <div className="dashboardSidePannelButtons" style={{ backgroundColor: buttonColors[1] }} onClick={() => handleClick(1)}>My Workspaces</div>
            <div className="dashboardSidePannelButtons" style={{ backgroundColor: buttonColors[2] }} onClick={() => handleClick(2)}>Shared with me</div>
            <div style={{ width: '295px', border: "1px solid #37546D", marginTop: "30px" }}></div>
            <div className="dashboardSidePannelButtons" style={{ backgroundColor: buttonColors[3] }} onClick={() => handleClick(3)}>Chat</div>
        </div>
        {/* <ShowPage {...showpagedata}/> */}
        {/* <Chatpage/> */}
    </div>
}
export default cwTemplate;