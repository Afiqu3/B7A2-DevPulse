import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", auth, issuesController.createIssue);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.delete("/:id", auth, issuesController.deleteIssue);

export const issuesRouter = router;
