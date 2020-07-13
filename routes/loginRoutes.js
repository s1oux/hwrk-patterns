import { Router } from "express";
import path from "path";

import { HTML_FILES_PATH } from "../config";
import users from "../utils/users";


const router = Router();

router
  .get("/", (req, res) => {
    const page = path.join(HTML_FILES_PATH, "login.html");
    res.sendFile(page);
  })
  .post("/", (req, res) => {
    const { username } = req.body;
    if(users.addUser(username)) {
      res.send({ success: true, username });
    } else {
      res.status(403).send({
        success: false,
        message: "User already exists."
      });
    }
  });

export default router;
