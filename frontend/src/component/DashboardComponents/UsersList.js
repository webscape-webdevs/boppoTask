import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./employeeList.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../views/MetaData";
import SideBar from "./Sidebar";
import { getUsersAndEmployeeList, deleteUserOrEmployee } from "../../slices/userListSlice";
import { useState } from "react";
import Pagination from "react-js-pagination";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

const EmployeeList = ({ history }) => {
  const dispatch = useDispatch();

  const { resultPerPage, userCount, userList } = useSelector((state) => state.userListSlice);
  const [currentPage, setCurrentPage] = useState(1);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const deleteUserHandler = (id) => {
    let userType = "user";
    dispatch(deleteUserOrEmployee({ id, userType }));
  };

  useEffect(() => {
    dispatch(getUsersAndEmployeeList(currentPage));
  }, [dispatch, currentPage]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.7,  sortable: true, },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.7,
      sortable: true,
    },
    {
      field: "firstName",
      headerName: "First Name",
      minWidth: 150,
      flex: 0.5,
      sortable: true,
    },

    {
      field: "lastName",
      headerName: "Last Name",
      minWidth: 150,
      flex: 0.5,
      sortable: true,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      sortable: false,
    },

    {
      field: "actions",
      flex: 0.5,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/updateUser/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  userList &&
    userList.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
      });
    });

  return (
    <Fragment>
      <MetaData title={`USER LIST`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">USER LIST</h1>

          <DataGrid rows={rows} columns={columns} disableSelectionOnClick className="productListTable" autoHeight hideFooter="true" />

          {resultPerPage < userCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={userCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="First"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default EmployeeList;
