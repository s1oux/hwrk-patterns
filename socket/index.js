import menu from './menu';
import game from './game';

export default io => {
  game(io.of("/game"));
  menu(io.of("/menu"));
};