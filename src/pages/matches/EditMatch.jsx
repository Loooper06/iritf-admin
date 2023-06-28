import { Col, Container, Row } from "react-bootstrap";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Tree from "react-d3-tree";
import styles from "../../shared/assets/Tree.module.css";
import { Button, Chip } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';

const EditMatch = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState([]);

  const { id } = useParams();

  async function getCategories() {
    const getResult = await axios
      .get('/admin/category/parents', {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      const findedCategory = getResult.data.parents.filter((item) => {
        if (item.name === "اخبار" && item.parent === null) return item;
      });
      setCategories(findedCategory);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  async function getMatch() {
    const parseText = (text) => {
      const parser = new DOMParser();
      const textHTML = parser.parseFromString(text, 'text/html');
      const p = textHTML.querySelector('p');
      const actualText = p.textContent;
      return actualText;
    }

    const getResult = await axios
      .get(`/admin/matches/list/${id}`, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      const { title, category, tags, description } = getResult.data.match;
      const correctText = parseText(description);
      setTitle(title);
      setTags(tags);
      setSelectedCategory(category);
      setDescription(correctText)
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  const tagInput = useRef();

  useEffect(() => {
    getCategories();
    getMatch();
  }, []);

  const addTagHandler = (event) => {
    if (event.code === "Enter") {
      if (tags.includes(event.target.value)) {
        Swal.fire({
          text: "برچسب قبلا اضافه شده است",
          icon: "warning",
        });
      } else {
        const tagsDup = [...tags];
        tagsDup.push(event.target.value);
        setTags(tagsDup);
        tagInput.current.value = "";
      }
    }
  };

  const deleteTagHandler = (item) => {
    let tagsDup = [...tags];
    if (!tags.includes(item)) {
      Swal.fire({
        text: "برچسب وجود ندارد",
        icon: "warning",
      });
    } else {
      tagsDup = tagsDup.filter((tag) => tag !== item);
      setTags(tagsDup);
    }
  };

  const updateMatchHandler = () => {
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
        Data.append("title", title);
        Data.append("tags", tags);
        Data.append("category", selectedCategory._id);
        Data.append("description", description);

        const createResult = await axios
          .patch(`/admin/matches/update/${id}`, Data, {
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
        <SectionTitle title="ویرایش مسابقه" />
      </Row>
      <Row className="mt-3">
        <Col xs={3}>
          <label>عنوان :</label>
          <input
            type="text"
            className="solid_input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Col>
        <Col xs={3}>
          <label>برچسب :</label>
          <input
            ref={tagInput}
            type="text"
            className="solid_input"
            onKeyUp={(e) => addTagHandler(e)}
          />
        </Col>
        <Col xs={3}>
          <label>برچسب های انتخاب شده :</label>
          <div className="border p-3 rounded mt-2">
            {tags.map((item) => (
              <Chip
                sx={{ direction: "ltr", margin: "0 5px" }}
                key={item}
                label={item}
                onDelete={() => deleteTagHandler(item)}
              />
            ))}
          </div>
        </Col>
        <Col xs={6} className="mt-4">
          <label>توضیحات مسابقه :</label>
          <div className="mt-3">
            <CKEditor
              editor={ClassicEditor}
              onChange={(event, editor) => {
                const data = editor.getData();
                setDescription(data);
              }}
              data = {description}
            />
          </div>
        </Col>
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
            onClick={updateMatchHandler}
          >
            ویرایش مسابقه
          </Button>
          <Link to={'/matches/list'}>
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

export default EditMatch;
