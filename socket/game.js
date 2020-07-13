import * as config from "./config";
import { texts } from '../data';
import rooms from '../utils/gameRooms';
import users from '../utils/users';
import Timer from '../utils/timer';

let gameTimer;
let startTimer;

export default io => {
  io.on("connection", socket => {
    const username = socket.handshake.query.username;

    socket.on('join', (params, callback) => {
      
      const room = rooms.getGameRoom(params.room);
      const player = users.getUser(params.username);

      player.setSocketId(socket.id);
      player.setRoom(room.name);
      
      if(room.players) {
        if(room.players.length >= config.MAXIMUM_USERS_FOR_ONE_ROOM) {
          return callback('got maximum players');
        }
        if(room.players.some(connected => connected.username === player.username)) {
          return callback('user already in room');
        }
      }

      rooms.enterGameRoom(room.name, player);
      const state = {
        ...room,
        currentPlayer: player
      };
      socket.join(room.name);
      io.to(room.name).emit('updatePlayerList', room.players);
      io.to(room.name).emit('updateGameState', state);

      callback();
    });

    socket.on('togglePlayerReady', (username, callback) => {
      const player = users.getUser(username);
      const room = rooms.getGameRoom(player.room);
      player.ready = !player.ready;

      const state = {
        ...room,
        currentPlayer: player
      };

      io.to(room.name).emit('updatePlayerList', room.players);
      io.to(room.name).emit('updateGameState', state);
      
      if(room.players.length > 1 && room.players.every(player => player.ready)) {
        io.to(room.name).emit('startGameTimer', config.SECONDS_TIMER_BEFORE_START_GAME);
        
        startTimer = new Timer(
          config.SECONDS_TIMER_BEFORE_START_GAME,
          (remained) => emitStartTimerDecrease(room, remained),
          () => startGame(room)
        );
      }
      callback();
    });

    socket.on('gameInitialization', (text) => {
      const player = users.getUserByRoom(socket.id);
      player.setGameProgressInitText(text);
    });

    socket.on('keyPress', (key) => {
      const player = users.getUserByRoom(socket.id);
      const room = rooms.getGameRoom(player.room);
        
      if(player.getText()[player.getCurrentPosition()] === key) {
        player.setGameProgressPrintedText(key);
        if(player.getGameProgress() === 100) {
          player.setCompletedTime(gameTimer.getRemainedTime());
        }
        io.to(room.name).emit('playerProgressUpdate', player);
        
        if(room.players.every(player => player.getGameProgress() === 100)) {
          gameTimer.stopTimer();
          emitGameEnd(room, room.players.map(player => ({
            username: player.username,
            remained: player.gameProgress.completedAt
          })));
          
          room.playing = false;
          room.players.forEach(player => player.resetGameAttributes());
          io.to(room.name).emit('updatePlayerList', room.players);
        }
      }
    })

    socket.on('disconnect', () => {
      const player = users.getUserByRoom(socket.id);
      
      if(player) {
        const room = rooms.getGameRoom(player.room);
        
        rooms.exitGameRoom(room.name, player.username);
        player.resetGameAttributes();
        player.clearRoom();
        player.clearSocketId();
        io.to(room.name).emit('updatePlayerList', room.players);
        
        if(!room.players.length) {
          rooms.closeGameRoom(room.name);
        }

        if(room.players.length > 1 && room.players.every(player => player.ready)) {
          io.to(room.name).emit('startGameTimer', config.SECONDS_TIMER_BEFORE_START_GAME);
          startTimer = new Timer(
            config.SECONDS_TIMER_BEFORE_START_GAME,
            (remained) => emitStartTimerDecrease(room, remained),
            () => startGame(room)
          );
        }
      }
    });
        
    const startGame = (room) => {
      room.playing = true;
      emitGameStart(room);
      gameTimer = new Timer(
        config.SECONDS_FOR_GAME,
        (remained) => emitGameTimerDecrease(room, remained),
        () => {
          emitGameEnd(room, room.players.map(player => ({
            username: player.username,
            remained: player.gameProgress.completedAt
          })));
          room.playing = false;
          room.players.forEach(player => player.resetGameAttributes());
          io.to(room.name).emit('updatePlayerList', room.players);
        }
      );
    };

    const emitGameTimerDecrease = (room, time) => {
      io.to(room.name).emit('updateGameTimer', time);
    };

    const emitStartTimerDecrease = (room, time) => {
      io.to(room.name).emit('updateStartTimer', time);
    };

    const emitGameStart = (room) => {
      const text = getRandomText();
      io.to(room.name).emit('startGame', text, config.SECONDS_FOR_GAME);
    };

    const emitGameEnd = (room, playerPositions) => {
      io.to(room.name).emit('endGame', playerPositions);
    }
  });
};

const getRandomText = () => texts[
  Math.floor(Math.random() * texts.length)
];