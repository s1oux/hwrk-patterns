import rooms from '../utils/gameRooms';

export default io => {
  io.on("connection", socket => {
    const username = socket.handshake.query.username;

    socket.on("join", (callback) => {
      
      const freeRooms = rooms.getGameRooms();

      io.emit("updateRoomList", freeRooms);
      callback();
    });

    socket.on("createRoom", (room, callback) => {
      const createdRoom = rooms.createGameRoom(room);
      if(!createdRoom) {
        return callback(`Room with such name (${room}) already exists.`);
      } else {
        io.emit("roomCreated", createdRoom);
        io.emit("updateRoomList", rooms.getGameRooms());
        callback();
      }
    });

    socket.on("disconnect", () => {
      console.log(`${username} disconnected`);
    });

  });
};