import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middlewares/auth";
import checkPermission from "../../middlewares/checkPermission";

const router = Router();

router.post("/", auth, issuesController.createIssue);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.patch("/:id", auth, checkPermission, issuesController.updateIssue);
router.delete("/:id", auth, issuesController.deleteIssue);

export const issuesRouter = router;
