import { updateRoomsList } from './views/menuView.mjs';

const username = sessionStorage.getItem("username");

const url = `${window.location.origin}${window.location.pathname}`;

if(!username) {
  window.location.replace("/login");
}

const socket = io(url, { query: { username } });

const createRoomBtn = document.getElementById("create-room__btn");

socket.on("connect", () => {
  socket.emit("join", (err) => {
    if(err) {
      alert(err);
      window.location.replace("/login");
    } else {
      console.log(`User '${username}' joined successfully.`);
    }
  });
});

socket.on("updateRoomList", (rooms) => {
  updateRoomsList(rooms);
});

socket.on("disconnect", () => {
  console.log("disconnected from menu");
});

createRoomBtn.addEventListener("click", async () => {
  const roomName = prompt("Enter new room name");
  
  if(!roomName) {
    return;
  }

  socket.emit("createRoom", roomName, (err) => {
    if(err) {
      alert(err);
    } else {
      console.log("creation successfull");
    }
  });

  socket.on("roomCreated", (createdRoom) => {
    localStorage.setItem("room", createdRoom.name);
    window.location.replace("/game");
  })
});