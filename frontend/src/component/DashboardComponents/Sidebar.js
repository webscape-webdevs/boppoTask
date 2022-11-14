import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";

const Sidebar = () => {
  return (
    <div className="sidebar">

      <Link to="/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>

      <Link to="/employeeList">
        <p>
          <PeopleIcon /> Employees List
        </p>
      </Link>

      <Link to="/userList">
        <p>
          <PeopleIcon /> Users List
        </p>
      </Link>
 
    </div>
  );
};

export default Sidebar;
