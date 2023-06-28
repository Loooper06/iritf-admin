import React, { useEffect, useState } from "react";
import { checkAuth } from "../../utils/checkAuth";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import { Link } from 'react-router-dom';


const dataCards = [
  {
    id: "1",
    title: "تعداد اخبار",
    key: "news",
    path:"/news/list",
    count: 0,
  },
  {
    id: "2",
    title: "تعداد رنکینگ ها",
    key: "ranks",
    path:"/ranks/list",
    count: 0,
  },
  {
    id: "3",
    title: "تعداد تقویم ها",
    key: "calendars",
    path:"/calendars/list",
    count: 0,
  },
  {
    id: "4",
    title: "تعداد فرم ها",
    key: "forms",
    path:"/forms/list",
    count: 0,
  },
  {
    id: "5",
    title: "تعداد ویدیو ها",
    key: "videos",
    path:"/videos/list",
    count: 0,
  },
  {
    id: "6",
    title: "تعداد کمیته ها",
    key: "committees",
    path:"/committees/list",
    count: 0,
  },
  {
    id: "7",
    title: "تعداد مسابقات",
    key: "matches",
    path:"/matches/list",
    count: 0,
  },
  {
    id: "8",
    title: "تعداد باشگاه ها",
    key: "clubs",
    path:"/clubs/list",
    count: 0,
  },
  {
    id: "9",
    title: "تعداد گزارش تصویری",
    key: "reports",
    path:"/reports/list",
    count: 0,
  },

]

const dataCard = (dataList) => {
  dataList.map((data) => {
    dataCards.map((card) => {
      if (card.key === Object.keys(data)[0]) {
        card.count = data[Object.keys(data)[0]].length
      }
    })
  })
}

const Home = () => {
  const [data , setData] = useState([]);

  const navigate = useNavigate();

  async function checkSignin() {
    console.log("yes")
    const signIn = await checkAuth();
    if (signIn?.statusCode !== 200) navigate("/login");
    else getData();
  }

  const getData = async () => {
    axios.all([
      axios.get('/admin/news/list'),
      axios.get('/admin/ranks/list'),
      axios.get('/admin/calendars/list'),
      axios.get('/admin/forms/list'),
      axios.get('/admin/videos/list'),
      axios.get('/admin/committees/list'),
      axios.get('/admin/matches/list'),
      // axios.get('/admin/clubs/list'),
      axios.get('/admin/reports/list'),
    ])
    .then(
      axios.spread((news, ranks, calendars, forms, videos, committees, matches, reports) => {
        setData([news.data.data, ranks.data.data, calendars.data.data, forms.data.data, videos.data.data, committees.data.data, matches.data.data, reports.data.data])
      }),
      );
  }

  useEffect(() => {
    checkSignin();
  }, []);

  useEffect(() => {
    dataCard(data);
  }, [data]);

  return (
    <div style={{"margin":"24px" ,"marginLeft":"40px"}}>
      <Row>
        {dataCards.map((data) => (
          <Col sm={4} className="mb-4" key={data.id}>
            <Link to={data.path}>
              <Card>
                <Card.Body>
                  <Card.Title>{data.title}</Card.Title>
                  <Card.Text style={{"direction":"ltr"}}>
                    <Badge bg="primary"><h3 className="m-0">{data.count}</h3></Badge>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
