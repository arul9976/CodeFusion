import axios from "axios";


const getFileContent = async (path) => {
  console.log(path);

  try {
    // const response = await fetch(`http://172.17.22.225:3000/list-all-files/${user}`);
    const response = await axios.get(`${import.meta.env.VITE_RUNNER_URL}/getFileContent/${encodeURIComponent(path)}`);
    // const response = await fetch(`http://172.17.22.225:3000/getFileContent/${encodeURIComponent(path)}`);

    console.log(response);
    
    if (response.status === 200) {
      return response?.data;
    }

  } catch (error) {
    console.log("Error fetching files:", error);
  }
  return null;
}

const createFile = async (username, fileData, wsName) => {
  console.log(username, fileData);
  const response = await fetch(`${import.meta.env.VITE_RUNNER_URL}/createOrUpdateFile/${encodeURIComponent(username)}/${encodeURIComponent(wsName)}`, {
    // const response = await fetch(`http://172.17.22.225:3000/createOrUpdateFile/${encodeURIComponent(username)}`, {
    method: "POST",
    body: JSON.stringify(fileData),
  });

  if (response.status == 201) {
    return await response.json();
  }
  return { status: response.status, message: "File Creation Failed" };

}


const getFolders = async (username, currentPath) => {
  console.log("---> " + username);

  const response = await fetch(`${import.meta.env.VITE_RUNNER_URL}/getFolders/${username}/${currentPath}`);
  // const response = await fetch(`http://172.17.22.225:3000/getFolders/${username}`);
  console.log(response);

  if (response.status == 200) {
    return await response.json();
  }
  return { status: response.status, message: "Failed to fetch folders" };
}


const fetchCollaborators = async (wsName, email) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVLET_URL}/getCollabs?wsName=${encodeURI(wsName)}&email=${encodeURI(email)}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();

  } catch (error) {
    console.error("Fetch error:", error);

  }
};



const getWorkSpaces = async (email, recent) => {
  console.log("---> " + email);
  const token = localStorage.getItem("token");
  console.log("Token " + token);
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVLET_URL}/getwslist?email=${email}&recent=${recent}`, {
      // const response = await axios.get(`http://172.17.22.225:8080/CodeFusion_war/getwslist?email=${email}`, {
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
      }
    });
    console.log(response);

    return response?.data;
  } catch (error) {
    console.log('Error fetching workspaces:', error.response?.data || error.message);
    throw error;
  }
}


const updateProfileDB = async (updatedProfile) => {

  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/updatenkname`, updatedProfile, {
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
      }
    });

    console.log(response);
    return response?.data;

  } catch (err) {
    console.log(err)
  }
}

const createWorkspace = async (workspace) => {
  console.log("---> " + workspace);
  const token = localStorage.getItem("token");
  console.log("Token " + token);
  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/createworkspace`, workspace, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    // const response = await axios.post(`http://172.17.22.225:8080/CodeFusion_war/createworkspace`, workspace);
    console.log(response);

    if (response.status === 201) {
      return response?.data;
    }

    console.log("Error creating workspace");
    return null;
  } catch (error) {
    console.error('Error creating workspace:', error.response?.data || error.message);
    // throw error;
  }
}

const searchUser = async (username) => {
  console.log("---> " + username);
  // const response = await axios.get(`http://172.17.22.225:8080/CodeFusion_war/collabsearch?username=${username}`);
  const response = await axios.get(`${import.meta.env.VITE_SERVLET_URL}/collabsearch?username=${username}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token"),
    },
  });
  console.log(response);
  if (response.status === 200) {
    return response?.data || [];
  }
  return null;
}

const jwtLogin = async (token) => {
  return await axios.post(`${import.meta.env.VITE_SERVLET_URL}/jwtLogin`, { token: token })
    .then(res => {
      console.log(res.data);
      return res.data
    })
    .catch(err => {
      throw err
    });
}

const addCollab = async (collab) => {
  // const response = await axios.post(`http://172.17.22.225:8080/CodeFusion_war/addcollab`, {
  console.log(collab);

  const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/addcollab`, collab, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token"),
    },
  });
  console.log(response);
  if (response.status === 200) {
    return response?.data;
  }
  return null;
}

const checkws = async (wsName, email) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVLET_URL}/checkws?wsName=${encodeURIComponent(wsName)}&email=${encodeURI(email)}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });
    console.log(response);

    return response?.data.error === "Workspace does not exist";
  } catch (e) {
    console.error("Error checking ws:", e.message);
  }
  return false;

}


const saveFile = async (fileId, code) => {
  console.log(fileId, code);

  const response = await axios.post(`${import.meta.env.VITE_RUNNER_URL}/saveFile`, { fileId, code });

  if (response.status === 200) {
    console.log("Save Success: " + response.data);

    return response?.data;
  }
  console.log("Save failed: " + response.status);

  return null;
}


const removecb = async (email, wsName, cEmail) => {
  console.log(email, wsName, cEmail);

  try {
    const response = await
      axios.delete(`${import.meta.env.VITE_SERVLET_URL}/removecb?email=${encodeURIComponent(email)}&wsName=${encodeURIComponent(wsName)}&collabEmail=${encodeURIComponent(cEmail)}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

    console.log(response);

    if (response.status === 200) {
      return response?.data;
    }

  } catch (e) {
    console.error("Error removing cb:", e.message);
    throw e;
  }
  return null;
}


const pasteFileToPath = async (fileObj) => {
  console.log(fileObj);
  try {
    const response = await axios.post(`${import.meta.env.VITE_RUNNER_URL}/pasteFile`, fileObj);
    if (response.status === 200) {
      console.log("Pasting Success: " + response.data);
      return response?.data;
    }
  } catch (e) {

    console.error("Error pasting file:", e.message);
  }

}


const reNameFile = async (file) => {
  console.log("Rename File");

  try {
    const response = await axios.post(`${import.meta.env.VITE_RUNNER_URL}/rename`, file);
    if (response.status === 200) {
      console.log("Rename Success: " + response.data);
      return response?.data;
    }
    console.log("Rename failed: " + response.status);
    return response?.data;
  } catch (e) {
    console.error("Error renaming file:", e.message);
  }
  return null;

}



const deleteFileOrFolder = async (file) => {
  console.log("file --> " + file);
  const response = await axios.post(`${import.meta.env.VITE_RUNNER_URL}/deletefile`, file);
  if (response.status === 200) {
    console.log("Delete Success: " + response.data);
    return response?.data;
  }
  console.log("Delete failed: " + response.status);
  return null;
}



export {
  getFileContent, createFile, getFolders,
  getWorkSpaces, createWorkspace, searchUser,
  addCollab, fetchCollaborators, saveFile,
  checkws, pasteFileToPath, reNameFile,
  deleteFileOrFolder, removecb, updateProfileDB,
  jwtLogin
}

