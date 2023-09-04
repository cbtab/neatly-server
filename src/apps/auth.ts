import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/db.ts";
// import { supabaseUpload } from "../utils/upload.ts";
import multer from "multer";

const authRouter = Router();

// const multerUpload = multer({ dest: "uploads/" });
// const avatarUpload = multerUpload.fields([{ name: "avatar", maxCount: 1 }]);

// authRouter.post("/register", avatarUpload async (req, res) =>
authRouter.post("/register", async (req, res) => {
  //@ts-ignore
  // const avatarUrl = await supabaseUpload(req.files);

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  console.log("Salt:", salt);

  await supabase.from("users").insert([
    {
      username: req.body.username,
      password: req.body.password,
      fullName: req.body.fullName,
      email: req.body.email,
      birth_day: req.body.birthDay,
      country: req.body.country,
      idNumber: req.body.idNumber,
      // profile_image: avatarUrl,
    },
  ]);

  return res.json({
    message: "User has been created successfully",
  });
});

authRouter.post("/login", async (req, res) => {
  const email = req.body.email;
  let { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!users) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    users.password
  );

  if (!isValidPassword) {
    return res.status(400).json({
      message: "password not valid",
    });
  }

  const token = jwt.sign({ email: users.email }, `${process.env.SECRET_KEY}`, {
    expiresIn: "900000",
  });

  return res.json({
    message: "login succesfully",
    token,
  });
});

export default authRouter;
