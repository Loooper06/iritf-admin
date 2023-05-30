import { Container, Row, Col } from "react-bootstrap";
import moment from "jalali-moment";
import { Button } from "@mui/material";

const Hedaer = () => {
  const now = new Date();

  return (
    <Container fluid className="border-bottom py-3">
      <Row>
        <Col md={6} className="d-flex justify-content-start align-items-center">
          <h5>{moment(now).locale("fa").format("jYYYY/jMM/jDD")}</h5>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="contained" color="warning">
            خروج
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Hedaer;
