import { supabase } from "../utils/db.ts";
import { Router, Request, Response } from "express";
export const roomRouter = Router();

roomRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("room_details")
      .select("*")
      .order("room_id", { ascending: true });

    if (error) {
      console.error("Error fetching room:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching room." });
    }
    const { data: roomAvaliable, error: roomAvaliableError } = await supabase
      .from("room_avaliable")
      .select("*");

    return res.json({
      data,
      roomAvaliable,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

roomRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;
    const { data: roomDetails, error } = await supabase
      .from("room_details")
      .select("*")
      .eq("room_id", roomId)
      .single();

    if (error) {
      console.error("Error fetching room:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching room." });
    }

    res.json({ data: roomDetails });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

roomRouter.post("/", async (req: Request, res: Response) => {
  try {
    const {
      room_type,
      description,
      price,
      promotion_price,
      bed_types,
      area,
      amenity,
      room_images,
    } = req.body;

    if (!room_type || !price) {
      return res.status(400).json({
        error:
          "Please enter room type, description, price, bed types,amenity information.",
      });
    }

    const newRoom = {
      room_type,
      description,
      price,
      promotion_price,
      bed_types,
      area,
      amenity,
      room_images,
      created_at: new Date(),
    };

    const { error } = await supabase.from("room_details").insert([newRoom]);

    if (error) {
      console.error("Error creating room:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating room." });
    }

    res.status(201).json({ message: "user has been created successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

roomRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;
    const {
      room_type,
      description,
      price,
      promotion_price,
      bed_types,
      area,
      amenity,
      room_images,
    } = req.body;

    const updatedRoom = {
      room_type,
      description,
      price,
      promotion_price,
      bed_types,
      area,
      amenity,
      room_images,
      updated_at: new Date(),
    };

    const { error } = await supabase
      .from("room_details")
      .update(updatedRoom)
      .eq("room_id", roomId);

    if (error) {
      console.error("Error updating room:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating room." });
    }

    res.status(202).json({ message: "user has been update successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

roomRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;

    const { error } = await supabase
      .from("room_details")
      .delete()
      .eq("room_id", roomId);

    if (error) {
      console.error("Error deleting room:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting room." });
    }

    res.status(202).json({ message: "user has been delete successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
