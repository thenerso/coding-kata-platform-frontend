import React, { useState, useEffect } from "react";
import FilterTable, { ITableFields } from "../../components/global/FilterTable";
import userService from "../../services/userService";
import { IUser } from "../../interfaces/user";
import authService from "../../services/authService";

const ListUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const token = authService.getAccessToken();
    if (!token) return;
    // The callback function provided to getAll will set the fetched users to our state
    userService.getAll(token, (fetchedUsers: IUser[]) => {
      setUsers(fetchedUsers);
    });
  }, []);

  const tableFields: ITableFields[] = [
    { label: "ID", field: "id", type: "string" },
    { label: "Cohort", field: "cohort.name", type: "string" },
    { label: "Username", field: "username", type: "string" },
    { label: "Start Date", field: "joinDate", type: "date" },
    { label: "Score", field: "score", type: "string" },
  ];

  return (
    <FilterTable
      title="Users"
      viewLink={"/users/"}
      rows={users}
      fields={tableFields}
      createLink={`/users/new`}
    />
  );
};

export default ListUsers;
