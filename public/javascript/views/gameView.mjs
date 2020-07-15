import {
  createElement,
  getElement,
  showElement,
  hideElement,
  addClass,
  createModal,
  removeClass,
  clearContainer
} from '../helpers/uiHelper.mjs';

export const renderGameContainer = (state, toggleReadyHandler) => {
  if(state.playing) {

  } else {
    const toggleReadyBtn = getElement("toggle-ready__btn");
    toggleReadyBtn.addEventListener("click", toggleReadyHandler);    
  }
};

export const startGame = (player, text, initTime, keyPressHandler) => {
  hideElement(getElement("back-menu__btn"));
  hideElement(getElement("start-timer"));
  const gameArea = getElement("game-area");
  showElement(gameArea);
  const gameText = createElement({
    tagName: "span",
    className: "game__text",
    attributes: {
      id: `game-text__${player}`
    }
  })
  gameText.innerText = text;
  getElement("game-timer").innerText = initTime;
  gameArea.append(gameText);
  clearContainer(getElement("comment-container"));

  window.addEventListener("keypress", keyPressHandler);
};

export const endGame = (player, results, keyPressHandler) => {
  getElement("game-timer").innerText = '';
  const text = getElement(`game-text__${player}`);
  text.remove();
  hideElement(getElement("game-area"));  
  showElement(getElement("toggle-ready__btn"));
  showElement(getElement("back-menu__btn"));
  // displayResults(results);
  window.removeEventListener("keypress", keyPressHandler);
}

export const renderCommentContainer = () => {
  const commentContainer = getElement("comment-container");
  clearContainer(commentContainer);
  showElement(commentContainer);
};

export const showComment = (commentBody) => {
  const commentContainer = getElement("comment-container");
  clearContainer(commentContainer);
  const comment = createElement({
    tagName: "div",
    className: "comment"
  });
  comment.innerText = commentBody;
  commentContainer.appendChild(comment);
}

const displayResults = (results) => {
  const resultsContainer = createElement({
    tagName: "div"
  });
  const resultElements = results.map(result => {
    const resultElement = createElement({
      tagName: "div"
    });
    resultElement.innerText = `${result.username} finished in ${result.remained}s.`;
    return resultElement;
  });

  resultElements.forEach(resultElement => resultsContainer.append(resultElement));

  const modalContainer = getElement("root");
  const modal = createModal({
    title: "Results",
    bodyElement: resultsContainer,
    onClose: () => {}
  });
  modalContainer.append(modal);
};

export const hideToggleReadyBtn = () => {
  addClass(getElement("toggle-ready__btn"), "display-none");
};

export const showTimer = (seconds) => {
  const timer = getElement("start-timer");
  removeClass(timer, "display-none");
  timer.innerText = seconds;
};

export const updateStartTimer = seconds => {
  getElement("start-timer").innerText = seconds;
};

export const updateGameTimer = seconds => {
  getElement("game-timer").innerText = seconds;
}

export const updatePlayerList = (players, currentPlayer) => {
  const playersList = getElement("playerContainer");
  const playersCards = players.map(player => createPlayer(
    player.username === currentPlayer ? {
      ...player,
      ownname: currentPlayer.concat(" (you)")
    } : player)
  );
  clearContainer(playersList);
  playersCards.forEach(playerCard => playersList.appendChild(playerCard));
  return playersList;
};

export const updateReadyBtn = (player) => {
  const readyBtnElement = getElement(`toggle-ready__btn`);
  const readySign = getElement(`ready-sign__${player.username}`);
  removeClass(readySign, player.ready ? "not_ready" : "ready");
  addClass(readySign, player.ready ? "ready" : "not_ready");
  readyBtnElement.innerText = player.ready ? "not ready" : "ready";
};

export const updateProgressBar = (player) => {
  const progress = Math.floor((player.gameProgress.rightPrinted.length / player.gameProgress.text.length) * 100);
  
  getElement(`progress-bar__${player.username}`).style.width = `${progress}%`;
};

export const updateTextEmphasize = (player) => {
  const text = getElement(`game-text__${player.username}`);
  if(text) {
    const initText = player.gameProgress.text;
    const printed = player.gameProgress.rightPrinted;
    const index = player.gameProgress.positionInText;
    text.innerText = "";

    text.innerHTML = `
      <span class="coloured">${printed}</span>
      <span class="underlined">${initText.substring(index, index + 1)}</span>
      <span>${initText.substring(index + 1)}</span>
    `;
  }
}

const createPlayer = (player) => {
  const playerElement = createElement({
    tagName: "div",
    className: "players__player"
  });

  const titleAndReadySign = createElement({
    tagName: "div"
  });

  const title = createElement({
    tagName: "span",
    className: "player__title"
  }).innerText = player.ownname || player.username;

  const ready = createElement({
    tagName: "label",
    className: `ready-sign ${player.ready ? "ready" : "not_ready"}`,
    attributes: {
      id: `ready-sign__${player.username}`
    }
  });

  const progressBarContainer = createElement({
    tagName: "div",
    className: "progress-bar__container",
    attributes: {
      id: `progress-bar__container__${player.username}`
    }
  });
  const progressBar = createElement({
    tagName: "div",
    className: "progress-bar",
    attributes: {
      id: `progress-bar__${player.username}`
    }
  });

  progressBarContainer.append(progressBar);
  titleAndReadySign.append(ready);  
  titleAndReadySign.append(title);

  playerElement.append(titleAndReadySign);
  playerElement.append(progressBarContainer);

  return playerElement;
};
