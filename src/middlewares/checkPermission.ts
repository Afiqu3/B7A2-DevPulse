import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";
import { pool } from "../db";

const checkPermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userID = req.userID;
    const issueID = req.params.id as string;
    if (!userID) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access!!!",
      });
    }

    const issueData = await pool.query(
      `
      SELECT * FROM issues WHERE id=$1
    `,
      [issueID],
    );

    const userData = await pool.query(
      `
      SELECT role FROM users WHERE id=$1
    `,
      [userID],
    );


    if (issueData.rowCount === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue Not found!",
      });
    }
    if (
      userData.rows[0].role === "contributor" &&
      (issueData.rows[0].reporter_id !== userID ||
      issueData.rows[0].status !== "open")
    ) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Forbidden access!!!",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default checkPermission;
