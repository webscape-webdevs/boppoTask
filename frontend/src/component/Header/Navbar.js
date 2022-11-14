import "./Navbar.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { userLogout } from "../../slices/sessionSlice";

export default function Navbar() {
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.sessionSlice);

  function handleLogout() {
    dispatch(userLogout());
  }

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          <div className="navbar-links-container">
            <p>
              <Link className="navbar-buttons" to="/home">
                Home
              </Link>
            </p>
            {user && user.role === "employee" && (
              <p>
                {" "}
                <Link className="navbar-buttons" to="/dashboard">
                  Dashboard
                </Link>
              </p>
            )}
          </div>
        </div>
        <div style={{ paddingRight: "40px" }} className="navbar-sign">
          {isAuthenticated ? (
            <button className="navbar-signup-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="navbar-signup-button" type="button">
              <Link to="/login">
                Login / Sign Up
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
