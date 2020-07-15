import Timings from './constants/gameConstants';

export default class Timer {
  constructor(initTime, timerAction, finishAction) {
    this.secondsRemained = initTime;
    this.countDown = setInterval(() => {
      this.secondsRemained--;
      timerAction(this.secondsRemained);
      if(this.secondsRemained <= 0) {
        this.stopTimer();
        finishAction();
      }
    }, Timings.SECOND_IN_MS);
  }

  stopTimer() {
    clearInterval(this.countDown);
  }

  getRemainedTime() {
    return this.secondsRemained;
  }
}