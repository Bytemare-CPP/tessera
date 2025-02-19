import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello, world! This is a new API endpoint." });
});

app.get("/api/world", (req: Request, res: Response) => {
    res.json({ message: "Hello, world! This is a new API endpoint." });
});

app.get("/api/edgar", (req: Request, res: Response) => {
    res.json({message: "Hello , my name is edgar and im apart of this projects"});

});

app.get("/api/jonathan", (req: Request, res: Response) => {
    res.json({ message: "Hi, my name is Jonathan and I am a contributor to this project." });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
