import React, { useEffect } from "react";
import Sidebar from "../../component/DashboardComponents/Sidebar";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUsersAndEmployeeList } from "../../slices/userListSlice";
import MetaData from "../MetaData";
import Loader from "../../component/Loader/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { userCount, employeeCount, loading } = useSelector((state) => state.userListSlice);

  useEffect(() => {
    dispatch(getUsersAndEmployeeList());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div className="dashboardSummaryBox2">
            <Link to="/userList">
              <p>Users</p>
              <p>{userCount}</p>
            </Link>
          </div>

          <div className="dashboardSummaryBox2">
            <Link to="/employeeList">
              <p>Employees</p>
              <p>{employeeCount}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
