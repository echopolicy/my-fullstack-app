// routes.js
import Home from './pages/Home';
import PollFeed from './pages/PollFeed';
import PollDetail from './pages/PollDetail';
import PollResults from './pages/PollResults';
import PollCreate from './pages/PollCreate';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import PrivacyPolicy from "./pages/PrivacyPolicy";  
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PollEdit from './pages/PollEdit';
import Forum from './components/Forum';
import Settings from './pages/settings';

const routes = [
  {
    path: "/",
    element: <Home />,
    seo: {
      title: "Home | EchoPolicy",
      description: "Welcome to EchoPolicy — create, share, and vote on polls easily."
    }
  },
  {
    path: "/polls",
    element: <PollFeed />,
    seo: {
      title: "Polls | EchoPolicy",
      description: "Browse the latest polls and cast your votes."
    }
  },
  {
    path: "/polls/:id",
    element: <PollDetail />,
    seo: {
      title: "Poll Details | EchoPolicy",
      description: "View details and vote on this poll."
    }
  },
  {
    path: "/results/:id",
    element: <PollResults />,
    seo: {
      title: "Poll Results | EchoPolicy",
      description: "Check out the results of this poll."
    }
  },
  {
    path: "/admin/create",
    element: <PollCreate />,
    seo: {
      title: "Create Poll (Admin) | EchoPolicy",
      description: "Admins can create new polls here."
    }
  },
  {
    path: "/create",
    element: <PollCreate />,
    seo: {
      title: "Create Poll | EchoPolicy",
      description: "Create your own poll and share it with others."
    }
  },
  {
    path: "/login",
    element: <Login />,
    seo: {
      title: "Login | EchoPolicy",
      description: "Login to your EchoPolicy account."
    }
  },
  {
    path: "/about",
    element: <About />,
    seo: {
      title: "About | EchoPolicy",
      description: "Learn more about EchoPolicy and our mission."
    }
  },
  {
    path: "/terms",
    element: <Terms />,
    seo: {
      title: "Terms & Conditions | EchoPolicy",
      description: "Read the terms and conditions of using EchoPolicy."
    }
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
    seo: {
      title: "Privacy Policy | EchoPolicy",
      description: "Understand how we protect your privacy at EchoPolicy."
    }
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    seo: {
      title: "Dashboard | EchoPolicy",
      description: "Manage your polls and account settings here."
    }
  },
  {
    path: "/admin/edit/:id",
    element: <PollEdit />,
    seo: {
      title: "Edit Poll (Admin) | EchoPolicy",
      description: "Admins can edit poll details here."
    }
  },
  {
    path: "/forum",
    element: <Forum />,
    seo: {
      title: "Forum | EchoPolicy",
      description: "Join discussions and connect with the EchoPolicy community."
    }
  },
    {
    path: "/settings",
    element: <Settings />,
    seo: {
      title: "Settings | EchoPolicy",
      description: "Change user settings or delete your EchoPolocy account."
    }
  },
  {
    path: "*",
    element: <NotFound />,
    seo: {
      title: "404 Not Found | EchoPolicy",
      description: "The page you’re looking for doesn’t exist."
    }
  }
];

export default routes;