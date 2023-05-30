import SignIn from "./pages/SignIn/SignIn.jsx";
import CalendarsList from "./pages/calendars/CalendarsList.jsx";
import CreateCalendar from "./pages/calendars/CreateCalendar.jsx";
import CommitteesList from "./pages/committees/CommitteesList.jsx";
import CreateCommittee from "./pages/committees/CreateCommittee.jsx";
import CreateForm from "./pages/froms/CreateForm.jsx";
import FormsList from "./pages/froms/FormsList.jsx";
import Home from "./pages/home/Home.jsx";
import CreateReport from "./pages/image_reports/CreateReport.jsx";
import ReportsList from "./pages/image_reports/ReportsList.jsx";
import CreateMatch from "./pages/matches/CreateMatch.jsx";
import MatchesList from "./pages/matches/MatchesList.jsx";
import CreateNews from "./pages/news/CreateNews.jsx";
import NewsList from "./pages/news/NewsList.jsx";
import CreateRank from "./pages/ranks/CreateRank.jsx";
import RanksList from "./pages/ranks/RanksList.jsx";
import CreateVideo from "./pages/videos/CreateVideo.jsx";
import VideosList from "./pages/videos/VideosList.jsx";

const router = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <SignIn /> },
  { path: "/news/create", element: <CreateNews /> },
  { path: "/news/list", element: <NewsList /> },
  { path: "/ranks/create", element: <CreateRank /> },
  { path: "/ranks/list", element: <RanksList /> },
  { path: "/calendars/create", element: <CreateCalendar /> },
  { path: "/calendars/list", element: <CalendarsList /> },
  { path: "/forms/create", element: <CreateForm /> },
  { path: "/forms/list", element: <FormsList /> },
  { path: "/videos/create", element: <CreateVideo /> },
  { path: "/videos/list", element: <VideosList /> },
  { path: "/committees/create", element: <CreateCommittee /> },
  { path: "/committees/list", element: <CommitteesList /> },
  { path: "/matches/create", element: <CreateMatch /> },
  { path: "/matches/list", element: <MatchesList /> },
  { path: "/image-reports/create", element: <CreateReport /> },
  { path: "/image-reports/list", element: <ReportsList /> },
];

export default router;
