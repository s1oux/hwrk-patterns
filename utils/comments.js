import commentTypes from './constants/commentConstants';

// Factory pattern implementation
class Comments {
  constructor() {

  }
  createComment(type, attributes) {
    switch(type) {
      case commentTypes.GREET:
        return `
          Ladies & Gentlemen. Today we're waiting for a greet race. World's largest competition between:
          ${attributes.players.map(player => `- "${player.username}"`).join(',\n')}.
          LET THE GREAT SHOW BEGIN.
        `;
      case commentTypes.PART_RACE:
        return `
        On the ${attributes.time} second of the race we can see such a wonderful situation between competitors:
        ${attributes.players.map((player, index) => `#${index + 1} - ${player.username}`).join(',\n')}.
        But race goes on, let's wait for an unpredictable result!!
      `;
      case commentTypes.HALF_RACE:
        return `
          Meanwhile ${attributes.player.username} has done first half of the journey. Let's see the whole situation:
          ${attributes.players.map((player, index) => `#${index + 1} position - ${player.username}`).join(',\n')}.
          Can't wait for a final result...
        `;
      case commentTypes.PLAYER_FINISH:
        return `
          Let's congratulate ${attributes.player.username} with the end of the race on ${attributes.position} place!
        `;
      case commentTypes.RACE_END:
        return `
        Aaaand our race finally ends. Let's see the result of these insane competition:
        ${attributes.players.map((player, index) => index < 3 ? `#${index + 1}  - ${player.username}, with ${player.gameProgress.completedAt} seconds spent` : '').join(',\n')}.
        That's all folks! See you on the next race!
      `;
    }
  }
}

export default new Comments();