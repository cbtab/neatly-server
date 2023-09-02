import express, { Express, Response, Request } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { roomRouter } from "./apps/roomRouter.ts";
import authRouter from "./apps/auth.ts";

const init = async () => {
  const app: Express = express();
  const port = 4000;
  app.use(cors());
  app.use(bodyParser.json());

  app.use("/room", roomRouter);
  app.use("/auth", authRouter);

  app.get("/", (req: Request, res: Response) => {
    res.send("server is running");
  });

  app.get("*", (req: Request, res: Response) => {
    res.status(404).send("Not Found");
  });

  app.listen(port, () => {
    console.log(`server is running port ${port}`);
  });
};

init();
