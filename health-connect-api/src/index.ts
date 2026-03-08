import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth";
import bookingsRouter from "./routes/bookings";
import slotsRouter from "./routes/slots";
import adminRouter from "./routes/admin";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/slots", slotsRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Health Connect API running on http://localhost:${PORT}`);
});
