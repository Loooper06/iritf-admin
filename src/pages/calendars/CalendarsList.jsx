import { Container, Row } from "react-bootstrap";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DataTable from "../../components/dataTable/DataTable";
import { Button } from "@mui/material";


const CalendarsList = () => {
  const [calendars, setCalendars] = useState([]);
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(false);

  async function getCalendarsList() {
    const result = await axios
      .get('/admin/calendars/list', {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);
    if (result.statusCode === 200) setCalendars(result.data.calendars);
    else {
      Swal.fire({
        text: result.message,
        icon: "error",
      });
    }
  }

  const deleteCalendarHandler = (calendarId) => {
    Swal.fire({
      text: " تقویم حذف شود ؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ثبت",
      cancelButtonText: "لغو",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const createResult = await axios
          .delete(`/admin/calendars/remove/${calendarId}`, {
            withCredentials: true,
          })
          .then((res) => res.data)
          .catch((err) => err.response.data);

        if (createResult.statusCode === 200) {
          Swal.fire({
            text: createResult.data.message,
            icon: "success",
          });
          getCalendarsList();
        } else {
          Swal.fire({
            text: createResult.message,
            icon: "error",
          });
        }
      }
    })
  }

  useEffect(() => {
    setReload((prev) => !prev);
  }, []);

  useEffect(() => {
    getCalendarsList();
  }, [reload]);

  const searchHandler = async () => {
    const result = await axios
      .get('/admin/calendars/list/search', {
        withCredentials: true,
        params: { search },
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);
    if (result.statusCode === 200) setCalendars(result.data.calendars);
    else {
      Swal.fire({
        text: result.message,
        icon: "error",
      });
    }
  };

  return (
    <Container fluid className="mb-5 px-4">
      <Row>
        <SectionTitle title="لیست تقویم ها" />
      </Row>
      <Row className="mt-3">
        <label>جستجو :</label>
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="solid_input"
            style={{ maxWidth: "300px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="ms-3"
            variant="contained"
            color="secondary"
            onClick={searchHandler}
          >
            پیدا کن !
          </Button>
          <Button
            className="ms-1"
            variant="contained"
            color="info"
            onClick={() => {
              setReload((prev) => !prev);
              setSearch("");
            }}
          >
            بروزرسانی
          </Button>
        </div>
      </Row>
      <Row className="mt-4">
        {calendars && <DataTable data={calendars} origin="calendars" faOrigin="تقویم" deleteHandler={deleteCalendarHandler} />}
      </Row>
    </Container>
  );
};

export default CalendarsList;
