import * as config from "./config";
import rooms from '../utils/gameRooms';
import users from '../utils/users';
import Timer from '../utils/timer';
import Timings from '../utils/constants/gameConstants';
import commentTypes from '../utils/constants/commentConstants';
import GameFacade from '../utils/gameFacade';


let gameTimer;
let startTimer;

export default io => {
  const gameEmitFacade = new GameFacade(io);
  io.on("connection", socket => {
    const username = socket.handshake.query.username;

    socket.on("join", (roomOnJoin, callback) => {
      const room = rooms.getGameRoom(roomOnJoin);
      const player = users.getUser(username);

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
      gameEmitFacade.emitPlayerListUpdate(room);
      gameEmitFacade.emitGameStateUpdate(state);

      callback();
    });

    socket.on("togglePlayerReady", (username, callback) => {
      const player = users.getUser(username);
      const room = rooms.getGameRoom(player.room);
      player.ready = !player.ready;

      const state = {
        ...room,
        currentPlayer: player
      };

      gameEmitFacade.emitPlayerListUpdate(room);    
      gameEmitFacade.emitGameStateUpdate(room, state);
      
      if(gameEmitFacade.isPlayersReady(room)) {
        gameEmitFacade.emitStartGameTimer(room);
        gameEmitFacade.emitNewComment(room, commentTypes.GREET);
        
        startTimer = new Timer(
          config.SECONDS_TIMER_BEFORE_START_GAME,
          (remained) => gameEmitFacade.emitStartTimerDecrease(room, remained),
          () => startGame(room)
        );
      }
      callback();
    });

    socket.on("gameInitialization", (text) => {
      const player = users.getUserByRoom(socket.id);
      player.setGameProgressInitText(text);
    });

    socket.on("keyPress", (key) => {
      const player = users.getUserByRoom(socket.id);
      const room = rooms.getGameRoom(player.room);
        
      if(gameEmitFacade.isPlayerPrintCorrectLetter(player, key)) {
        player.setGameProgressPrintedText(key);
        if(gameEmitFacade.isPlayerOnHalfRace(player)) {
          gameEmitFacade.emitNewComment(room, commentTypes.HALF_RACE, { player: player });
        }

        if(gameEmitFacade.isPlayerFinished(player)) {
          player.setCompletedTime(gameTimer.getRemainedTime());          
          gameEmitFacade.emitNewComment(room, commentTypes.PLAYER_FINISH, { player: player });
        }
        
        gameEmitFacade.emitPlayerProgressUpdate(room, player);
        
        if(gameEmitFacade.isAllPlayersFinished(room)) {
          gameTimer.stopTimer();
          
          gameEmitFacade.emitNewComment(room, commentTypes.RACE_END);
          gameEmitFacade.emitGameEnd(room);
          
          room.playing = false;
          room.players.forEach(player => player.resetGameAttributes());
          gameEmitFacade.emitPlayerListUpdate(room);
        }
      }
    });

    socket.on("disconnect", () => {
      const player = users.getUserByRoom(socket.id);
      
      if(player) {
        const room = rooms.getGameRoom(player.room);
        
        rooms.exitGameRoom(room.name, player.username);
        player.resetGameAttributes();
        player.clearRoom();
        player.clearSocketId();
        
        gameEmitFacade.emitPlayerListUpdate(room);
        
        if(!room.players.length) {
          rooms.closeGameRoom(room.name);
        }

        if(gameEmitFacade.isPlayersReady(room)) {
          gameEmitFacade.emitStartGameTimer(room);
          gameEmitFacade.emitNewComment(room, commentTypes.GREET);
          
          startTimer = new Timer(
            config.SECONDS_TIMER_BEFORE_START_GAME,
            (remained) => gameEmitFacade.emitStartTimerDecrease(room, remained),
            () => startGame(room)
          );
        }
      }
    });
        
    const startGame = (room) => {
      room.playing = true;
      gameEmitFacade.emitGameStart(room);
      
      gameTimer = new Timer(
        config.SECONDS_FOR_GAME,
        (remained) => {
          if(remained && remained % Timings.PART_OF_RACE === 0) {
            gameEmitFacade.emitNewComment(room, commentTypes.PART_RACE, {remainedTime: remained});
          }
          gameEmitFacade.emitGameTimerDecrease(room, remained);
        },
        () => {
          gameEmitFacade.emitGameEnd(room)
          
          room.playing = false;
          room.players.forEach(player => player.resetGameAttributes());
          gameEmitFacade.emitPlayerListUpdate(room);
        }
      );
    };
  });

};
