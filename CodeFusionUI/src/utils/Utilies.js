

function mysqlNow() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// const loggedOut = () => {
//   localStorage.removeItem('token');
//   navigator('/loginsignup');
// }

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const capitalize = (name) => {
  console.log("Capitalize : " + name);

  return name.charAt(0).toUpperCase() + name.slice(1);
}

const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
}

export { mysqlNow, getInitials, capitalize, getRandomColor };