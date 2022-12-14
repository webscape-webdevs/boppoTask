import "./App.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import store from "./store";

import Home from "./views/Home/Home";
import LoginSignUp from "./component/LoginSignUp/LoginSignUp";
import ProtectedRouteAdmin from "./component/ProtectedRoutes/ProtectedRouteAdmin";
import ProtectedRouteUser from "./component/ProtectedRoutes/ProtectedRouteUser";
import Dashboard from "./views/Dashboard/Dashboard";
import UsersList from "./component/DashboardComponents/UsersList";
import EmployeeList from "./component/DashboardComponents/EmployeeList";
import Navbar from "./component/Header/Navbar";
import UpdateUser from "./component/DashboardComponents/updateUser";
import UpdateEmployee from "./component/DashboardComponents/updateEmployee";
import { getSession } from "./slices/sessionSlice";

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(getSession());
  }, []);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={LoginSignUp} />

        <ProtectedRouteUser exact path="/home" component={Home} />

        <Route exact path="/login" component={LoginSignUp} />

        <Route exact path="/updateUser/:id" component={UpdateUser} />

        <Route exact path="/updateEmployee/:id" component={UpdateEmployee} />

        <ProtectedRouteAdmin exact path="/dashboard" component={Dashboard} />

        <ProtectedRouteAdmin exact path="/employeeList" component={EmployeeList} />

        <ProtectedRouteAdmin exact path="/userList" component={UsersList} />
      </Switch>

      {/* <Footer /> */}
    </Router>
  );
}

export default App;
