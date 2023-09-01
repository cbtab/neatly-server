import { supabase } from "../utils/db.ts";
import { Router, Request, Response } from "express";

export const roomRouter = Router();

//@ts-ignore
roomRouter.get("/", async (req: Request, res: Response) => {
  try {
    let { data, error } = await supabase.from("room_details").select("*");

    if (error) {
      console.error("Error fetching room images:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching room images." });
    } else {
      res.json({ data: data });
    }
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
