import loginRoutes from "./loginRoutes";
import menuRoutes from "./menuRoutes";
import gameRoutes from "./gameRoutes";

export default app => {
  app.use("/login", loginRoutes);
  app.use("/menu", menuRoutes);
  app.use("/game", gameRoutes);
};
