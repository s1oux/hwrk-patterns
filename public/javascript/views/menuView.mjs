import {
  createElement,
  createParagraphElement,
  getElement,
  clearContainer
} from '../helpers/uiHelper.mjs';

export const updateRoomsList = (rooms) => {
  const roomContainer = getElement("rooms-page__container");
  clearContainer(roomContainer);
  const roomsElement = createRooms(rooms);
  roomContainer.appendChild(roomsElement);
};

export const createRooms = (rooms) => {
  const selectRoom = createRoomsSelector();
  const container = createElement({
    tagName: "div",
    className: "rooms__root"
  });
  const roomsList = createElement({
    tagName: "div",
    className: "rooms__list",
    attributes: {
      id: "rooms-list"
    }
  });
  const roomElements = rooms.map((room) => createRoom(room, selectRoom));

  roomsList.append(...roomElements);
  container.append(roomsList);

  return container
};

const createRoom = (room, selectRoom) => {
  const roomElement = createElement({
    tagName: "div",
    className: "rooms__room"
  });

  const title = createParagraphElement(room.name);
  const freePlaces = createParagraphElement(
    `${room.players.length} / 5`
    );

  roomElement.append(title);
  roomElement.append(freePlaces);

  const onClick = event => selectRoom(event, room);
  roomElement.addEventListener("click", onClick, false);

  return roomElement;
}

const createRoomsSelector = () => {
  return (event, room) => {
    localStorage.setItem("room", room.name);
    window.location.replace("/game");
  };
};

