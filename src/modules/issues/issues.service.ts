import { pool } from "../../db";
import formatIssueRows from "../../utility/formatIssueRows";
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
  const conditions: string[] = [];
  const values: string[] = [];

  const allowedSort = ["newest", "oldest"];
  const allowedTypes = ["bug", "feature_request"];
  const allowedStatus = ["open", "in_progress", "resolved"];

  if (type && allowedTypes.includes(type)) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status && allowedStatus.includes(status)) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  let query = "SELECT * FROM issues";
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  if (sort && allowedSort.includes(sort)) {
    if (sort === "newest") {
      query += " ORDER BY created_at DESC";
    } else if (sort === "oldest") {
      query += " ORDER BY created_at ASC";
    }
  } else {
    query += " ORDER BY created_at DESC";
  }
  const result = await pool.query(query, values);

  if (result.rowCount !== 0) {
    const allUsersData = await userTable();
    result.rows = formatIssueRows(result.rows, allUsersData);
  }

  return result;
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

    result.rows = formatIssueRows(result.rows, allUsersData);
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
