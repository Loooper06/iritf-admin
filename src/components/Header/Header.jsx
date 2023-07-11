import { Container, Row, Col } from "react-bootstrap";
import moment from "jalali-moment";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Hedaer = () => {
  const now = new Date();
  const navigate = useNavigate();

  const logoutHandler = () => {
    Swal.fire({
      text: "برای خروج از سیستم مطمعن هستید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "خارج شو",
      cancelButtonText: "انصراف",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const logOutResult = await axios
          .get(`${process.env.REACT_APP_API_URL}/users/auth/logout`, {
            withCredentials: true,
          })
          .then((res) => res.data)
          .catch((err) => err.response.data);
        if (logOutResult?.statusCode && logOutResult?.statusCode === 200) {
          Swal.fire({
            text: logOutResult.data.message,
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          Swal.fire({
            text: logOutResult.message,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <Container fluid className="border-bottom py-3">
      <Row>
        <Col md={6} className="d-flex justify-content-start align-items-center">
          <h5>{moment(now).locale("fa").format("jYYYY/jMM/jDD")}</h5>
        </Col>
        <Col md={6} className="text-end">
          <Link to={"/"}>
            <Button variant="contained" className="mx-2">
              خانه
            </Button>
          </Link>
          <Link to={"/"}>
            <Button variant="contained" color="warning" onClick={logoutHandler}>
              خروج
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Hedaer;
