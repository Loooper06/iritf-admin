import { Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import axios from "axios";
import Swal from "sweetalert2";

const CreateForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);

  const tagInput = useRef();

  async function getCategories() {
    const getResult = await axios
      .get("/admin/category/parents", {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      const findedCategory = getResult.data.parents.filter((item) => {
        if (item.name === "فرم ها" && item.parent === null) return item;
      });
      setCategories(findedCategory);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  useEffect(() => {
    getCategories();
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

  const createFormsHandler = () => {
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
        Data.append("title", title);
        for (const category of selectedCategory) {
          Data.append("category", category);
        }

        for (const image of images) {
          Data.append("files", image);
        }

        for (const file of files) {
          Data.append("files", file);
        }

        Data.append("tags", tags);

        const createResult = await axios
          .post("/admin/forms/create", Data, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
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
        <SectionTitle title="افزودن فرم" />
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
          <Form.Label htmlFor="fromsImage">تصویر فرم :</Form.Label>
          <Form.Control
            type="file"
            id="fromsImage"
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
        <Col xs={12}>
          <Col xs={3} style={{ margin: "20px 0" }}>
            <Form.Label htmlFor="fromsFiles">فایل فرم (pdf.) :</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              id="fromsFiles"
              className="mt-1"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </Col>
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
            onClick={createFormsHandler}
          >
            ایجاد فرم
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateForm;
