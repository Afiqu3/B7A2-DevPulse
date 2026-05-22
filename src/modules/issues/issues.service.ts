import { pool } from "../../db";
import userTable from "../../utility/userTable";
import type { IIssues } from "./issues.interface";

const createIssueIntoDB = async (payload: IIssues) => {
  const { title, description, type, status, reporter_id } = payload;

  const result = await pool.query(
    `
     INSERT INTO issues(title,description,type,status,reporter_id) VALUES($1,$2,$3,COALESCE($4, 'open'),$5) RETURNING *
    `,
    [title, description, type, status, reporter_id],
  );

  return result;
};

const getAllIssuesFromDB = async (
  sort?: string,
  type?: string,
  status?: string,
) => {
};

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM issues WHERE id=$1  
    `,
    [id],
  );

  if (result.rowCount !== 0) {
    const allUsersData = await userTable();

    const created_at = result.rows[0].created_at;
    const updated_at = result.rows[0].updated_at;
    delete result.rows[0].created_at;
    delete result.rows[0].updated_at;

    result.rows[0]["reporter"] =
      allUsersData[result.rows[0].reporter_id as string];
    result.rows[0].created_at = created_at;
    result.rows[0].updated_at = updated_at;

    delete result.rows[0].reporter_id;
  }

  return result;
};

const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM issues WHERE id=$1  
    `,
    [id],
  );
  return result;
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  deleteIssueFromDB,
};
