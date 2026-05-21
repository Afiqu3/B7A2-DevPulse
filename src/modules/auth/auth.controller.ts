import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUpUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: error.message,
        error: error,
      });
    }
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController = {
  signUpUser,
  loginUser,
};
