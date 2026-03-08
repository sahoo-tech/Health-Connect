import { Router, Request, Response } from "express";
import { getAvailableSlots } from "../store";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
    const slots = getAvailableSlots();
    res.json({ slots });
});

export default router;
