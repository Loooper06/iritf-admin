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

export default function DataTable({ data, origin }) {
  const [selectedItem, setSelectedItem] = React.useState({});
  function createData(_id, image, title, category, createdAt) {
    return { _id, image, title, category, createdAt };
  }

  const rows = [];
  data.map((item) => {
    rows.push(
      createData(
        item._id,
        item.imagesURL[0],
        item.title,
        item.category,
        item.createdAt
      )
    );
  });

  const viewHandler = (ID) => {
    const item = rows.find((item) => item._id === ID);
  };

  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="right">
                <Avatar
                  alt="Remy Sharp"
                  src={row.image}
                  sx={{ width: 56, height: 56 }}
                />
              </TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.category.name}</TableCell>
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
                <Button variant="contained" color="warning" className="mx-2">
                  ویرایش
                </Button>
                <Button variant="contained" color="error">
                  حذف
                </Button>
              </TableCell>
            </TableRow>
          ))}
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
              <TableCell align="right">تصویر</TableCell>
              <TableCell align="right">عنوان</TableCell>
              <TableCell align="right">دسته بندی</TableCell>
              <TableCell align="right">تاریخ ایجاد</TableCell>
              <TableCell align="center">عملیات</TableCell>
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
          <h2 className="text-info">اطلاعاتی یافت نشد :(</h2>
        </div>
      )}
    </TableContainer>
  );
}
