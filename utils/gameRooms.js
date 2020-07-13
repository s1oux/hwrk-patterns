import { MAXIMUM_USERS_FOR_ONE_ROOM } from '../socket/config';

class GameRooms {
  constructor () {
    this.gameRooms = [];
  }

  createGameRoom(name){
    if(this.getGameRoom(name)) {
      return false;
    } else {
      const gameRoom = {
        name,
        players: [],
        playing: false
      };
      this.gameRooms.push(gameRoom);
      return gameRoom;
    }
  }

  enterGameRoom(name, user) {
    const gameRoomToEnter = this.getGameRoom(name);
    if(gameRoomToEnter) {
      gameRoomToEnter.players.push(user);
    }
    return gameRoomToEnter;
  }

  exitGameRoom(name, user) {
    const gameRoomToExit = this.getGameRoom(name);
    if(gameRoomToExit) {
      gameRoomToExit.players = gameRoomToExit.players.filter(player => player.username !== user);
    }
    return gameRoomToExit;
  }

  closeGameRoom(name) {
    var gameRoomToRemove = this.getGameRoom(name);

    if(gameRoomToRemove) {
      this.gameRooms = this.gameRooms.filter((room) => room.name !== name);
    }

    return gameRoomToRemove;
  }

  getGameRoom(name) {
    return this.gameRooms.filter((room) => room.name === name)[0];
  }

  getGameRooms() {
    return this.gameRooms.filter(room => !room.playing && !(room.players.length >= MAXIMUM_USERS_FOR_ONE_ROOM))
  }

  getAll() {
    return this.gameRooms;
  }
}

export default new GameRooms();