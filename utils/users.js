import User from './user';

class Users {
  constructor () {
    this.users = [];
  }

  addUser(username) {
    if(this.getUser(username)) {
      return false;
    } else {
      const user = new User(username);
      this.users.push(user);
      return user;
    }
  }

  removeUserByName(username) {
    const userToRemove = this.getUser(username);
    
    if(userToRemove) {
      this.users = this.users.filter((user) => user.username !== username);
    }
    
    return userToRemove;
  }

  removeUserById(id) {
    const userToRemove = this.getUserByRoom(id);
    if(!userToRemove) {
      return false;
    } 
    userToRemove.clearSocketId();
    userToRemove.clearRoom();
    return userToRemove;
  }

  getUserByRoom(id) {
    return this.users.filter((user) => user.socketId === id)[0];
  }

  getUser(username) {
    return this.users.filter((user) => user.username === username)[0];
  }
}

export default new Users();