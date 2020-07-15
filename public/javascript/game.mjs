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
  endGame,
  showComment,
  renderCommentContainer
} from './views/gameView.mjs';

const username = sessionStorage.getItem("username");

const url = `${window.location.origin}${window.location.pathname}`;

if(!username) {
  window.location.replace("/login");
}

const socket = io(url, { query: { username } });

let gameState = {
  playing: false
};

socket.on("connect", () => {
  const room = localStorage.getItem("room");

  socket.emit("join", room, (err) => {
    if(err) {
      alert(err);
      window.location.replace("/menu");
    } else {
      renderGameContainer(gameState, (event) => {
        socket.emit("togglePlayerReady", username, (err) => {
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

socket.on("updateGameState", state => {
  updateState(state);
});

socket.on("updatePlayerList", (players) => {
  updatePlayerList(players, username);
});

socket.on("startGameTimer", (time) => {
  hideToggleReadyBtn();
  renderCommentContainer();
  showTimer(time);
});

socket.on("updateStartTimer", (remainedTime) => {
  updateStartTimer(remainedTime);
});

socket.on("updateGameTimer", (remainedTime) => {
  updateGameTimer(remainedTime);
});

socket.on("startGame", (text, time) => {
  startGame(username, text, time, keyPressHandler);
  socket.emit("gameInitialization", text);
});

socket.on("newComment", (commentMessage) => {
  showComment(commentMessage);
});

socket.on("endGame", (results) => {
  endGame(username, results, keyPressHandler);
});

socket.on("playerProgressUpdate", (player) => {
  updateProgressBar(player);
  updateTextEmphasize(player);
});

socket.on("disconnect", () => {
  console.log(`'${username}' disconnected`);
});

const updateState = state => {
  gameState = {
    ...gameState,
    ...state
  };
}

const keyPressHandler = (event) => {
  socket.emit("keyPress", event.key);
}