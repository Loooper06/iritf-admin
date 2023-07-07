import SignIn from "./pages/SignIn/SignIn.jsx";
import CalendarsList from "./pages/calendars/CalendarsList.jsx";
import CreateCalendar from "./pages/calendars/CreateCalendar.jsx";
import ClubsList from "./pages/clubs/ClubsList.jsx";
import CreateClub from "./pages/clubs/CreateClub.jsx";
import EditClub from "./pages/clubs/EditClub.jsx";
import CommitteesList from "./pages/committees/CommitteesList.jsx";
import CreateCommittee from "./pages/committees/CreateCommittee.jsx";
import CreateForm from "./pages/forms/CreateForm.jsx";
import FormsList from "./pages/forms/FormsList.jsx";
import Home from "./pages/home/Home.jsx";
import CreateReport from "./pages/image_reports/CreateReport.jsx";
import ReportsList from "./pages/image_reports/ReportsList.jsx";
import CreateMatch from "./pages/matches/CreateMatch.jsx";
import EditMatch from "./pages/matches/EditMatch.jsx";
import MatchesList from "./pages/matches/MatchesList.jsx";
import MatchDetail from "./pages/matches/MatchDetail.jsx";
import CreateNews from "./pages/news/CreateNews.jsx";
import EditNews from "./pages/news/EditNews.jsx";
import NewsList from "./pages/news/NewsList.jsx";
import CreateRank from "./pages/ranks/CreateRank.jsx";
import EditRank from "./pages/ranks/EditRank.jsx";
import RanksList from "./pages/ranks/RanksList.jsx";
import CreateVideo from "./pages/videos/CreateVideo.jsx";
import EditVideo from "./pages/videos/EditVideo.jsx";
import EditCalendar from "./pages/calendars/EditCalender.jsx";
import VideosList from "./pages/videos/VideosList.jsx";
import EditForm from "./pages/forms/EditForm.jsx";
import EditCommittee from "./pages/committees/EditCommittee.jsx";
import EditReport from "./pages/image_reports/EditReport.jsx";

const router = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <SignIn /> },
  { path: "/news/create", element: <CreateNews /> },
  {
    path: "/news/list",
    element: <NewsList />,
  },
  {
    path: "/news/list",
    element: <EditNews />,
    children: [{ path: ":id" }],
  },
  { path: "/ranks/create", element: <CreateRank /> },
  { path: "/ranks/list", element: <RanksList /> },
  {
    path: "/ranks/list",
    element: <EditRank />,
    children: [{ path: ":id" }],
  },
  { path: "/calendars/create", element: <CreateCalendar /> },
  { path: "/calendars/list", element: <CalendarsList /> },
  {
    path: "/calendars/list",
    element: <EditCalendar/>,
    children: [{ path: ":id" }],
  },
  { path: "/forms/create", element: <CreateForm /> },
  { path: "/forms/list", element: <FormsList /> },
  {
    path: "/forms/list",
    element: <EditForm />,
    children: [{ path: ":id" }],
  },
  { path: "/videos/create", element: <CreateVideo /> },
  { path: "/videos/list", element: <VideosList /> },
  {
    path: "/videos/list",
    element: <EditVideo />,
    children: [{ path: ":id" }],
  },
  { path: "/committees/create", element: <CreateCommittee /> },
  { path: "/committees/list", element: <CommitteesList /> },
  {
    path: "/committees/list",
    element: <EditCommittee/>,
    children: [{ path: ":id" }],
  },
  { path: "/matches/create", element: <CreateMatch /> },
  { path: "/matches/list", element: <MatchesList /> },
  {
    path: "/matches/list",
    element: <EditMatch/>,
    children: [{ path: ":id" }],
  },
  {
    path: "/matches/list/Detail",
    element: <MatchDetail/>,
    children: [{ path: ":id" }],
  },
  { path: "/clubs/create", element: <CreateClub /> },
  { path: "/clubs/list", element: <ClubsList /> },
  {
    path: "/clubs/list",
    element: <EditClub/>,
    children: [{ path: ":id" }],
  },
  { path: "/image-reports/create", element: <CreateReport /> },
  { path: "/image-reports/list", element: <ReportsList /> },
  {
    path: "/image-reports/list",
    element: <EditReport/>,
    children: [{ path: ":id" }],
  },
];

export default router;
