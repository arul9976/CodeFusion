import axios from "axios";


const getFileContent = async (path) => {
  console.log(path);

  try {
    // const response = await fetch(`http://172.17.22.225:3000/list-all-files/${user}`);
    const response = await fetch(`${import.meta.env.VITE_RUNNER_URL}/getFileContent/${encodeURIComponent(path)}`);
    // const response = await fetch(`http://172.17.22.225:3000/getFileContent/${encodeURIComponent(path)}`);
    const data = await response.json();
    console.log("FileContent " + data);

    // if (data) {
    return data;

  } catch (error) {
    console.error("Error fetching files:", error);
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
    const response = await fetch(`${import.meta.env.VITE_SERVLET_URL}/getCollabs?wsName=${encodeURI(wsName)}&email=${encodeURI(email)}`);

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
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    console.log(response);

    return response?.data;
  } catch (error) {
    console.error('Error fetching workspaces:', error.response?.data || error.message);
    // throw error;
  }
}

const createWorkspace = async (workspace) => {
  console.log("---> " + workspace);
  const token = localStorage.getItem("token");
  console.log("Token " + token);
  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/createworkspace`, workspace);
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
  const response = await axios.get(`${import.meta.env.VITE_SERVLET_URL}/collabsearch?username=${username}`);
  console.log(response);
  if (response.status === 200) {
    return response?.data || [];
  }
  return null;
}

const addCollab = async (collab) => {
  // const response = await axios.post(`http://172.17.22.225:8080/CodeFusion_war/addcollab`, {
  console.log(collab);

  const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/addcollab`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: collab,
  });
  console.log(response);
  if (response.status === 200) {
    return response?.data;
  }
  return null;
}

const checkws = async (wsName, email) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVLET_URL}/checkws?wsName=${encodeURIComponent(wsName)}&email=${encodeURI(email)}`);
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
export {
  getFileContent, createFile, getFolders,
  getWorkSpaces, createWorkspace, searchUser,
  addCollab, fetchCollaborators, saveFile,
  checkws
}

