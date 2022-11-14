import React, { useEffect } from "react";
import Sidebar from "../../component/DashboardComponents/Sidebar";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUsersAndEmployeeList } from "../../slices/userListSlice";
import MetaData from "../MetaData";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { userList, employeeList } = useSelector((state) => state.userListSlice);

  useEffect(() => {
    dispatch(getUsersAndEmployeeList());
  }, [dispatch]);


  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">

          <div className="dashboardSummaryBox2">
            <Link to="/userList">
              <p>Users</p>
              <p>{userList && userList.length}</p>
            </Link>
          </div>

          <div className="dashboardSummaryBox2">
            <Link to="/employeeList">
              <p>Employees</p>
              <p>{employeeList && employeeList.length}</p>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
