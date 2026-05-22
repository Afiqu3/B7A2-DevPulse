import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { issuesRouter } from "./modules/issues/issues.route";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to DevPulse project",
    author: "Md. Afique Hossain",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);

app.use(globalErrorHandler);

export default app;
