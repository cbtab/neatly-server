import { supabase } from "../utils/db.ts";
import { Router, Request, Response } from "express";
export const bookingRouter = Router();

bookingRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("booking")
      .select("*")
      .order("book_id", { ascending: true });

    if (error) {
      console.error("Error fetching booking:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching booking." });
    }

    res.json({ data });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

bookingRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const { data: bookingDetails, error } = await supabase
      .from("booking")
      .select("*")
      .eq("book_id", bookingId)
      .single();

    if (error) {
      console.error("Error fetching booking:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching booking." });
    }

    res.json({ data: bookingDetails });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

bookingRouter.post("/", async (req: Request, res: Response) => {
  try {
    const {
      amount_room,
      amount_stay,
      check_in,
      check_out,
      room_id,
      user_id,
      total_price,
    } = req.body;

    const newBooking = {
      amount_room,
      amount_stay,
      check_in,
      check_out,
      room_id,
      user_id,
      total_price,
      booking_date: new Date(),
    };

    const { error } = await supabase.from("booking").insert([newBooking]);

    if (error) {
      console.error("Error creating booking:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating booking." });
    }

    res.status(201).json({ message: "user has been booking successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

bookingRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const {
      amount_room,
      amount_stay,
      check_in,
      check_out,
      room_id,
      user_id,
      total_price,
    } = req.body;

    const updatedBooking = {
      amount_room,
      amount_stay,
      check_in,
      check_out,
      room_id,
      user_id,
      total_price,
      update_booking_date: new Date(),
    };

    const { error } = await supabase
      .from("booking")
      .update(updatedBooking)
      .eq("book_id", bookingId);

    if (error) {
      console.error("Error updating booking:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating booking." });
    }

    res
      .status(202)
      .json({ message: "user has been update booking successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

bookingRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;

    const { error } = await supabase
      .from("booking")
      .delete()
      .eq("book_id", bookingId);

    if (error) {
      console.error("Error deleting booking:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting booking." });
    }

    res
      .status(202)
      .json({ message: "user has been delete booking successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
