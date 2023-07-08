import { Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import styles from "../../shared/assets/Tree.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import Tree from "react-d3-tree";


const CreateCategory = () => {
  const [parentCategories, setParentCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  async function getParentCategories() {
    const getResult = await axios
      .get('/admin/category/list-of-all', {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      const findedCategory = getResult.data.categories.filter((item) => {
        if (item.parent === null) return item;
      });
      setParentCategories(findedCategory);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  async function getCategories() {
    const getResult = await axios
      .get('/admin/category/parents', {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      const findedCategory = getResult.data.parents.filter((item) => {
        if (item.name === selectedOption &&  item.parent === null) return item;
      });
      setCategories(findedCategory);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  useEffect(() => {
    getParentCategories();
  });

  useEffect(() => {
    getCategories();
  }, [selectedOption]);

  const createCategoryHandler = () => {
    Swal.fire({
      text: "اطلاعات ثبت شود ؟",
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
        if (selectedCategory._id) {
          Data.append("parent", selectedCategory._id);
        }

        const createResult = await axios
          .post('/admin/category/add', Data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => res.data)
          .catch((err) => err.response.data);

        if (createResult.statusCode === 201) {
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
        <SectionTitle title="افزودن دسته بندی" />
      </Row>
      <Row className="mt-3">
        <Row xs={12}>
          <Col xs={3}>
            <label>نام :</label>
            <input
              type="text"
              className="solid_input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col xs={3} className="mt-1">
            <label className="pb-2">انتخاب دسته بندی اصلی :</label>
            <Form.Select value={selectedOption} onChange={handleChange}>
              <option value="">----</option>
              {parentCategories.map((option) => (
                <option key={option._id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Col xs={6} className="mt-4">
          <label>دسته بندی :</label>
          {categories.length && (
            <div
              id="treeWrapper"
              style={{ width: "100%", height: "30rem" }}
              className="border rounded mt-3"
            >
              <Tree
                data={categories}
                rootNodeClassName={styles.node__root}
                branchNodeClassName={styles.node__branch}
                leafNodeClassName={styles.node__leaf}
                orientation="vertical"
                onNodeClick={(node) => setSelectedCategory(node.data)}
                collapsible={false}
              />
            </div>
          )}
        </Col>
        <Col xs={2} className="mt-4">
          <label>دسته بندی انتخاب شده :</label>
          <div className="solid_input">{selectedCategory.name}</div>
        </Col>
        <Col xs={12} className="text-start mt-4">
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={createCategoryHandler}
          >
            ایجاد دسته بندی
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateCategory;
