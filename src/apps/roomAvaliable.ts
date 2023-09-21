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

roomAvaliable.get("/book/", async (req: Request, res: Response) => {
  const { checkInDate, checkOutDate } = req.query;

  if (!checkInDate || !checkOutDate) {
    return res
      .status(400)
      .json({ error: "Please provide check-in and check-out dates." });
  }

  try {
    const { data, error } = await supabase
      .from("booking")
      .select("*")
      .order("book_id", { ascending: true });

    if (error) {
      console.error("Error fetching room available:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching room available." });
    }

    const queryDateIn = new Date(checkInDate as string).toISOString();
    const queryDateOut = new Date(checkOutDate as string).toISOString();

    const availableRooms = data.filter((room) => {
      const checkinDate = new Date(room.check_in).toISOString();
      const checkoutDate = new Date(room.check_out).toISOString();

      // Check if the query date is within the booking's date range
      const doesNotOverlap =
        queryDateIn > checkoutDate || queryDateOut < checkinDate;

      return doesNotOverlap;
    });

    // Filter out rows where 'status' === 'cancel'
    const availableRoomsFiltered = availableRooms.filter(
      (room) => room.status !== "cancel"
    );

    const roomAvaliableCheck = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };

    const { data: available, error: availableError } = await supabase
      .from("room_avaliable")
      .select("*")
      .order("room_avaliable_id", { ascending: true });

    if (availableError) {
      console.error("Error fetching room available:", availableError);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching room available." });
    }

    const valid = {
      1: 5,
      2: 4,
      3: 4,
      4: 6,
      5: 5,
      6: 2,
    };

    available.forEach((room) => {
      const roomId = room.room_id;
      if (roomId in roomAvaliableCheck && room.check_in === null) {
        roomAvaliableCheck[`${roomId}`]++;
        // Check if the count exceeds the maximum valid count
        if (roomAvaliableCheck[`${roomId}`] > valid[`${roomId}`]) {
          // Reset the count to the maximum valid count
          roomAvaliableCheck[`${roomId}`] = valid[`${roomId}`];
        }
      }
    });

    availableRoomsFiltered.forEach((room) => {
      const roomId = room.room_id;
      if (roomId in roomAvaliableCheck) {
        roomAvaliableCheck[`${roomId}`]++;
        // Check if the count exceeds the maximum valid count
        if (roomAvaliableCheck[`${roomId}`] > valid[`${roomId}`]) {
          // Reset the count to the maximum valid count
          roomAvaliableCheck[`${roomId}`] = valid[`${roomId}`];
        }
      }
    });

    return res.json({ data: roomAvaliableCheck });
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
