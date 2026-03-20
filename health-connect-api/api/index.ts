
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "../src/routes/auth";
import bookingsRouter from "../src/routes/bookings";
import slotsRouter from "../src/routes/slots";
import adminRouter from "../src/routes/admin";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/slots", slotsRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

export default (req: VercelRequest, res: VercelResponse) => {
    return app(req as unknown as Parameters<typeof app>[0], res as unknown as Parameters<typeof app>[1]);
};
