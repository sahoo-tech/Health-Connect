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
        patient_name,
        patient_age,
        patient_gender,
        patient_blood_group,
        patient_city,
        doctor_name,
        doctor_speciality,
        doctor_reg_no,
        doctor_experience,
        doctor_clinic,
    } = req.body;

    if (
        !userId ||
        !slotDatetime ||
        !patient_name ||
        !patient_age ||
        !patient_gender ||
        !patient_blood_group ||
        !patient_city ||
        !doctor_speciality
    ) {
        res.status(400).json({ success: false, error: "Missing required fields" });
        return;
    }

    const booking = createBooking(userId, userPhone, slotDatetime, {
        patient_name,
        patient_age: Number(patient_age),
        patient_gender,
        patient_blood_group,
        patient_city,
        doctor_name: doctor_name || undefined,
        doctor_speciality,
        doctor_reg_no: doctor_reg_no || undefined,
        doctor_experience: doctor_experience || undefined,
        doctor_clinic: doctor_clinic || undefined,
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
