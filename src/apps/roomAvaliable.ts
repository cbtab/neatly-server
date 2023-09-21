import { supabase } from "../utils/db.ts";
import { Router, Request, Response } from "express";
export const roomAvaliable = Router();

roomAvaliable.get("/", async (req: Request, res: Response) => {
  const { checkInDate } = req.query;

  if (!checkInDate) {
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
      return new Date(checkInDate as string) > new Date(checkoutDate);
    });

    res.json(availableRooms);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

roomAvaliable.get("/:roomId", async (req, res) => {
  const room_id = req.params.roomId;

  try {
    const { data: roomAvaliable, error } = await supabase
      .from("room_avaliable")
      .select("*")
      .eq("room_id", room_id);

    if (error) {
      console.error("Error fetching room avaliable:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching room avaliable." });
    }
    return res.json({
      data: roomAvaliable[0],
    });
  } catch (error) {
    console.log(error);
  }
});
