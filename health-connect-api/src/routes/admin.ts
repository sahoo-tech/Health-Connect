import { Router, Request, Response } from "express";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

    if (password === adminPassword) {
        res.json({ success: true });
        return;
    }

    res.status(401).json({ success: false, error: "Invalid password" });
});

export default router;
