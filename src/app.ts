import express, { Express, Response, Request } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { roomRouter } from "./apps/roomRouter.ts";
import authRouter from "./apps/auth.ts";
import { supabase } from "./utils/db.ts";

const init = async () => {
  const app: Express = express();
  const port = 4000;
  app.use(cors());
  app.use(bodyParser.json());

  app.use("/room", roomRouter);
  app.use("/auth", authRouter);

  app.post("/upload", async (req, res) => {
    try {
      //@ts-ignore
      const { file } = req.files;
      const { data, error } = await supabase.storage
        .from("user-storage")
        .upload("profile-pictures/" + `avatar_${Date.now()}`, file.data);

      if (error) {
        return res.status(500).json({ error: "Upload failed" });
      }
      return res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      //@ts-ignore
      console.log(req.files);
      return res.status(500).json({ error });
    }
  });

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
