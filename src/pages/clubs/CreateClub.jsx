import { Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { Button, Chip } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import styles from "../../shared/assets/Tree.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import Tree from "react-d3-tree";


const CreateClub = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [text, setText] = useState([]);
  const [webSiteLink, setWebSiteLink] = useState("");

  const tagInput = useRef();


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

  const createClubHandler = () => {
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
        Data.append("category", selectedCategory._id);
        Data.append("text", text);
        Data.append("siteLink", webSiteLink);

        for (const image of images) {
          Data.append("files", image);
        }

        for (const file of files) {
          Data.append("files", file);
        }

        Data.append("tags", tags);

        const createResult = await axios
          .post('/admin/clubs/create', Data, {
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

  return (
    <Container fluid className="mb-5">
      <Row>
        <SectionTitle title="افزودن باشگاه" />
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
          <Col xs={3} style={{"margin":"20px 0"}}>
            <Form.Label htmlFor="matchesFiles">فایل باشگاه (pdf.) :</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              id="matchesFiles"
              className="mt-1"
              onChange={(e) => setFiles(e.target.files)}
            />
          </Col>
          <Col xs={3} style={{"margin":"20px 0"}}>
            <label>لینک سایت :</label>
            <input
            type="text"
            className="solid_input"
            value={webSiteLink}
            onChange={(e) => setWebSiteLink(e.target.value)}
          />
          </Col>
        </Row>
        <Row>
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
            onClick={createClubHandler}
          >
            ایجاد باشگاه
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateClub;
