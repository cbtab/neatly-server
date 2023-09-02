import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/db.ts";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    user_full_name: req.body.user_full_name,
    email: req.body.email,
  };

  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  user.password = await bcrypt.hash(user.password, salt);

  console.log("Password:", user.password);
  console.log("Username:", user.username);
  console.log("Salt:", salt);

  await supabase.from("users").insert([
    {
      username: user.username,
      password: user.password,
      user_full_name: user.user_full_name,
      email: user.email,
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
