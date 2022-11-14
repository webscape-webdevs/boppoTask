import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./employeeList.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../views/MetaData";
import SideBar from "./Sidebar";
import { getUsersAndEmployeeList } from "../../slices/userListSlice";

const EmployeeList = ({ history }) => {
  const dispatch = useDispatch();

  const { employeeList } = useSelector((state) => state.userListSlice);


  useEffect(() => {
 

    dispatch(getUsersAndEmployeeList());

  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Employee ID", minWidth: 180, flex: 0.7 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.7,
    },
    {
      field: "firstName",
      headerName: "First Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "lastName",
      headerName: "Last Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "organizationName",
      headerName: "Organization",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
   
    },


  ];

  const rows = [];

  employeeList &&
  employeeList.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        organizationName: item.organizationName,
      });
    });

  return (
    <Fragment>
      <MetaData title={`EMPLOYEES LIST`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">EMPLOYEES LIST</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default EmployeeList;
