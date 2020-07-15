import Timings from './constants/gameConstants';

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
      positionInText: 0,
      completedAt: Timings.RACE_TIME
    }
  }

  setSocketId(id) {
    this.socketId = id;
  }

  setRoom(room) {
    this.room = room;
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
      positionInText: this.gameProgress.positionInText + 1
    };
  }

  setCompletedTime(remainedTime) {
    this.gameProgress = {
      ...this.gameProgress,
      completedAt: (Timings.RACE_TIME - remainedTime)
    };
  }

  getGameProgress() {
    return (this.gameProgress.rightPrinted.length / this.gameProgress.text.length) * 100;
  }

  getText() {
    return this.gameProgress.text;
  }

  getPositionInText() {
    return this.gameProgress.positionInText;
  }

  getCompletionTime() {
    return this.gameProgress.completedAt;
  }

  clearSocketId() {
    this.socketId = 0;
  }

  clearRoom() {
    this.room = '';
  }

  clearGameProgress() {
    this.gameProgress = {
      text: '',
      rightPrinted: '',
      positionInText: 0,
      completedAt: Timings.RACE_TIME
    }
  }

  resetGameAttributes() {
    this.ready = false;
    this.clearGameProgress();
  }
}