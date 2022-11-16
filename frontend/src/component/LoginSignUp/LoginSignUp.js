import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../Loader/Loader";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import BusinessIcon from "@material-ui/icons/Business";
import { useDispatch, useSelector } from "react-redux";
import { employeeLogin, userLogin, userRegister } from "../../slices/sessionSlice";
import { useAlert } from "react-alert";
import Select from "react-select";

const LoginSignUp = ({ history, location }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, loading, isAuthenticated } = useSelector((state) => state.sessionSlice);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");

  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organizationName: "",
    empId: "",
  });

  const [selectedOption, setSelectedOption] = useState("user");

  const { firstName, lastName, email, password, organizationName, empId } = user;

  const userLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(userLogin({ userEmail, userPassword }));
  };

  const employeeLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(employeeLogin({ employeeEmail, employeePassword }));
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("firstName", firstName);
    myForm.set("lastName", lastName);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("organizationName", organizationName);
    myForm.set("empId", empId);
    myForm.set("avatar", avatar);
    myForm.set("userType", selectedOption.value);

    // let userData = { firstName, lastName, email, password, organizationName, empId, selectedOption, avatar };
    dispatch(userRegister({myForm}));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const redirect = location.search ? location.search.split("=")[1] : "/dashboard";

  useEffect(() => {
    if (error) {
      alert.error(error);
    }

    if (isAuthenticated) {
      history.push(redirect);
    }
  }, [dispatch, error, alert, history, isAuthenticated, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Fragment>
            <div className="LoginSignUpContainer">
              <div className="LoginSignUpBox">
                <div>
                  <div className="login_signUp_toggle">
                    <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                    <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                  </div>
                  <button ref={switcherTab}></button>
                </div>

                {/* ---------------------Login ---------------------*/}
                <div className="test">
                  <div className="loginFormContainer" ref={loginTab}>
                    <form className="loginForm" onSubmit={userLoginSubmit}>
                      <h2> User Login </h2>
                      <div className="loginEmail">
                        <MailOutlineIcon />
                        <input type="email" placeholder="Email" required value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                      </div>
                      <div className="loginPassword">
                        <LockOpenIcon />
                        <input type="password" placeholder="Password" required value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                      </div>

                      <input type="submit" value="Login" className="loginBtn" />
                    </form>

                    <form className="employeeLoginForm" onSubmit={employeeLoginSubmit}>
                      <h2> Employee Login </h2>
                      <div className="loginEmail">
                        <MailOutlineIcon />
                        <input type="email" placeholder="Email" required value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} />
                      </div>
                      <div className="loginPassword">
                        <LockOpenIcon />
                        <input type="password" placeholder="Password" required value={employeePassword} onChange={(e) => setEmployeePassword(e.target.value)} />
                      </div>

                      <input type="submit" value="Login" className="loginBtn" />
                    </form>
                  </div>

                  {/* ---------------------Signup ---------------------*/}
                  <div className="signUpFormContainer" ref={registerTab}>
                    <form className="signUpForm" encType="multipart/form-data" onSubmit={registerSubmit}>
                      <div className="signUpFirstName">
                        <FaceIcon />
                        <input type="text" placeholder="First Name" required name="firstName" value={firstName} onChange={registerDataChange} />
                      </div>
                      <div className="signUpLastName">
                        <FaceIcon />
                        <input type="text" placeholder="Last Name" required name="lastName" value={lastName} onChange={registerDataChange} />
                      </div>
                      <div className="signUpEmail">
                        <MailOutlineIcon />
                        <input type="email" placeholder="Email" required name="email" value={email} onChange={registerDataChange} />
                      </div>
                      <div className="signUpEmail">
                        <Select
                          className="userType"
                          placeholder="Select User Type"
                          defaultValue={"User"}
                          onChange={setSelectedOption}
                          options={[
                            { value: "user", label: "User" },
                            { value: "employee", label: "Employee" },
                          ]}
                        />
                      </div>

                      {selectedOption && selectedOption.value === "employee" ? (
                        <>
                          <div className="signUpOrganization">
                            <BusinessIcon />
                            <input type="text" placeholder="Organization Name" required name="organizationName" value={organizationName} onChange={registerDataChange} />
                            <input type="text" placeholder="Employee Id" required name="empId" value={empId} onChange={registerDataChange} />
                          </div>
                        </>
                      ) : null}

                      <div className="signUpPassword">
                        <LockOpenIcon />
                        <input type="password" placeholder="Password" required name="password" value={password} onChange={registerDataChange} />
                      </div>

                      <div id="registerImage">
                        <img src={avatarPreview} alt="Avatar Preview" />
                        <input type="file" name="avatar" accept="image/*" onChange={registerDataChange} />
                      </div>

                      <input type="submit" value="Register" className="signUpBtn" />
                    </form>
                  </div>
                </div>
                {/* ---------------------Signup END ---------------------*/}
              </div>
            </div>
          </Fragment>
        </>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
