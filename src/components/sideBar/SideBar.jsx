import { Link, useLocation } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./SideBar.module.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import cls from "classnames";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import SportsTennisOutlinedIcon from "@mui/icons-material/SportsTennisOutlined";
import GroupsIcon from '@mui/icons-material/Groups';
import AutoAwesomeMosaicOutlinedIcon from "@mui/icons-material/AutoAwesomeMosaicOutlined";
import CategoryIcon from '@mui/icons-material/Category';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

const SideBar = () => {
  const location = useLocation();
  const sideNavsRoutes = [
    {
      id: "1",
      title: "دسته بندی",
      icon: <CategoryIcon />,
      path: "/category",
      children: [
        { id: "1.1", title: "افزودن دسته بندی", path: "/category/create" },
        { id: "1.2", title: "لیست دسته بندی", path: "/category/list" },
      ],
    },
    {
      id: "2",
      title: "اخبار",
      icon: <NewspaperOutlinedIcon />,
      path: "/news",
      children: [
        { id: "2.1", title: "افزودن خبر", path: "/news/create" },
        { id: "2.2", title: "لیست اخبار", path: "/news/list" },
      ],
    },
    {
      id: "3",
      title: "رنکینگ ها",
      icon: <MilitaryTechOutlinedIcon />,
      path: "/ranks",
      children: [
        { id: "3.1", title: "افزودن رنکینگ", path: "/ranks/create" },
        { id: "3.2", title: "لیست رنکینگ ها", path: "/ranks/list" },
      ],
    },
    {
      id: "4",
      title: "تقویم ها",
      icon: <EditCalendarOutlinedIcon />,
      path: "/calendars",
      children: [
        { id: "4.1", title: "افزودن تقویم", path: "/calendars/create" },
        { id: "4.2", title: "لیست تقویم ها", path: "/calendars/list" },
      ],
    },
    {
      id: "5",
      title: "فرم ها",
      icon: <InsertDriveFileOutlinedIcon />,
      path: "/forms",
      children: [
        {
          id: "5.1",
          title: "افزودن فرم",
          path: "/forms/create",
        },
        { id: "5.2", title: "لیست فرم ها", path: "/forms/list" },
      ],
    },
    {
      id: "6",
      title: "ویدیو ها",
      icon: <OndemandVideoOutlinedIcon />,
      path: "/videos",
      children: [
        {
          id: "6.1",
          title: "افزودن ویدیو",
          path: "/videos/create",
        },
        {
          id: "6.2",
          title: "لیست ویدیو ها",
          path: "/videos/list",
        },
      ],
    },
    {
      id: "7",
      title: "کمیته ها",
      icon: <Diversity1OutlinedIcon />,
      path: "/committees",
      children: [
        {
          id: "7.1",
          title: "افزودن کمیته",
          path: "/committees/create",
        },
        {
          id: "7.2",
          title: "لیست کمیته ها",
          path: "/committees/list",
        },
      ],
    },
    {
      id: "8",
      title: "مسابقات",
      icon: <SportsTennisOutlinedIcon />,
      path: "/matches",
      children: [
        {
          id: "8.1",
          title: "افزودن مسابقه",
          path: "/matches/create",
        },
        {
          id: "8.2",
          title: "لیست مسابقه ها",
          path: "/matches/list",
        },
      ],
    },
    {
      id: "9",
      title: "باشگاه ها",
      icon: <GroupsIcon />,
      path: "/clubs",
      children: [
        {
          id: "9.1",
          title: "افزودن باشگاه",
          path: "/clubs/create",
        },
        {
          id: "9.2",
          title: "لیست باشگاه ها",
          path: "/clubs/list",
        },
      ],
    },
    {
      id: "10",
      title: "گزارش تصویری",
      icon: <AutoAwesomeMosaicOutlinedIcon />,
      path: "/image-reports",
      children: [
        {
          id: "10.1",
          title: "افزودن گزارش",
          path: "/image-reports/create",
        },
        {
          id: "10.2",
          title: "لیست گزارش ها",
          path: "/image-reports/list",
        },
      ],
    },
  ];
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container fluid className={styles.sideBarWrapper}>
      <Row>
        <Col className="pt-1 border-bottom text-secondary d-flex justify-content-start align-items-center">
          <MenuIcon />
          <h5 className="ms-2 mt-1">منو</h5>
        </Col>
      </Row>
      <Row>
        {sideNavsRoutes.map((item) => (
          <Col xs={12} className="px-0" key={item.id}>
            <Accordion
              sx={{ width: "100%", margin: "1px 0" }}
              expanded={expanded === item.id}
              onChange={handleChange(item.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography
                  sx={{ width: "100%", flexShrink: 1, fontSize: "14px" }}
                >
                  <span>{item.icon}</span>
                  {item.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul className={cls("p-0 m-0", styles.NavsWrapper)}>
                  {item.children.map((childNav) => (
                    <Link to={childNav.path} key={childNav.id}>
                      <li
                        style={{ listStyleType: "disc" }}
                        className={
                          location.pathname.match(childNav.path)
                            ? cls(styles.subSidebarNavs, styles.activeNav)
                            : styles.subSidebarNavs
                        }
                      >
                        {childNav.title}
                      </li>
                    </Link>
                  ))}
                </ul>
              </AccordionDetails>
            </Accordion>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SideBar;
