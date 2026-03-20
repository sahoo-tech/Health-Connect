import { Router, Request, Response } from "express";
import { createBooking, getAllBookings, getBookingsByUser, getBookingById, updateBooking } from "../store";
import { BookingStatus } from "../types";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;

    if (userId) {
        res.json({ bookings: getBookingsByUser(userId) });
        return;
    }

    res.json({ bookings: getAllBookings() });
});

router.post("/", (req: Request, res: Response) => {
    const {
        userId,
        userPhone,
        slotDatetime,
        requester_name,
        requester_age,
        requester_gender,
        requester_city,
        provider_name,
        provider_speciality,
        provider_reg_no,
        provider_experience,
        provider_location,
    } = req.body;

    if (
        !userId ||
        !slotDatetime ||
        !requester_name ||
        !requester_age ||
        !requester_gender ||
        !requester_city
    ) {
        res.status(400).json({ success: false, error: "Missing required fields" });
        return;
    }


    const booking = createBooking(userId, userPhone, slotDatetime, {
        requester_name,
        requester_age: Number(requester_age),
        requester_gender,
        requester_city,
        provider_name: provider_name || undefined,
        provider_speciality,
        provider_reg_no: provider_reg_no || undefined,
        provider_experience: provider_experience || undefined,
        provider_location: provider_location || undefined,
    });

    if (!booking) {
        res.status(409).json({ success: false, error: "Slot unavailable. Please choose another slot." });
        return;
    }

    res.json({ success: true, booking });
});

router.get("/:id", (req: Request, res: Response) => {
    const booking = getBookingById(req.params.id);

    if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
    }

    res.json({ booking });
});

router.patch("/:id", (req: Request, res: Response) => {
    const { status, reason, newSlotDatetime } = req.body;

    if (!status || !Object.values(BookingStatus).includes(status)) {
        res.status(400).json({ success: false, error: "Invalid status" });
        return;
    }

    const booking = updateBooking(req.params.id, status, reason, newSlotDatetime);

    if (!booking) {
        res.status(404).json({ success: false, error: "Booking not found or slot unavailable" });
        return;
    }

    res.json({ success: true, booking });
});

export default router;
