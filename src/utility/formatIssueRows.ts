type UsersLookup = Record<string, unknown>;
type IssueRow = Record<string, unknown>;

const formatIssueRows = (rows: IssueRow[], usersLookup: UsersLookup) => {
  return rows.map((issue) => {
    const created_at = issue.created_at;
    const updated_at = issue.updated_at;
    delete issue.created_at;
    delete issue.updated_at;
    issue["reporter"] = usersLookup[issue.reporter_id as string];
    issue.created_at = created_at;
    issue.updated_at = updated_at;
    delete issue.reporter_id;
    return issue;
  });
};

export default formatIssueRows;
