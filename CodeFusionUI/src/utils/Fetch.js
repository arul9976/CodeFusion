

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

const createFile = async () => {
  const response = await fetch(`http://172.17.22.225:3000/getFileContent/${encodeURIComponent(path)}`);

}

export { getFileContent }