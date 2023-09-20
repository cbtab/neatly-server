import { supabase } from "../utils/db.ts";
import { Router, Request, Response } from "express";
export const bookingRouter = Router();

bookingRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("booking")
      .select("*")
      .order("book_id", { ascending: false });

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
      .select("*, room_details(*)")
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

bookingRouter.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const user_id = req.params.userId;
    const { data: bookingDetails, error } = await supabase
      .from("booking")
      .select("*, room_details(*)")
      .eq("user_id", user_id);

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
      standard_request,
      special_request,
      additional_request,
      avaliable,
      room_avaliable_id,
      three_credit_card_num,
      payment_method,
    } = req.body;

    const newBooking = {
      amount_room,
      amount_stay,
      check_in,
      check_out,
      room_id,
      user_id,
      total_price,
      standard_request,
      special_request,
      additional_request,
      room_avaliable_id,
      three_credit_card_num,
      payment_method,
      booking_date: new Date(),
    };

    const newAvailability = {
      check_in,
      check_out,
      avaliable,
      user_id,
      status: "Unavaliable",
    };

    const { error: bookingError } = await supabase
      .from("booking")
      .insert([newBooking]);

    const { error: availabilityError } = await supabase
      .from("room_avaliable")
      .update([newAvailability])
      .eq("room_avaliable_id", room_avaliable_id);

    if (bookingError || availabilityError) {
      console.error(
        "Error inserting data into the database:",
        bookingError || availabilityError
      );
      res
        .status(500)
        .json({ error: "Failed to insert data into the database" });
    } else {
      res.status(200).json({ message: "Data inserted successfully" });
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
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
      standard_request,
      special_request,
      additional_request,
      avaliable,
      room_avaliable_id,
    } = req.body;

    const updatedBooking = {
      amount_room,
      amount_stay,
      check_in,
      check_out,
      room_id,
      user_id,
      total_price,
      standard_request,
      special_request,
      additional_request,
      cancel_date: new Date(),
      update_booking_date: new Date(),
    };

    const updatedAvailability = {
      check_in,
      check_out,
      avaliable,
      user_id,
    };

    const { error: bookingError } = await supabase
      .from("booking")
      .update([updatedBooking])
      .eq("book_id", bookingId);

    const { error: availabilityError } = await supabase
      .from("room_avaliable")
      .update([updatedAvailability])
      .eq("room_avaliable_id", room_avaliable_id);

    if (bookingError || availabilityError) {
      console.error(
        "Error updating booking or availability:",
        bookingError,
        availabilityError
      );
      return res.status(500).json({
        error: "An error occurred while updating booking or availability.",
      });
    }

    res.status(202).json({
      message: "Booking and availability have been updated successfully.",
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

bookingRouter.put("/ChangeDate/:id", async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const { check_in, check_out, room_avaliable_id } = req.body;

    const updatedBooking = {
      check_in,
      check_out,
      update_booking_date: new Date(),
    };

    const updatedAvailability = {
      check_in,
      check_out,
    };

    const { error: bookingError } = await supabase
      .from("booking")
      .update([updatedBooking])
      .eq("book_id", bookingId);

    const { error: availabilityError } = await supabase
      .from("room_avaliable")
      .update([updatedAvailability])
      .eq("room_avaliable_id", room_avaliable_id);

    if (bookingError || availabilityError) {
      console.error(
        "Error updating booking or availability:",
        bookingError,
        availabilityError
      );
      return res.status(500).json({
        error: "An error occurred while updating booking or availability.",
      });
    }

    res.status(202).json({
      message: "Booking and availability have been updated successfully.",
    });
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
