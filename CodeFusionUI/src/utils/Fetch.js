import axios from "axios";


const getFileContent = async (path) => {
  console.log(path);

  try {
    // const response = await fetch(`http://172.17.22.225:3000/list-all-files/${user}`);
    // const response = await fetch(`http://localhost:3000/getFileContent/${encodeURIComponent(path)}`);
    const response = await fetch(`http://172.17.22.225:3000/getFileContent/${encodeURIComponent(path)}`);
    const data = await response.json();
    console.log("FileContent " + data);

    // if (data) {
    return data;

  } catch (error) {
    console.error("Error fetching files:", error);
  }
  return null;
}

const createFile = async (username, fileData) => {
  console.log(username, fileData);
  // const response = await fetch(`http://localhost:3000/createOrUpdateFile/${encodeURIComponent(username)}`, {
    const response = await fetch(`http://172.17.22.225:3000/createOrUpdateFile/${encodeURIComponent(username)}`, {
    method: "POST",
    body: JSON.stringify(fileData),
  });

  if (response.status == 201) {
    return await response.json();
  }
  return { status: response.status, message: "File Creation Failed" };

}


const getFolders = async (username) => {
  console.log("---> " + username);

  // const response = await fetch(`http://localhost:3000/getFolders/${username}`);
  const response = await fetch(`http://172.17.22.225:3000/getFolders/${username}`);
  console.log(response);

  if (response.status == 200) {
    return await response.json();
  }
  return { status: response.status, message: "Failed to fetch folders" };
}



const getWorkSpaces = async (email) => {
  console.log("---> " + email);
  const token = localStorage.getItem("token");
  console.log("Token " + token);
  try {
    // const response = await axios.get(`http://localhost:8080/CodeFusion_war/getwslist?email=${email}`, {
    const response = await axios.get(`http://172.17.22.225:8080/CodeFusion_war/getwslist?email=${email}`, {
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
    // const response = await axios.post(`http://localhost:8080/CodeFusion_war/createworkspace`, workspace);
    const response = await axios.post(`http://172.17.22.225:8080/CodeFusion_war/createworkspace`, workspace);
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
  const response = await axios.get(`http://172.17.22.225:8080/CodeFusion_war/collabsearch?username=${username}`);
  // const response = await axios.get(`http://localhost:8080/CodeFusion_war/collabsearch?username=${username}`);
  console.log(response);
  if (response.status === 200) {
    return response?.data || [];
  }
  return null;
}

export { getFileContent, createFile, getFolders, getWorkSpaces, createWorkspace, searchUser }

