import { getByQuery } from "../helpers/requestHelper.mjs";

export const getGame = async (query) => {
  await getByQuery('game', query);
};
