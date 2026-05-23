import { pool } from "../../db";
import type { ALLOWED_SORT, ALLOWED_STATUS, ALLOWED_TYPES } from "../../types";
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

  const allowedSort: ALLOWED_SORT[] = ["newest", "oldest"];
  const allowedTypes: ALLOWED_TYPES[] = ["bug", "feature_request"];
  const allowedStatus: ALLOWED_STATUS[] = ["open", "in_progress", "resolved"];

  if (type && allowedTypes.includes(type as ALLOWED_TYPES)) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status && allowedStatus.includes(status as ALLOWED_STATUS)) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  let query = "SELECT * FROM issues";
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  if (sort && allowedSort.includes(sort as ALLOWED_SORT)) {
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

const updateIssueIntoDB = async (id: string, payload: Partial<IIssues>) => {
    const { title, description, type } = payload;

    const result = await pool.query(
        `
        UPDATE issues SET title=COALESCE($1, title), description=COALESCE($2, description), type=COALESCE($3, type) WHERE id=$4 RETURNING *
        `,
        [title, description, type, id]
    );

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
  updateIssueIntoDB,
  deleteIssueFromDB,
};
