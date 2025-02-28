// "use client"

import { useContext, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, FolderIcon, FileIcon, XIcon } from "lucide-react"
import { getFolders } from "../utils/Fetch"
import { UserContext } from "../LogInPage/UserProvider"

const Rename = ({ isRename, fileOnClick, currentPath = "/" }) => {

  const { user } = useContext(UserContext);

  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [selectedOption, setSelectedOption] = useState(".html")
  const [path, setPath] = useState("/")
  const [isPathDropdownOpen, setIsPathDropdownOpen] = useState(false)


  const fileType = (event) => {
    setSelectedOption(event.target.value)
  }

  const filename = (event) => {
    const value = event.target.value
    setInputValue(value)
    const symbolRegex = /[^a-zA-Z0-9\s]/g
    if (symbolRegex.test(value)) {
      setError("Input shouldn't contain any special characters!")
    } else {
      setError("")
      setInputValue(value)
    }
  }

  const handleFinalName = () => {
    if (inputValue !== "" && error === "") {
      const oldFile = isRename?.oldName;
      console.log(oldFile);
      // if (!oldFile?.url) {
      //   oldFile['url'] = isRename.
      // }
      let oldUrl = oldFile.url.split('/');
      let oldOne = oldUrl.pop();
      oldFile['newName'] = oldUrl.join('/') + '/' + inputValue + (oldOne.split('.').length > 1 ? "." + oldOne.split('.')[1] : "");
      console.log(oldFile);

      fileOnClick(oldFile);
      return
    }
    fileOnClick(null)
  }

  const handlePathChange = (newPath) => {
    setPath(newPath)
    setIsPathDropdownOpen(false)
  }

  // useEffect(() => {
  //   getFolders(user.username, currentPath).then(res => {
  //     console.log(res);
  //     if (res.length > 0) {
  //       folderStructureRef.current = ["/", ...res];
  //     }
  //     // folderStructure = res;

  //   })

  // }, [])

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        style={{
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "#1E293B",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden"
        }}
      >
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            backgroundColor: "#0F172A",
            color: "#E2E8F0"
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>Rename {isRename.type === 'file' ? 'FIle' : 'Folder'}</h1>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileOnClick(null)}
            style={{ cursor: "pointer" }}
          >
            <XIcon size={24} />
          </motion.div>
        </motion.div>

        <div style={{ padding: "20px" }}>
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: "20px", position: "relative" }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#94A3B8",
                fontSize: "0.875rem"
              }}
            >
              Path
            </label>
            <div
              onClick={() => setIsPathDropdownOpen(!isPathDropdownOpen)}
              style={{
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #334155",
                borderRadius: "8px",
                backgroundColor: "#1E293B",
                color: "#E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <FolderIcon size={18} style={{ marginRight: "8px" }} />
                <span>{path}</span>
              </div>
              <ChevronDown size={18} />
            </div>
            <AnimatePresence>
              {isPathDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "#1E293B",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    zIndex: 10,
                    maxHeight: "150px",
                    overflowY: "auto",
                    marginTop: "4px"
                  }}
                >
                  {folderStructureRef.current.length > 0 ? folderStructureRef.current.map((folder) => (
                    <motion.div
                      key={folder}
                      onClick={() => handlePathChange(folder)}
                      whileHover={{ backgroundColor: "#2D3748" }}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        color: "#E2E8F0",
                        borderBottom: "1px solid #334155",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <FolderIcon size={18} style={{ marginRight: "8px" }} />
                      {folder}
                    </motion.div>
                  )) : <h5 style={{ padding: '5px 10px' }}>No Folders Available</h5>}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: "20px" }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#94A3B8",
                fontSize: "0.875rem"
              }}
            >
              Old Name
            </label>
            <div style={{ position: "relative" }}>
              <FileIcon
                size={18}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748B"
                }}
              />
              <input
                type="text"
                value={isRename?.oldName?.file}
                disabled
                style={{
                  padding: "10px 10px 10px 36px",
                  fontSize: "14px",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  outline: "none",
                  width: "100%",
                  backgroundColor: "#1E293B",
                  color: "#E2E8F0",
                  boxSizing: "border-box"
                }}
                placeholder="Enter Folder name"
              />
            </div>
            {error && (
              <p style={{
                color: "#EF4444",
                marginTop: "4px",
                fontSize: "0.75rem"
              }}>
                {error}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: "20px" }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#94A3B8",
                fontSize: "0.875rem"
              }}
            >
              New Name
            </label>
            <div style={{ position: "relative" }}>
              <FileIcon
                size={18}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748B"
                }}
              />
              <input
                type="text"
                value={inputValue}
                onChange={filename}
                style={{
                  padding: "10px 10px 10px 36px",
                  fontSize: "14px",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  outline: "none",
                  width: "100%",
                  backgroundColor: "#1E293B",
                  color: "#E2E8F0",
                  boxSizing: "border-box"
                }}
                placeholder={`Enter ${isRename.type === 'file' ? 'File' : 'Folder'} name`}
              />
            </div>
            {error && (
              <p style={{
                color: "#EF4444",
                marginTop: "4px",
                fontSize: "0.75rem"
              }}>
                {error}
              </p>
            )}
          </motion.div>



          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleFinalName}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2563EB"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3B82F6"}
          >
            Rename
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Rename