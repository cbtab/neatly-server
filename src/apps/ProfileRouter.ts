import { supabase } from "../utils/db.ts";
import { Router, Request, Response } from "express";
export const profileRouter = Router();

profileRouter.get("/:id", async (req: Request, res: Response) => {
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

profileRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { fullName, email, idNumber, birthDate, country, profile_image } =
      req.body;

    const updatedUserProfile = {
      fullName,
      email,
      idNumber,
      birthDate,
      country,
      profile_image,
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

profileRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const { error } = await supabase
      .from("users")
      .update({ profile_image: null })
      .eq("id", userId);
    if (error) {
      console.error("Error deleting profile image:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the profile image." });
    }

    res.status(200).json({
      message: "Profile image has been deleted successfully",
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

profileRouter.post("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { profile_image } = req.body;

    const newProfileImage = {
      user_id: userId,
      profile_image,
      created_at: new Date(),
    };

    const { error } = await supabase.from("users").insert([newProfileImage]);
    if (error) {
      console.error("Error creating profile image:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating profile image." });
    }

    res
      .status(201)
      .json({ message: "Profile image has been created successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
