import express, { type Application, type Request, type Response } from "express";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to DevPulse project",
    author: "Md. Afique Hossain",
  });
});

export default app;