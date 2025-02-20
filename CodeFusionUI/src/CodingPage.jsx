import React, { useState, useEffect, useRef } from 'react';
import './App.css'
import ProfileIcon from'./profileIcon.jsx';
// import { BiCommentDots } from "react-icons/bi"
import { FaBeer } from 'react-icons/fa';

const CodingPage=()=>{
    const [openMenu, setopenMenu] = useState(["none", "none", "none"]);
    const [display,setdisplay]=useState(["none","none","none"]);
    const [pointermain,setpointermain]=useState("");
    const [filtermain,setfiltermain]=useState("");
    const [newfiledisplay, setnewfiledisplay] = useState("none");
    const [newfolderdisplay, setnewfolderdisplay] = useState("none");
    const [newfoldername, setnewfoldername] = useState("");
    const [newfilename, setnewfilename] = useState("");
    // useEffect(() => {
    //     if (openMenu.some(menu => menu === "block")) {
    //         document.addEventListener("mousedown", handleOutsideClick);
    //     } else {
    //         document.removeEventListener("mousedown", handleOutsideClick);
    //     }

    //     return () => {
    //         document.removeEventListener("mousedown", handleOutsideClick);
    //     };
    // }, [openMenu]);

    // const handleOutsideClick = (event) => {
    //     setopenMenu(["none", "none", "none"]);
    // };

    // const menuClick = (index) => {
    //     var newMenu = ["none", "none", "none"];
    //     newMenu[index] = openMenu[index] === "none" ? "block" : "none";
    //     setopenMenu(newMenu);
    // };
    
    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const showfolderpopup =()=>{
        setnewfolderdisplay("block");
        setfiltermain('blur(5px)');
        setpointermain('none');
        menuClick(0);
    };
    const hidefolderpopup =(name)=>{
        setnewfolderdisplay("none");
        setnewfoldername(name);
        setfiltermain('');
        setpointermain('');
        const style={}
    };
    const hidefilepopup =(name)=>{
        setnewfiledisplay("none");
        setnewfilename(name);
        setfiltermain('');
        setpointermain('');
        const style={}
    };
    const showfilepopup =()=>{
        setnewfiledisplay("block");
        setfiltermain('blur(5px)');
        setpointermain('none');
        menuClick(0);
    };

    const menuClick = (index) => {
        var newMenu =[...openMenu];
        const data = newMenu[index] === "none" ? "block" : "none";
        newMenu=["none", "none", "none"];
        newMenu[index]= data;
        setopenMenu(newMenu);
        console.log(index)
    };

    const displayOpen=(index)=>{
        const newDisplay = [...display];
        newDisplay[index]=newDisplay[index]==="none"?"block":"none";
        setdisplay(newDisplay);
    }

    
    const fileoptions={"New File":showfilepopup,"New Folder":showfolderpopup};
    const editoptions={"Undo":()=>fun(),"Redo":()=>fun(),"Clear":()=>fun()};
    const viewoptions={"Project Explorer":() => displayOpen(0),"Terminal":() => displayOpen(1),"Chat":() => displayOpen(2)};
    // var style={ filter: 'blur(5px)',pointerEvents: 'none'}








    return(
        <div>
            <div style={{height:'100dvh',width:'100dvw',pointerEvents:pointermain,filter:filtermain}} >
                <header style={{backgroundColor:'#07243D',height:'45px',width:'96dvw',borderBottom:'1px solid #37546D',padding:'0dvw 2dvw',display:'flex',flexDirection:'row'}} >
                    <MenuIcons text="File" onClick={()=>menuClick(0)} />
                    <Menu style={{display:openMenu[0]}} icons={fileoptions} />
                    <MenuIcons text="Edit" onClick={()=>menuClick(1)}/>
                    <Menu style={{display:openMenu[1]}} icons={editoptions}/>
                    <MenuIcons text="View" onClick={()=>menuClick(2)}/>
                    <Menu style={{display:openMenu[2]}} icons={viewoptions} />
                    <MenuIcons text="Chat" onClick={()=>displayOpen(2)}/>
                    <ProfileIcon />
                </header>
                <div style={{display:'flex',flexDirection:'row',height:'1050px'}} onClick={()=>menuClick(3)}>
                    <div style={{backgroundColor:'#07243D',height:'100%',width:'50px',borderRight:'1px solid #37546D'}}>
                        <span className="folderSymbol" onClick={()=>displayOpen(0)}>folder_open</span><br></br>
                        <span className="folderSymbol" style={{fontSize:'2.5em',margin:'5px'}} onClick={()=>displayOpen(1)}>play_arrow</span>
                        {/* <h1><FaBeer/></h1> */}
                    </div>
                    <div style={{display:display[0],backgroundColor:'#102C47',height:'100%',width:'30%',borderRight:'1px solid #37546D'}}></div>
                    <div style={{backgroundColor:'#27445D',height:'100%',width:'100%',display:'flex',flexDirection:'column'}}>
                        <div style={{backgroundColor:'#27445D',height:'100%',width:'100%',}}></div>
                        <div style={{display:display[1],backgroundColor:'#102C47',height:'50%',width:'100%',borderTop:'1px solid #37546D'}}></div>
                    </div>
                    <div style={{display:display[2] ,backgroundColor:'#17344D',height:'100%',width:'40%',borderLeft:'1px solid #37546D'}}></div>
                </div>
            </div>
            <NewFile display={newfiledisplay} onClick={hidefilepopup}/>
            <NewFolder display={newfolderdisplay} onClick={hidefolderpopup}/>
        </div>
    );
}
const MenuIcons=({text,onClick})=>{
    return(
        <div onClick={onClick} style={{height:'30px',width:'50px',margin:'4px 10px'}}>
            <h4 style={{color:'#EFE9D5',margin:'5px',letterSpacing:'1px'}}>{text}</h4>
        </div>
    );
}
const Menu=({style,icons})=>{
    return(
        <div style={{position:'absolute',height:'auto',width:'250px',backgroundColor:'#07243D',border:'1px solid #37546D',top:'35px',left:'55px', ...style }}>
            {Object.entries(icons).map(([value, action]) => (
                <MenuButtons  text={value} onClick={action}/>
            ))}
        </div>
    );
}
const MenuButtons=({text,onClick})=>{
    return(
        <div onClick={onClick} style={{width:'250px',borderBottom:'0.5px solid #37546D'}}><p style={{margin:'0px',padding:'2px 10px',letterSpacing:'0.5px',fontSize:'0.9em',color:'#EFE9D5'}}>{text}</p></div>
    );
}

const NewFile=({display,onClick})=>{
    const [inputValue,setInputValue]=useState("");
    const [error, setError] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    // const [resultantFileName, setresultantFileName] = useState("");

    // const filename=(event)=>{
    //     setInputValue(event.target.value);
    // }

    const fileType=(event)=>{
        setSelectedOption(event.target.value);
    }

    // const handleFinalName=(event)=>{
    //     setresultantFileName(inputValue.split('.')[0]+selectedOption);
    // }
    const filename=(event)=>{
        const value = event.target.value;
        setInputValue(value);
        const symbolRegex = /[^a-zA-Z0-9\s]/g;  // Matches anything NOT a letter, number, or space

        if (symbolRegex.test(value)) {
            setError(" Input shoudn't contain any special characters!");
        } else {
            setError("");
            setInputValue(value);
        }
    }

    

    const handleFinalName=()=>{
        if(inputValue!=""&&error===""){
            const resultantFileName=inputValue.split('.')[0]+selectedOption;
            console.log(resultantFileName)
            onClick(resultantFileName);
        }
    }

    return(
        <div style={{pointerEvents: 'auto',display:display,position:'absolute',height:'220px',width:'500px',top:'200px',left:'700px',border:'1px solid #37546D',backgroundColor:'#102C47',borderRadius:'10px',boxShadow: '5px 10px 30px rgba(0, 0, 0, 0.5)'}}>
            <h1 style={{color:'#EFE9D5',padding:'8px',letterSpacing:'1px',fontSize:'1.2em',borderBottom:'1px solid #37546D',margin:'0px',backgroundColor:'#07243D',marginBottom:'20px',borderRadius:'10px 10px 0px 0px'}}>New File</h1>
            <div>
                
                <div style={{ margin: '20px' }}>
                    <label htmlFor="username" style={{ paddingRight: '10px' ,fontSize:'1.1em',color:'#EFE9D5',letterSpacing:'1px'}}>Name</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={inputValue} 
                        onChange={filename} 
                        style={{
                            padding: "5px",
                            fontSize: "16px",
                            border: "1px solid #37546D",
                            borderRadius: "5px",
                            outline: "none",
                            width: "300px",
                            backgroundColor:'#27445D',
                            color:'#EFE9D5'
                          }}
                    />
                </div>

                <div style={{ margin: '20px' }}>
                    <label htmlFor="type" style={{ paddingRight: '20px' ,fontSize:'1.1em',color:'#EFE9D5',letterSpacing:'1px'}}>Type</label>
                    <select id="dropdown" value={selectedOption} onChange={fileType}
                        style={{
                            padding: "5px",
                            fontSize: "16px",
                            border: "1px solid #37546D",
                            borderRadius: "5px",
                            outline: "none",
                            width: "310px",
                            backgroundColor:'#27445D',
                            color:'#EFE9D5'
                        }}>
                        <option value=".html">.html</option>
                        <option value=".css">.css</option>
                        <option value=".js">.js</option>
                        <option value=".java">.java</option>
                        <option value=".py">.py</option>
                        <option value=".ruby">.ruby</option>
                        <option value=".go">.go</option>
                        <option value=".jsx">.jsx</option>
                    </select>
                </div>
                <div style={{color:'#EFE9D5',padding:'5px 30px',width:'50px',border: "3px solid #37546D",borderRadius:'8px',position:'absolute',top:'160px',left:'240px'}} onClick={()=>onClick()}>Cancel</div>
                <div style={{color:'#EFE9D5',padding:'5px 30px',width:'40px',border: "3px solid #37546D",borderRadius:'8px',position:'absolute',top:'160px',left:'370px'}} onClick={handleFinalName}>Done</div>
            </div>
        </div>
    )
}
const NewFolder=({display,onClick})=>{
    // const [viewdisplay,setdisplay]=useState({display});
    const [inputValue,setInputValue]=useState("");
    // const [resultantFileName, setresultantFileName] = useState("");
    const [error, setError] = useState("");

    const filename=(event)=>{
        const value = event.target.value;
        setInputValue(value);
        const symbolRegex = /[^a-zA-Z0-9\s]/g;  // Matches anything NOT a letter, number, or space

        if (symbolRegex.test(value)) {
            setError(" Input shoudn't contain any special characters!");
        } else {
            setError("");
            setInputValue(value);
        }
    }

    

    const handleFinalName=()=>{
        if(inputValue!=""&&error===""){
            const resultantFileName=inputValue.split('.')[0];
            console.log(resultantFileName)
            onClick(resultantFileName);
        }
        else {
            setError(" Enter a valid name!");
        }
    }

    return(
        <div style={{pointerEvents: 'auto',display:display,position:'absolute',height:'180px',width:'500px',top:'200px',left:'700px',border:'1px solid #37546D',backgroundColor:'#102C47',borderRadius:'10px',boxShadow: '5px 10px 30px rgba(0, 0, 0, 0.5)'}}>
            <h1 style={{color:'#EFE9D5',padding:'8px',letterSpacing:'1px',fontSize:'1.2em',borderBottom:'1px solid #37546D',margin:'0px',backgroundColor:'#07243D',marginBottom:'20px',borderRadius:'10px 10px 0px 0px'}}>New Folder</h1>
            <div> 
                <div style={{ margin: '20px' }}>
                    <label htmlFor="username" style={{ paddingRight: '10px' ,fontSize:'1.1em',color:'#EFE9D5',letterSpacing:'1px'}}>Name</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={inputValue} 
                        onChange={filename} 
                        style={{
                            padding: "5px",
                            fontSize: "16px",
                            border: "1px solid #37546D",
                            borderRadius: "5px",
                            outline: "none",
                            width: "300px",
                            backgroundColor:'#27445D',
                            color:'#EFE9D5'
                        }}
                    />
                    {error && <p style={{ color: "red", marginTop: "5px" ,marginLeft:'60px'}}>{error}</p>}
                </div>
                <div style={{color:'#EFE9D5',padding:'5px 30px',width:'50px',border: "3px solid #37546D",borderRadius:'8px',position:'absolute',top:'120px',left:'240px'}} onClick={()=>onClick("")}>Cancel</div>
                <div style={{color:'#EFE9D5',padding:'5px 30px',width:'40px',border: "3px solid #37546D",borderRadius:'8px',position:'absolute',top:'120px',left:'370px'}} onClick={handleFinalName}>Done</div>
            </div>
        </div>
    )
}
export default CodingPage;


























// ____________  ___________        ___________   _____________   _____________
// |_   ____  |  | ________|       | _______  |   | _________ |   | _________ |
//   | |    | |  | |               |_|     /  /   | |       | |   | |       | |
//   | |____| |  | |________             /  /     | |       | |   | |       | |
//   |   _____|  |________ |           /  /       | |       | |   | |       | |
//   |  _ \              | |         /  /         | |       | |   | |       | |
//   | | \ \     ________| |        | |________   | |_______| |   | |_______| |
//   |_|  \_\    |_________|        |_________|   |___________|   |___________|




