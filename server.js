import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);

app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});