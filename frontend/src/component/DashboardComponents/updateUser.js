import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import MetaData from "../../views/MetaData";
import SideBar from "./Sidebar";
import { updateUserOrEmployee } from "../../slices/userListSlice";
import { useHistory } from "react-router-dom";

const UpdateUser = ({ match }) => {
  const dispatch = useDispatch();

  const history = useHistory();

  const { userList } = useSelector((state) => state.userListSlice);

  const userId = match.params.id;

  const userDetails = userList.filter((e) => e._id === userId);

  const [user, setUser] = useState({
    firstName: userDetails[0].firstName,
    lastName: userDetails[0].lastName,
    email: userDetails[0].email,
  });

  const [avatar, setAvatar] = useState(userDetails[0].avatar? userDetails[0].avatar.url: "/Profile.png");
 
  const [avatarPreview, setAvatarPreview] = useState(userDetails[0].avatar? userDetails[0].avatar.url: "/Profile.png");


  let publicId = "";

  if (userDetails[0].avatar) {
    publicId = userDetails[0].avatar.publicId;
  }

  const { firstName, lastName, email } = user;

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

  const updateUserHandler = async (e) => {
    e.preventDefault();
    let userType = "user";
    const myForm = new FormData();

    myForm.set("firstName", firstName);
    myForm.set("lastName", lastName);
    myForm.set("email", email);
    myForm.set("avatar", avatar);
    myForm.set("userType", userType);
    myForm.set("userId", userId);
    myForm.set("publicId", publicId);

    const updatedUser = await dispatch(updateUserOrEmployee({ myForm }));

    if (updatedUser.meta.requestStatus === "fulfilled") history.push("/userList");
  };

  return (
    <Fragment>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="LoginSignUpContainer">
          <div className="LoginSignUpBox">
            <form className="signUpForm" encType="multipart/form-data" onSubmit={updateUserHandler}>
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
              <div className="signUpEmail"></div>

              <div id="registerImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input type="file" name="avatar" accept="image/*" onChange={registerDataChange} />
              </div>

              <input type="submit" value="Update" className="signUpBtn" />
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
