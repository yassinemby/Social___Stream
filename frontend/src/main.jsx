import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import FriendReq from "./pages/FriendReq";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import Friends from "./components/Friends";
import Search from "./pages/Search";
import Displayppl from "./pages/Displayppl";
import Viewimg from "./pages/Viewimg";
import ViewPosts from "./pages/ViewPost";
import ViewPost from "./pages/ViewPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/create",
    element: <CreatePost />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/friendreq",
    element: <FriendReq />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/chatting/:id",
    element: <Chat />,
  },
  {
    path: "/friends",
    element: <Friends />,
  },
  {
    path: "/Search",
    element: <Search />,
  },
  {
    path: "/DisplayProfile/:id",
    element:<Displayppl/>,
  }
,
  {
    path: "/viewapost/:idpost",
    element: <ViewPost/>,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="app">
      {" "}
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);
