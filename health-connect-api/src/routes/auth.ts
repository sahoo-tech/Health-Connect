import { Router, Request, Response } from "express";
import { generateOtp, verifyOtp, getOrCreateUser } from "../store";

const router = Router();

router.post("/send-otp", (req: Request, res: Response) => {
    const { phone } = req.body;

    if (!phone || phone.length < 10) {
        res.status(400).json({ success: false, error: "Invalid phone number" });
        return;
    }

    const otp = generateOtp(phone);
    res.json({ success: true, message: `OTP sent to ${phone}`, otp });
});

router.post("/verify-otp", (req: Request, res: Response) => {
    const { phone, otp, name, city } = req.body;

    if (!phone || !otp) {
        res.status(400).json({ success: false, error: "Phone and OTP required" });
        return;
    }

    const valid = verifyOtp(phone, otp);
    if (!valid) {
        res.status(401).json({ success: false, error: "Invalid OTP" });
        return;
    }

    const user = getOrCreateUser(phone, name, city);
    res.json({ success: true, user });
});

export default router;
