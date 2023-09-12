import { supabase } from "../utils/db.ts";
import { Router, Request, Response } from "express";
export const paymentMethodRouter = Router();

paymentMethodRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
    const { data: payment, error } = await supabase
      .from("credit_card")
      .select("*")
      .eq("credit_card_id", paymentId)
      .single();

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (error) {
      console.error("Error fetching payment:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching payment." });
    }

    res.status(200).json({
      message: `Complete fetching payment Id: ${paymentId}`,
      data: payment,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

paymentMethodRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
    const { card_number, card_owner, expire_date, cvc } = req.body;

    const updatedPayment = {
      card_number,
      card_owner,
      expire_date,
      cvc,
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from("credit_card")
      .update(updatedPayment)
      .eq("credit_card_id", paymentId)
      .select();

    if (error) {
      console.error("Error updating payment:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating payment." });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res
      .status(200)
      .json({ message: "Payment Method has been updated successfully", data });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
