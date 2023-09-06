import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/db.ts";
import { supabaseUpload } from "../utils/upload.ts";
import multer from "multer";

const authRouter = Router();

const multerUpload = multer({ storage: multer.memoryStorage() });
const avatarUpload = multerUpload.fields([{ name: "avatar" }]);

authRouter.post("/register", avatarUpload, async (req, res) => {
  let avatarUrl = "";

  // @ts-ignore
  if (req.files && req.files.avatar) {
    //@ts-ignore
    avatarUrl = await supabaseUpload(req.files);
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert(
      [
        {
          username: req.body.username,
          password: req.body.password,
          fullName: req.body.fullName,
          email: req.body.email,
          birthDate: req.body.birth_day,
          country: req.body.country,
          idNumber: req.body.idNumber,
          profile_image: avatarUrl,
        },
      ],
      { defaultToNull: false }
    );

  //get ID
  let { data: users, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", req.body.username);
  const user_id = users[0].id;
  console.log(user_id);
  if (userError) {
    return res.status(500).json({
      message: "Error creating user",
      error: userError,
    });
  }

  const { data: data, error: dataError } = await supabase
    .from("credit_card")
    .insert([
      {
        expire_date: req.body.expireDate,
        cvc: req.body.cvc,
        user_id: user_id,
        card_owner: req.body.card_owner,
        card_number: req.body.card_number,
      },
    ]);
  if (dataError) {
    return res.status(500).json({
      message: "Error creating credit card",
      error: dataError,
    });
  }
  let { data: creditCard, error: errorCreditCard } = await supabase
    .from("credit_card")
    .select("credit_card_id")
    .eq("user_id", user_id);
  const card_id = creditCard[0].credit_card_id;

  if (errorCreditCard) {
    return res.status(500).json({
      message: "Error creating user",
      error: errorCreditCard,
    });
  }

  const { data: updateCard, error: updateCardError } = await supabase
    .from("users")
    .update({ credit_card_id: card_id })
    .eq("id", user_id);

  return res.json({
    message: "User has been created successfully",
  });
});

authRouter.post("/login", async (req, res) => {
  const loginIdentifier = req.body.loginIdentifier;
  const password = req.body.password;

  const isEmail = /\S+@\S+\.\S+/.test(loginIdentifier);

  let user;

  if (isEmail) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", loginIdentifier)
      .single();

    user = data;
  } else {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", loginIdentifier)
      .single();

    user = data;
  }

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(400).json({
      message: "Password not valid",
    });
  }

  const token = jwt.sign({ email: user.email }, `${process.env.SECRET_KEY}`, {
    expiresIn: "900000",
  });

  return res.status(200).json({
    message: "Login successful",
    token,
  });
});

export default authRouter;
