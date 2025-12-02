import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./config/db.js";
import { router } from "./routes/userRoutes.js";

const app = express();
dotenv.config();


app.use(cors({
    origin: [
        "https://management-frontend-wheat.vercel.app", 
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    return res.send("Welcome to Panda's backend!");
})

connect();

app.use("/api", router);


app.listen(PORT, () => console.log(`Server is runnig on http://localhost:${PORT}`));
