import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import sendResponse from '../utility/sendResponse';
import config from '../config';
import { pool } from '../db';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'Unauthorized access!!!',
      });
    }

    const decoded = jwt.verify(token as string, config.secret) as JwtPayload;

    const userData = await pool.query(
      `
     SELECT * FROM users WHERE email=$1   
    `,
      [decoded.email],
    );

    if (userData.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'Unauthorized access!!!',
      });
    }

    req.userID = decoded.id;
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;