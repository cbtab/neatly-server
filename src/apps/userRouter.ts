import { supabase } from "../utils/db.ts";
import { Router, Request, Response } from "express";
export const userRouter = Router();

userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (error) {
      console.error("Error fetching user:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching user." });
    }

    res.status(200).json({
      message: `Complete fetching user Id: ${userId}`,
      data: user,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

userRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { user_full_name, email, Id_card, birth_day, country } = req.body;

    const updatedUserProfile = {
      user_full_name,
      email,
      Id_card,
      birth_day,
      country,
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from("users")
      .update(updatedUserProfile)
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error updating profile:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating profile." });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User profile has been updated successfully", data });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
