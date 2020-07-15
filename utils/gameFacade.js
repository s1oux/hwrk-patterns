import * as config from '../socket/config';
import { texts } from '../data';
import Comments from './comments';
import commentTypes from './constants/commentConstants';

// Facade pattern implementation
class GameFacade {
  constructor(io) {
    this.io = io;
  }

  emitGameStateUpdate (room, state) {
    this.io.to(room.name).emit("updateGameState", state);
  }
  
  emitPlayerListUpdate (room) {
    this.io.to(room.name).emit("updatePlayerList", room.players);
  }

  emitStartGameTimer(room) {
    this.io.to(room.name).emit("startGameTimer", config.SECONDS_TIMER_BEFORE_START_GAME);
  }

  emitGameTimerDecrease (room, time) {
    this.io.to(room.name).emit("updateGameTimer", time);
  }

  emitStartTimerDecrease (room, time) {
    this.io.to(room.name).emit("updateStartTimer", time);
  }

  emitGameStart (room) {
    const text = this.getRandomText();
    this.io.to(room.name).emit("startGame", text, config.SECONDS_FOR_GAME);
  };
  
  emitNewComment(room, type, options = {}) {
    switch(type) {
      case commentTypes.GREET:
        this.io.to(room.name).emit(
          "newComment", Comments.createComment(
            commentTypes.GREET, {
              players: room.players
            }
          )
        );
        break;
      case commentTypes.RACE_END:
        this.io.to(room.name).emit(
          "newComment", Comments.createComment(
            commentTypes.RACE_END, {
              players: this.sortPlayersByCompletion(room.players)
            }
          )
        );
        break;
      case commentTypes.PLAYER_FINISH:
        this.io.to(room.name).emit(
          "newComment", Comments.createComment(
            commentTypes.PLAYER_FINISH, {
              player: options.player,
              position: room.players
                .sort(this.completionTimeFilter)
                .indexOf(options.player) + 1
          })
        );
        break;
      case commentTypes.HALF_RACE:
        this.io.to(room.name).emit(
          "newComment", Comments.createComment(
            commentTypes.HALF_RACE, {
              players: this.sortPlayersByTextDone(room.players),
              player: options.player
            }
          )
        );
        break;
      case commentTypes.PART_RACE:
        this.io.to(room.name).emit(
          "newComment", Comments.createComment(
            commentTypes.PART_RACE, {
              time: options.remainedTime,
              players: this.sortPlayersByTextDone(room.players)
            }
          )
        );
        break;
    };
  }

  emitPlayerProgressUpdate (room, player) {
    this.io.to(room.name).emit("playerProgressUpdate", player);
  }

  emitGameEnd (room) {
    const playerPositions = room.players.map(player => ({
      username: player.username,
      remained: player.gameProgress.completedAt
    }));
    this.io.to(room.name).emit("endGame", playerPositions);
  }

  isPlayersReady (room) {
    return room.players.length > 1 && room.players.every(player => player.ready);
  }

  isPlayerPrintCorrectLetter (player, key) {
    return player.getText()[player.getPositionInText()] === key;
  }

  isPlayerOnHalfRace (player) {
    return player.getPositionInText() === Math.floor(player.getText().length / 2);
  }

  isPlayerFinished(player) {
    return player.getGameProgress() === 100;
  }

  isAllPlayersFinished (room) {
    return room.players.every(player => player.getGameProgress() === 100);
  }
  
  getRandomText () {
    return texts[Math.floor(Math.random() * texts.length)];
  }

  sortPlayersByTextDone (players) {
    return players.sort(this.textDoneFilter);
  }

  sortPlayersByCompletion (players) {
    return players.sort(this.completionTimeFilter);
  }

  completionTimeFilter (fPlayer, sPlayer) {
    return fPlayer.getCompletionTime() - sPlayer.getCompletionTime();
  }

  textDoneFilter (fPlayer, sPlayer) {
    return sPlayer.getPositionInText() - fPlayer.getPositionInText();
  }
}

export default GameFacade;