import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import routes from "./router";
import Hedaer from "./components/Header/Header";
import SideBar from "./components/sideBar/SideBar";

function App() {
  const location = useLocation();
  const router = useRoutes(routes);
  const navigate = useNavigate();
  return (
    <Container fluid className="px-0">
      {!location.pathname.match("/login") && <Hedaer />}
      <Row>
        <Col
          xs={0}
          md={2}
          className={
            location.pathname.match("/login")
              ? "d-none"
              : "d-none d-md-block border-end pe-0"
          }
        >
          <aside>
            <SideBar />
          </aside>
        </Col>
        <Col xs={12} md={location.pathname.match("/login") ? 12 : 10}>
          <main>{router}</main>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
