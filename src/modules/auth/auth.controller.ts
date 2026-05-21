import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const signUpUser = async (req: Request, res: Response) => {
  const result = await authService.signUpUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User Created successfully!",
    data: result.rows[0],
  });
};

export const authController = {
  signUpUser,
};
