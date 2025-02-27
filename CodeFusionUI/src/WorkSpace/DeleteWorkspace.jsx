

import { useContext, useState } from "react"
import { X } from "lucide-react"
import "./RenameWorkspace.css"
import { UserContext } from "../LogInPage/UserProvider"
import { deleteWorkspace, updateWorkspace } from "../Redux/editorSlice"
import { useSelector } from "react-redux"
import { deleteFileOrFolder } from "../utils/Fetch"

const DeleteWorkspace = ({ onClose, currentWorkspace }) => {

  const { user, dispatchUser } = useContext(UserContext);
  const workspaces = useSelector(state => state.editor.workspaces);

  const [newName, setNewName] = useState("")
  const [error, setError] = useState("")

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError("")

    try {
      // console.log({
      //   workspaceName: currentWorkspace,
      //   newWsName: newName,
      //   email: user.email,
      // });

      const response = await fetch(`${import.meta.env.VITE_SERVLET_URL}/deleteWs?wsName=${encodeURI(currentWorkspace)}&email=${encodeURI(user.email)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      })
      console.log(response);

      if (response.status === 200) {
        const fileUrl = `/codefusion/${user.username}/${currentWorkspace}`;
        deleteFileOrFolder({ 'url': fileUrl, 'type': 'folder' })
          .then(res => {
            console.log(res);
          })
        console.log(workspaces);
        dispatchUser(deleteWorkspace({ workspaceName: currentWorkspace }))
        onClose()
      } else {
        setError(data.message || "Failed to update workspace name")
      }
    } catch (err) {
      setError("Error updating workspace name. Please try again.")
    } finally {
    }
  }

  return (
    <>
      <div className="modal-overlay"></div>
      <div className="rename-container">
        <div className="rename-header">
          <h2>Delete Workspace</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="form-containers">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>Current Name</label>
            <input
              type="text"
              value={currentWorkspace}
              readOnly
              className="style-input"
            />
          </div>

          <div className="input-group">
            <label>Type The Workspace Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="style-input"
              placeholder="Type The Workspace Name..."
            />
          </div>

          <div className="button-container">
            {newName !== currentWorkspace
              ? <button type="submit" disabled className="style-button">Delete</button>
              : <button type="submit" className="style-button">Delete</button>}
          </div>
        </form>
      </div>
    </>

  )
}

export default DeleteWorkspace;