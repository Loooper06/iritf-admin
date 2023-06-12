import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ExitToApp } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./SignIn.css";
import axios from "axios";
import { checkAuth } from "../../utils/checkAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const [adminUsername, setAdminUserName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [passLock, setPassLock] = useState(false);

  async function checkSignin() {
    const signIn = await checkAuth();
    if (signIn?.statusCode === 200) navigate("/");
  }

  useEffect(() => {
    checkSignin();
  }, []);

  const loginHandler = async () => {
    console.log(adminUsername, adminPassword)
    const result = await axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/auth/sign-in-panel`,
        { adminUsername, adminPassword },
        { withCredentials: true }
      )
      .then((res) => res.data)
      .catch((err) => err.response.data.message);
    if (result.statusCode === 200) {
      Swal.fire({
        text: result.data.message,
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
      });
      navigate("/", {replace:true});
    } else {
      Swal.fire({
        text: result,
        icon: "error",
      });
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col xs={12} className="loginWrapper">
          <div className="loginFormWrapper">
            <div className="w-100 text-center my-3">
              <h3 className="text-white">ورود به پنل مدیریت</h3>
            </div>
            <div className="w-75">
              <span className="text-white">نام کاربری : </span>
              <input
                type="text"
                className="w-100 mt-2 mb-4 usernameInput"
                placeholder="username"
                value={adminUsername}
                onChange={(e) => setAdminUserName(e.target.value)}
              />
            </div>
            <div className=" w-75">
              <span className="text-white">رمز عبور : </span>
              <div className="position-relative overflow-hidden">
                <input
                  type={passLock ? "text" : "password"}
                  className="w-100 mt-2 usernameInput"
                  placeholder="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoComplete="off"
                />
                <button
                  className="visiblePassBtn"
                  onClick={(e) => {
                    e.preventDefault();
                    setPassLock((prev) => !prev);
                  }}
                >
                  {passLock ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>
            <div className="text-end w-75">
              <button onClick={loginHandler} className="adminLoginBtn">
                ورود <ExitToApp />
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
