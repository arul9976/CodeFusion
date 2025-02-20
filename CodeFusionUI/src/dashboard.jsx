import React, { useState, useEffect, useRef } from 'react';
import './App.css'

import ProfileIcon from './profileIcon.jsx';


const DashPage = () => {
    const [buttonColors, setButtonColors] = useState(["#71BBB2", "#27445D", "#27445D", "#27445D"]);
    const [ownercolumn,setownercolumn] = useState('block');
    const [showpage,setShowpage]=useState("Recent Workspace");

    const handleClick = (index) => {
        const newColors = ["#27445D", "#27445D", "#27445D", "#27445D"];
        newColors[index] = newColors[index] === "#27445D" ? "#71BBB2" : "#27445D";
        setButtonColors(newColors);
        console.log(index)
        if(index==1){
            setownercolumn('none');
            setShowpage("My Workspace");
        }
        else if(index==2){
            setownercolumn('block');
            setShowpage("Shared With Me");
        }
        else if(index==0){
            setownercolumn('block');
            setShowpage("Recent Workspaces");
        }
    };
    const workspaces = { "wid": ["wname", "techStack", "lastAccessed","owner"] };
    const showpagedata = {workspacelist:workspaces,ownercolumn:ownercolumn,showpage:showpage};
    return (
        <div className="dashboardMainDiv" >
            <div className="dashboardSidePannel">
                <h1 style={{ fontSize: '1.5em', padding: '10px', margin: '0px', backgroundColor: '#37546D', color: '#EFE9D5' }}>Code Fusion</h1>
                <div className="dashboardSidePannelButtons" style={{ backgroundColor: buttonColors[0] }} onClick={() => handleClick(0)}>Recent Workspaces</div>
                <div className="dashboardSidePannelButtons" style={{ backgroundColor: buttonColors[1] }} onClick={() => handleClick(1)}>My Workspaces</div>
                <div className="dashboardSidePannelButtons" style={{ backgroundColor: buttonColors[2] }} onClick={() => handleClick(2)}>Shared with me</div>
                <div style={{ width: '295px', border: "1px solid #37546D", marginTop: "30px" }}></div>
                <div className="dashboardSidePannelButtons" style={{ backgroundColor: buttonColors[3] }} onClick={() => handleClick(3)}>Chat</div>
            </div>
            {/* <ShowPage  {...showpagedata}/> */}
            {/* <Chatpage/> */}
        </div>
    );
};
const Listbox = ({text}) => {
    const input = text.value;
    return (
        <div style={{ height: '50px', display: "flex", flexDirection: "row" }} onClick={() => action({ text })}>
            <div className="dashBoardworkspacelistbox" style={{ width: '820px' }}>{input[0]}</div>
            {input.slice(1).map((item, i) => (
                <div key={i} className="dashBoardworkspacelistbox" style={{ width: '200px' }}>
                    {item}
                </div>
            ))}
        </div>
    );
};

const ShowPage = ({workspacelist,ownercolumn,showpage}) => {
    return (
        <div style={{ width: '1620px', height: '99vh', border: '0px solid black' }}>
            <h1 style={{ fontSize: '1.5em', border: '0px solid black', padding: '10px', margin: '0px', color: '#000000', display: 'flex', flexDirection: 'row' }}>{showpage}<ProfileIcon /></h1>
            <div style={{ backgroundColor: '#f2f5f7', height: '80px', border: "1px solid #ddd", borderBottom: "0px", display: "flex", flexDirection: "row" }}>
                <input
                    type="text"
                    placeholder="Search..."
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "10px 40px",
                        width: "250px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "16px",
                        margin: '20px 30px'
                    }}
                />
                <img
                    src="https://cdn-icons-png.flaticon.com/512/622/622669.png" // Change to your logo URL
                    alt="Search Icon"
                    style={{
                        position: "absolute",
                        left: "340px",
                        top: "85px",
                        transform: "translateY(-50%)",
                        color: "#888",
                        width: "20px",
                        height: "20px",
                    }}
                />
                <div style={{ height: '20px', width: '140px', borderRadius: '50px', border: '1px solid #ddd', marginLeft: '900px', marginTop: "20px", color: 'color:#EFE9D5', padding: '10px 40px', background: 'linear-gradient(to right, #71BBB2,#0bb)' }} >Create Workspace</div>
            </div>
            <div style={{ backgroundColor: '#ecf0f3', height: '50px', border: "1px solid #ddd", display: "flex", flexDirection: "row" }}>
                <div className="dashBoardworkspacelistbox" style={{ width: '820px' }}>Workspace Name</div>
                <div className="dashBoardworkspacelistbox" style={{ width: '200px' }}>Technology Stack</div>
                <div className="dashBoardworkspacelistbox" style={{ width: '200px' }}>Last Accessed on</div>
                <div className="dashBoardworkspacelistbox" style={{ width: '200px' ,display:ownercolumn}}>Owner</div>
            </div>
            {Object.entries(workspacelist).map(([value, action]) => (
                <Listbox text={{value:action}}/> 
            ))}
        </div>
    );
}


const Chatpage=()=>{
    return(
        <div style={{ width: '1620px', height: '99vh', border: '0px solid black' }}>
            <h1 style={{ fontSize: '1.5em', border: '0px solid black', padding: '10px', margin: '0px', color: '#000000', display: 'flex', flexDirection: 'row' }}>Chat<ProfileIcon /></h1>
            <div style={{ backgroundColor: '#f2f5f7', height: '80px', border: "1px solid #ddd", borderBottom: "0px", display: "flex", flexDirection: "row" }}>
                <input
                    type="text"
                    placeholder="Search..."
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "10px 40px",
                        width: "250px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "16px",
                        margin: '20px 30px'
                    }}
                />
                <img
                    src="https://cdn-icons-png.flaticon.com/512/622/622669.png" // Change to your logo URL
                    alt="Search Icon"
                    style={{
                        position: "absolute",
                        left: "340px",
                        top: "85px",
                        transform: "translateY(-50%)",
                        color: "#888",
                        width: "20px",
                        height: "20px",
                    }}
                />
            </div>
            <div style={{height:'970px',width:'100%',border:'1px solid black',display: 'flex', flexDirection: 'row'}}>
                <div style={{height:'100%',width:'500px',border:'1px solid black',overflowY:'scroll'}}>
                    <Personinchat/>
                    <Personinchat/>
                </div>
            </div>
        </div>
    )
}
const Personinchat=()=>{
    return(
        <div style={{height:'50px',width:'94%',border:'1px solid black',padding:'10px'}}></div>
    )
}
export default DashPage;