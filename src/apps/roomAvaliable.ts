import { supabase } from "../utils/db.ts";
import { Router, Request, Response } from "express";
export const roomAvaliable = Router();

roomAvaliable.get("/", async (req: Request, res: Response) => {
  const { check_in } = req.query;

  if (!check_in) {
    return res.status(400).json({ error: "Please provide check-in." });
  }

  try {
    const { data, error } = await supabase
      .from("room_avaliable")
      .select("*")
      .order("room_avaliable_id", { ascending: true });

    if (error) {
      console.error("Error fetching room avaliable:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching room avaliable." });
    }

    const availableRooms = data.filter((room) => {
      const checkoutDate = room.check_out;
      return new Date(check_in as string) > new Date(checkoutDate);
    });

    res.json(availableRooms);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
