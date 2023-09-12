import express, { Express, Response, Request } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { roomRouter } from "./apps/roomRouter.ts";
import { profileRouter } from "./apps/ProfileRouter.ts";
import { paymentMethodRouter } from "./apps/paymentMethodRouter.ts";
import authRouter from "./apps/auth.ts";
import { validUser } from "./apps/validUser.ts";
import { protect } from "./middlewares/protect.ts";
import { bookingRouter } from "./apps/bookingRouter.ts";
// import { supabase } from "./utils/db.ts";
// import multer from "multer";

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const init = async () => {
  const app: Express = express();
  const port = 4000;

  app.use(cors());
  app.use(bodyParser.json());
  // app.use("/", protect);
  app.use("/room", roomRouter);
  app.use("/auth", authRouter);
  app.use("/profile", profileRouter);
  app.use("/paymentMethod", paymentMethodRouter);
  app.use("/validUser", validUser);
  app.use("/booking", bookingRouter);

  // app.post("/upload", upload.single("file"), async (req, res) => {
  //   try {
  //     const file = req.file;
  //     if (!file) {
  //       return res.status(400).send("No file uploaded.");
  //     }

  //     console.log(file);

  //     const { data, error } = await supabase.storage
  //       .from("user-storage")
  //       .upload("profile-pictures/" + `avatar_${Date.now()}`, file.buffer, {
  //         contentType: "image/jpeg",
  //       });

  //     if (error) {
  //       return res.status(500).send("Failed to upload file.");
  //     }

  //     return res.status(200).send("File uploaded successfully.");
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send("Internal server error.");
  //   }
  // });

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
