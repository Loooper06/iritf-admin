import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from "react-bootstrap";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Chip } from "@mui/material";
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import moment from "jalali-moment";

const MatchDetail = () => {
  const [match, setMatch] = useState(); 

  const { id } = useParams();

  async function getMatch() {

    const getResult = await axios
      .get(`/admin/matches/list/${id}`, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response);

    if (getResult.statusCode === 200) {
      setMatch(getResult.data.match);
    } else
      Swal.fire({
        text: getResult.message,
        icon: "error",
      });
  }

  useEffect(() => {
    getMatch();
  }, [])

  return(
    <Container fluid className="mb-5">
      <Row>
        <SectionTitle title="مشاهده مسابقه" />
      </Row>
      {match && (
        <Card className="mt-3">
          <Row>
            <img src={match.imageURL} alt={match.title} />
          </Row>
          <Card.Body>
            <Row>
              <h5 className='mb-4 mt-2'>{match.title}</h5>
              <Row>
                <div style={{"color":"#767676", "fontSize":"14px"}} className="mb-2 detail-date">
                  <div style={{"marginBottom":"20px"}}>
                    <span>تاریخ ایجاد</span>
                    <h6 className='mt-2'>{moment(match.createdAt).locale("fa").format("jYYYY/jMM/jDD")}</h6>
                  </div>
                  <hr />
                  <div>
                    <span>دسته بندی</span>
                    <h6 className='mt-2'><span>{match.category.name}</span></h6>
                  </div>
                  <hr />
                </div>
              </Row>
              <Col sx={12} className='pe-md-4 card-info'>
                <div>
                  <span>تاریخ انقضا :</span>
                  <span><h6 className="mt-3" style={{"display":"inline"}}>{moment(match.expireDate).locale("fa").format("jYYYY/jMM/jDD")}</h6></span>
                </div>
                <hr />
                <div>
                  <span style={{"color":"#767676", "fontSize":"14px"}}>توضیحات</span>
                  <p className='pt-3 mt-2'>
                    {match.description}
                  </p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default MatchDetail;