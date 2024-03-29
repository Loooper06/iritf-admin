import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "jalali-moment";
import ReactPaginate from "react-paginate";
import { Avatar, Button } from "@mui/material";
import { Modal } from "antd";
import Slider from "react-slick";
import DefaultImage from "../../shared/assets/images/default-image.jpeg";
import { Link } from "react-router-dom";

import styles from "./DataTable.module.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slick.css";

export default function DataTable({ data, origin, faOrigin, deleteHandler }) {
  const [selectedItem, setSelectedItem] = React.useState({});
  const [modalVisible, setModalVisible] = React.useState(false);

  const sliderRef = React.useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    arrows: false,
  };

  function createData(_id, image, videos, title, text, category, createdAt) {
    return { _id, image, videos, title, text, category, createdAt };
  }

  function createDataForCategory(_id, name) {
    return { _id, name };
  }

  function createDataForRegistrations(
    _id,
    image,
    first_name,
    last_name,
    mobile,
    nationalCode,
    createdAt
  ) {
    return {
      _id,
      image,
      first_name,
      last_name,
      mobile,
      nationalCode,
      createdAt,
    };
  }

  const rows = [];
  if (data !== undefined || data !== null) {
    if (data.length) {
      if (origin !== "categories" && origin !== "registrations") {
        data.map((item) => {
          rows.push(
            createData(
              item._id,
              item.imagesURL
                ? item.imagesURL[0]
                : item.imageURL
                ? item.imageURL
                : undefined,
              item.videos ? item.videos[0] : undefined,
              item.title,
              // item?.text || "",
              item.category
                ? item.category[item.category.length - 1]
                : undefined,
              item.createdAt
            )
          );
        });
      } else if (origin === "categories") {
        data.map((item) => {
          rows.push(createDataForCategory(item._id, item.name));
        });
      } else if (origin === "registrations") {
        data.map((item) => {
          rows.push(
            createDataForRegistrations(
              item._id,
              item.imageURL ? item.imageURL : undefined,
              item.first_name,
              item.last_name,
              item.mobile,
              item.nationalCode,
              item.createdAt
            )
          );
        });
      }
    }
  }

  const viewHandler = (ID) => {
    const item = data.find((item) => item._id === ID);
    console.log(item);
    setSelectedItem(item);
    setModalVisible(true);
  };

  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          origin !== "categories" &&
          origin !== "registrations" &&
          currentItems.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">
                {origin === "videos" ? (
                  <video
                    className={styles.video}
                    src={`${process.env.REACT_APP_API_URL}/${row.videos}`}
                    controls
                  />
                ) : (
                  <Avatar
                    alt={row.title}
                    src={row.image}
                    sx={{ width: 56, height: 56 }}
                  />
                )}
              </TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.category.name}</TableCell>
              <TableCell align="right">
                {moment(row.createdAt).locale("fa").format("jYYYY/jMM/jDD")}
              </TableCell>
              <TableCell align="center">
                {origin === "matches" ? (
                  <>
                    <Link to={`/matches/list/Detail/${row._id}`}>
                      <Button variant="contained" color="info">
                        مشاهده
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => viewHandler(row._id)}
                  >
                    مشاهده
                  </Button>
                )}
                <Link to={`${row._id}`}>
                  <Button variant="contained" color="warning" className="mx-2">
                    ویرایش
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteHandler(row._id)}
                >
                  حذف
                </Button>
              </TableCell>
            </TableRow>
          ))}
        {origin !== "registrations" && (
          <>
            {Object.keys(selectedItem).length !== 0 && (
              <Modal
                title={`مشاهده ${faOrigin}`}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={1000}
                style={{ top: 40 }}
              >
                <hr />
                <div className={styles.itemData}>
                  {origin === "videos" ? (
                    <div className={styles.videosSlider}>
                      <Slider ref={sliderRef} {...settings}>
                        {selectedItem.videos ? (
                          selectedItem.videos.map((videoUrl) => (
                            <div
                              className={styles.videoContainer}
                              key={videoUrl}
                            >
                              <video
                                className={styles.modalVideo}
                                src={`${process.env.REACT_APP_API_URL}/${videoUrl}`}
                                controls
                              />
                            </div>
                          ))
                        ) : (
                          <div className={styles.contentStyle}>
                            <img
                              alt="default-image"
                              style={{
                                width: "100%",
                                height: "400px",
                                "object-fit": "cover",
                              }}
                              src={DefaultImage}
                            />
                          </div>
                        )}
                      </Slider>
                    </div>
                  ) : (
                    <div className={styles.carouselContainer}>
                      <div className={styles.carousel}>
                        <Slider ref={sliderRef} {...settings}>
                          {selectedItem.imagesURL &&
                            selectedItem.imagesURL.map((imageUrl) => (
                              <div
                                className={styles.contentStyle}
                                key={imageUrl}
                              >
                                <img
                                  className={styles.carouselImage}
                                  src={imageUrl}
                                  alt="carousel-item"
                                />
                              </div>
                            ))}

                          {selectedItem.imageURL && (
                            <div
                              className={styles.contentStyle}
                              key={selectedItem.imageURL}
                            >
                              <img
                                className={styles.carouselImage}
                                src={selectedItem.imageURL}
                                alt="carousel-item"
                              />
                            </div>
                          )}

                          {!selectedItem.imageURL &&
                            !selectedItem.imagesURL && (
                              <div className={styles.contentStyle}>
                                <img
                                  alt="default-image"
                                  style={{
                                    width: "100%",
                                    height: "400px",
                                    "object-fit": "cover",
                                  }}
                                  src={DefaultImage}
                                />
                              </div>
                            )}
                        </Slider>
                      </div>
                    </div>
                  )}
                  <h3 style={{ marginBottom: "24px" }}>{selectedItem.title}</h3>
                  <div className="d-flex align-items-center">
                    <h6 className="px-2 pt-1">تاریخ ایجاد :</h6>
                    {moment(selectedItem.createdAt)
                      .locale("fa")
                      .format("jYYYY/jMM/jDD")}
                  </div>
                  <hr />
                  <div>
                    <h5>دسته بندی :</h5>
                    <h6 style={{ margin: "0" }}>
                      {
                        selectedItem.category[selectedItem.category.length - 1]
                          .name
                      }
                    </h6>
                  </div>
                  <hr />
                  <div>
                    <h5>برچسب ها :</h5>
                    <ol>
                      {selectedItem.tags.map((tag) => (
                        <li style={{ listStyle: "unset" }} key={tag}>
                          {tag}
                        </li>
                      ))}
                    </ol>
                  </div>
                  {selectedItem.short_text && (
                    <>
                      <hr />
                      <div
                        style={{ marginBottom: "16px" }}
                        className="short-text"
                      >
                        <h5>متن کوتاه خبر :</h5>
                        <div
                          style={{ marginTop: "12px", lineHeight: "1.8" }}
                          dangerouslySetInnerHTML={{
                            __html: selectedItem.short_text,
                          }}
                        />
                      </div>
                    </>
                  )}
                  {selectedItem.text && (
                    <>
                      <hr />
                      <div
                        style={{ marginBottom: "16px", lineHeight: "1.8" }}
                        className="text"
                      >
                        <h5>متن :</h5>
                        <div
                          style={{ marginTop: "12px" }}
                          dangerouslySetInnerHTML={{
                            __html: selectedItem.text,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </Modal>
            )}
          </>
        )}
        {origin === "categories" &&
          currentItems &&
          currentItems.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="center">
                <Link to={`${row._id}`}>
                  <Button variant="contained" color="warning" className="mx-2">
                    ویرایش
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteHandler(row._id)}
                >
                  حذف
                </Button>
              </TableCell>
            </TableRow>
          ))}
        {origin === "registrations" &&
          currentItems &&
          currentItems.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">
                <Avatar
                  alt={row.first_name}
                  src={row.image}
                  sx={{ width: 56, height: 56 }}
                />
              </TableCell>
              <TableCell align="right">{row.first_name}</TableCell>
              <TableCell align="right">{row.last_name}</TableCell>
              <TableCell align="right">{row.mobile}</TableCell>
              <TableCell align="right">{row.nationalCode}</TableCell>
              <TableCell align="right">
                {moment(row.createdAt).locale("fa").format("jYYYY/jMM/jDD")}
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => viewHandler(row._id)}
                >
                  مشاهده
                </Button>
              </TableCell>
            </TableRow>
          ))}
        {origin === "registrations" && (
          <>
            {Object.keys(selectedItem).length !== 0 && (
              <Modal
                title={`مشاهده ${faOrigin}`}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={1000}
                style={{ top: 40 }}
              >
                <hr />
                <div className={styles.itemData}>
                  <div className={styles.carouselContainer}>
                    <div className={styles.carousel}>
                      <Slider>
                        {selectedItem.imageURL ? (
                          <div
                            className={styles.contentStyle}
                            key={selectedItem._id}
                          >
                            <img
                              className={styles.carouselImage}
                              src={selectedItem.imageURL}
                              alt="carousel-item"
                            />
                          </div>
                        ) : (
                          <div className={styles.contentStyle}>
                            <img
                              alt="default-image"
                              style={{
                                width: "100%",
                                height: "400px",
                                "object-fit": "cover",
                              }}
                              src={DefaultImage}
                            />
                          </div>
                        )}
                      </Slider>
                    </div>
                  </div>
                  <h3 style={{ marginBottom: "24px" }}>{selectedItem.title}</h3>
                  <div className="d-flex align-items-center">
                    <h6 className="px-2 pt-1">تاریخ ایجاد :</h6>
                    {moment(selectedItem.createdAt)
                      .locale("fa")
                      .format("jYYYY/jMM/jDD")}
                  </div>
                  <hr />
                  <div>
                    <h6>نام</h6>
                    <h5 style={{ margin: "0" }}>{selectedItem.first_name}</h5>
                  </div>
                  <hr />
                  <div>
                    <h6>نام خانوادگی</h6>
                    <h5 style={{ margin: "0" }}>{selectedItem.last_name}</h5>
                  </div>
                  <hr />
                  <div>
                    <h6>شماره تلفن</h6>
                    <h5 style={{ margin: "0" }}>{selectedItem.mobile}</h5>
                  </div>
                  <hr />
                  <div>
                    <h6>کدملی</h6>
                    <h5 style={{ margin: "0" }}>{selectedItem.nationalCode}</h5>
                  </div>
                </div>
              </Modal>
            )}
          </>
        )}
      </>
    );
  }

  function PaginatedItems({ itemsPerPage }) {
    const [itemOffset, setItemOffset] = React.useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = rows.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(rows.length / itemsPerPage);
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % rows.length;
      setItemOffset(newOffset);
    };

    return (
      <>
        <Items currentItems={currentItems} />
        <section className="my-2" />
        <ReactPaginate
          nextLabel="بعدی"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="قبلی"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </>
    );
  }

  return (
    <TableContainer component={Paper}>
      {data.length ? (
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <>
                {origin !== "categories" && origin !== "registrations" && (
                  <>
                    {origin === "videos" ? (
                      <TableCell align="right">ویدیو</TableCell>
                    ) : (
                      <TableCell align="right">تصویر</TableCell>
                    )}
                    <TableCell align="right">عنوان</TableCell>
                    <TableCell align="right">دسته بندی</TableCell>
                    <TableCell align="right">تاریخ ایجاد</TableCell>
                    <TableCell align="center">عملیات</TableCell>
                  </>
                )}
                {origin === "categories" && (
                  <>
                    <TableCell align="right">دسته بندی</TableCell>
                    <TableCell align="center">عملیات</TableCell>
                  </>
                )}

                {origin === "registrations" && (
                  <>
                    <TableCell align="right">تصویر فیش</TableCell>
                    <TableCell align="right">نام</TableCell>
                    <TableCell align="right">نام خانوادگی</TableCell>
                    <TableCell align="right">شماره تلفن</TableCell>
                    <TableCell align="right">کدملی</TableCell>
                    <TableCell align="right">تاریخ ایجاد</TableCell>
                    <TableCell align="center">عملیات</TableCell>
                  </>
                )}
              </>
            </TableRow>
          </TableHead>
          <TableBody>
            <PaginatedItems itemsPerPage={8} />
          </TableBody>
        </Table>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "150px" }}
        >
          <h2 className="text-info">اطلاعاتی یافت نشد !</h2>
        </div>
      )}
    </TableContainer>
  );
}
