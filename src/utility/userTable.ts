import { pool } from "../db";
import type { IIssues } from "../modules/issues/issues.interface";

const userTable = async () => {
  const usersData = await pool.query(`
        SELECT id, name, role FROM users
    `);

  const usersLookUPTable = usersData.rows.reduce((acc, user) => {
    acc[user.id as string] = user;
    return acc;
  }, {});

  return usersLookUPTable;
};

export default userTable;
