import { Col, Container, Row } from "react-bootstrap";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Chip } from "@mui/material";
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';

const EditCategory = () => {
  const [name, setName] = useState("");

  const { id } = useParams();

  async function getCategory() {

    const getResult = await axios
      .get(`/admin/category/list/${id}`, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      console.log(getResult)
      const { name } = getResult.data.category[0];
      setName(name);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  const tagInput = useRef();

  useEffect(() => {
    getCategory();
  }, []);

  const updateCategoryHandler = () => {
    Swal.fire({
      text: "تغییرات ثبت شود ؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ثبت",
      cancelButtonText: "لغو",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const Data = new FormData();
        Data.append("name", name);

        const createResult = await axios
          .patch(`/admin/category/update/${id}`, Data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => res.data)
          .catch((err) => err.response.data);

        if (createResult.statusCode === 200) {
          Swal.fire({
            text: createResult.data.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            text: createResult.message,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <Container fluid className="mb-5">
      <Row>
        <SectionTitle title="ویرایش دسته بندی" />
      </Row>
      <Row className="mt-3">
        <Col xs={3}>
          <label>نام :</label>
          <input
            type="text"
            className="solid_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
        <Col xs={12} className="text-start mt-4">
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={updateCategoryHandler}
          >
            ویرایش دسته بندی
          </Button>
          <Link to={'/category/list'}>
            <Button
              variant="contained"
              className="mx-3"
              color="error"
              size="large"
            >
              بازگشت
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default EditCategory;
