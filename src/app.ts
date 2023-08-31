import express, { Express, Response } from "express";
// import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";

const init = () => {
  const app: Express = express();
  const port = 4000;

  app.use(cors());
  app.use(bodyParser.json());

  // @ts-ignore
  app.get("/", (req: Request, res: Response) => {
    res.send("hello");
    console.log("hello123");
  });

  app.listen(port, () => {
    console.log("server is running");
  });
};

init();
