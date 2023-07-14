import { Col, Container, Form, Row } from "react-bootstrap";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Button,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';

const EditClub = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [text, setText] = useState([]);
  const [webSiteLink, setWebSiteLink] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

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
        if (item.name === "باشگاه ها" && item.parent === null) return item;
      });
      setCategories(findedCategory);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  async function getClub() {

    const getResult = await axios
      .get(`/admin/clubs/list/${id}`, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      const { title, category, tags, text} = getResult.data.club;
      setTitle(title);
      setSelectedCategory(category);
      setTags(tags);
      setText(text);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  const tagInput = useRef();

  useEffect(() => {
    getCategories();
    getClub();
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

  const updateClubHandler = () => {
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
        for (const category of selectedCategory) {
          Data.append("category[]", category);
        }
        Data.append("text", text);
        Data.append("siteLink", webSiteLink);

        for (const image of images) {
          Data.append("files", image);
        }

        for (const file of files) {
          Data.append("files", file);
        }

        const createResult = await axios
          .patch(`/admin/clubs/update/${id}`, Data, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
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

  const selectCategoryHandler = (ID) => {
    let selecteds = [...selectedCategory];
    if (selecteds.includes(String(ID))) {
      selecteds = selecteds.filter((id) => id !== ID);
    } else {
      selecteds.push(ID);
    }
    setSelectedCategory(selecteds);
  };

  const RenderCategoryChild = ({ data }) => {
    return (
      <div className="ms-2 border-start">
        {data.map((parent) => {
          return (
            <div key={parent._id}>
              <FormControlLabel
                value={parent._id}
                control={
                  <Checkbox
                    size="small"
                    checked={
                      selectedCategory.includes(parent._id) ? true : false
                    }
                    onChange={(e) => selectCategoryHandler(e.target.value)}
                  />
                }
                label={parent.name}
              />

              {parent.children && (
                <RenderCategoryChild data={parent.children} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Container fluid className="mb-5">
      <Row>
        <SectionTitle title="ویرایش باشگاه" />
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
          <Form.Label htmlFor="matchesImage">تصویر باشگاه :</Form.Label>
          <Form.Control
            type="file"
            id="matchesImage"
            className="mt-1"
            multiple
            onChange={(e) => setImages(e.target.files)}
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
        <Row xs={12}>
          <Col xs={3} style={{ margin: "20px 0" }}>
            <Form.Label htmlFor="matchesFiles">فایل باشگاه (pdf.) :</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              id="matchesFiles"
              className="mt-1"
              onChange={(e) => setFiles(e.target.files)}
            />
          </Col>
          <Col xs={3} style={{ margin: "20px 0" }}>
            <label>لینک سایت :</label>
            <input
              type="text"
              className="solid_input"
              value={webSiteLink}
              onChange={(e) => setWebSiteLink(e.target.value)}
            />
          </Col>
        </Row>
        <Col xs={12} style={{"margin":"20px 0"}}>
          <label>متن باشگاه :</label>
          <div className="mt-3">
            <CKEditor
              editor={ClassicEditor}
              onChange={(event, editor) => {
                const data = editor.getData();
                const plainText = data.replace(/<[^>]+>/g, '');
                setText(plainText);
              }}
            />
          </div>
        </Col>
        {categories.length > 0 && (
          <Col xs={6}>
            <label>انتخاب دسته بندی : </label>
            <div className="border rounded-3 mt-3 py-2">
              <FormGroup>
                <RenderCategoryChild data={categories} />
              </FormGroup>
            </div>
          </Col>
        )}
        <Col xs={12} className="text-start mt-4">
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={updateClubHandler}
          >
            ویرایش باشگاه
          </Button>
          <Link to={'/clubs/list'}>
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

export default EditClub;
