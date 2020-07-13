import { get, post } from "../helpers/requestHelper.mjs";

export const getRooms = async () => {
  const response = await get('menu/rooms');
  return response.rooms;
};

export const createRoom = async (name) => {
  const response = await post('menu/rooms', { roomName: name });
  if(response.success) {
    return response.createdRoom;
  } else {
    alert(response.message);
    return false;
  }
}