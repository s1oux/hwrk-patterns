import {
  updatePlayerList,
  renderGameContainer,
  hideToggleReadyBtn,
  showTimer,
  updateStartTimer,
  updateGameTimer,
  updateReadyBtn,
  updateTextEmphasize,
  updateProgressBar,
  startGame,
  endGame
} from './views/gameView.mjs';

const username = sessionStorage.getItem("username");

const url = `${window.location.origin}${window.location.pathname}`;

if(!username) {
  window.location.replace('/login');
}

const socket = io(url);

let gameState = {
  playing: false
};

const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get('room');
const params = {
  username,
  room
};

socket.on('connect', () => {
  socket.emit('join', params, (err) => {
    if(err) {
      alert(err);
      window.location.replace('/menu');
    } else {
      renderGameContainer(gameState, () => {

      }, (event) => {
        socket.emit('togglePlayerReady', username, (err) => {
          if(err) {
            alert(err);
          } else {
            updateReadyBtn(gameState.currentPlayer);
          }
        })
      });
    }
  });
});

socket.on('updateGameState', state => {
  updateState(state);
});

socket.on('updatePlayerList', (players) => {
  updatePlayerList(players, username);
});

socket.on('startGameTimer', (time) => {
  hideToggleReadyBtn();
  showTimer(time);
});

socket.on('updateStartTimer', (remainedTime) => {
  updateStartTimer(remainedTime);
});

socket.on('updateGameTimer', (remainedTime) => {
  updateGameTimer(remainedTime);
});

socket.on('startGame', (text, time) => {
  startGame(username, text, time, keyPressHandler);
  socket.emit('gameInitialization', text);
});

socket.on('endGame', (results) => {
  endGame(username, results.map(result => `${result.username} = ${result.remained}`), keyPressHandler);
});

socket.on('playerProgressUpdate', (player) => {
  updateProgressBar(player);
  updateTextEmphasize(player);
});

socket.on('disconnect', () => {
  console.log(`'${username}' disconnected from '${room}'`);
});


const updateState = state => {
  gameState = {
    ...gameState,
    ...state
  };
}

const keyPressHandler = (event) => {
  socket.emit('keyPress', event.key);
}