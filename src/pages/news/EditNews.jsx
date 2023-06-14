import { Col, Container, Form, Row } from "react-bootstrap";
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

const EditNews = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [text, setText] = useState([]);
  const [short_text, setShort_text] = useState([]);

  const { id } = useParams();

  async function getCategories() {
    const getResult = await axios
      .get(`${process.env.REACT_APP_API_URL}/admin/category/parents`, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      const findedCategory = getResult.data.parents.filter((item) => {
        if (item.name === "اخبار" &&  item.parent === null) return item;
      });
      setCategories(findedCategory);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  async function getNews() {
    const parseText = (text) => {
      const parser = new DOMParser();
      const textHTML = parser.parseFromString(text, 'text/html');
      const p = textHTML.querySelector('p');
      const actualText = p.textContent;
      return actualText;
    }

    const getResult = await axios
      .get(`${process.env.REACT_APP_API_URL}/admin/news/list/${id}`, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      const { title, category, tags, images, text, short_text } = getResult.data.news;
      const correctShortText = parseText(short_text);
      const correctText = parseText(text);
      setTitle(title);
      setSelectedCategory(category);
      setImages(images);
      setTags(tags);
      setText(correctText);
      setShort_text(correctShortText);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  const tagInput = useRef();

  useEffect(() => {
    getCategories();
    getNews();
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

  const updateNewsHandler = () => {
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
        Data.append("category", selectedCategory._id);
        Data.append("tags", tags);
        Data.append("text", text);
        Data.append("short_text", short_text);

        const createResult = await axios
          .patch(`${process.env.REACT_APP_API_URL}/admin/news/update/${id}`, Data, {
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
        <SectionTitle title="ویرایش خبر" />
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
          <label>متن خبر :</label>
          <div className="mt-3">
            <CKEditor
              editor={ClassicEditor}
              onChange={(event, editor) => {
                const data = editor.getData();
                setText(data);
              }}
              data = {text}
            />
          </div>
        </Col>
        <Col xs={6} className="mt-4">
          <label>متن کوتاه خبر :</label>
          <div className="mt-3">
            <CKEditor
              editor={ClassicEditor}
              onChange={(event, editor) => {
                const data = editor.getData();
                setShort_text(data);
              }}
              data={short_text}
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
            onClick={updateNewsHandler}
          >
            ویرایش خبر
          </Button>
          <Link to={'/news/list'}>
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

export default EditNews;
