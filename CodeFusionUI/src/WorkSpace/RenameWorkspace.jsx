

import { useContext, useState } from "react"
import { X } from "lucide-react"
import "./RenameWorkspace.css"
import { UserContext } from "../LogInPage/UserProvider"
import { setWorkspaces, updateWorkspace } from "../Redux/editorSlice"
import { useSelector } from "react-redux"
import { usePopup } from "../PopupIndication/PopUpContext"


const RenameWorkspace = ({ onClose, currentWorkspace }) => {

  const { user, dispatchUser } = useContext(UserContext);
  const workspaces = useSelector(state => state.editor.workspaces);

  const [newName, setNewName] = useState("")
  const [error, setError] = useState("")
  const { showPopup } = usePopup();

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError("")

    try {
      console.log({
        workspaceName: currentWorkspace,
        newWsName: newName,
        email: user.email,
      });

      const response = await fetch(`${import.meta.env.VITE_SERVLET_URL}/updatews?workspaceName=${encodeURI(currentWorkspace)}&newWsName=${encodeURI(newName)}&email=${encodeURI(user.email)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })
      console.log(response);

      if (response.status === 200) {
        console.log(workspaces);
        dispatchUser(updateWorkspace({ workspaceName: currentWorkspace, newWsName: newName }))
        onClose();
        showPopup("Workspace Renamed successfully", 'success', 3000);
      } else {
        showPopup(data.message, 'error', 3000);
        setError(data.message || "Failed to update workspace name")
      }
    } catch (err) {
      showPopup("Workspace Renamed Failed", 'error', 3000);
      setError("Error updating workspace name. Please try again.")
    } finally {
    }
  }

  return (
    <>
      <div className="modal-overlay"></div>
      <div className="rename-container">
        <div className="rename-header">
          <h2>Rename Workspace</h2>
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
            <label>New Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="style-input"
              placeholder="Enter new workspace name"
            />
          </div>

          <div className="button-container">
            <button type="submit" className="style-button">Update</button>
          </div>
        </form>
      </div>
    </>

  )
}

export default RenameWorkspace;