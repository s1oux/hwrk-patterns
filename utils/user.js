export default class User {
  constructor(username) {
    this.username = username;
    this.room = '';
    this.socketId = 0;
    this.game = 0;
    this.ready = false;
    this.gameProgress = {
      text: '',
      rightPrinted: '',
      currentPosition: 0,
      completedAt: 60
    }
  }

  setSocketId(id) {
    this.socketId = id;
  }

  setRoom(room) {
    this.room = room;
  }

  clearSocketId() {
    this.socketId = 0;
  }

  clearRoom() {
    this.room = '';
  }

  setGameProgressInitText(text) {
    this.gameProgress = {
      ...this.gameProgress,
      text: text
    };
  }

  setGameProgressPrintedText(letter) {
    this.gameProgress = {
      ...this.gameProgress,
      rightPrinted: this.gameProgress.rightPrinted + letter,
      currentPosition: this.gameProgress.currentPosition + 1
    };
  }

  setCompletedTime(remainedTime) {
    this.gameProgress = {
      ...this.gameProgress,
      completedAt: remainedTime
    };
  }

  getGameProgress() {
    return (this.gameProgress.rightPrinted.length / this.gameProgress.text.length) * 100;
  }

  getText() {
    return this.gameProgress.text;
  }

  getCurrentPosition() {
    return this.gameProgress.currentPosition;
  }

  clearGameProgress() {
    this.gameProgress = {
      text: '',
      rightPrinted: '',
      currentPosition: 0,
      completedAt: 60
    }
  }

  resetGameAttributes() {
    this.ready = false;
    this.clearGameProgress();
  }
}