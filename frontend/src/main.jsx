import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthProvider from "./contexts/AuthProvider.jsx";
import Welcome from "./pages/Welcome.jsx";
import "./index.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./layouts/Home.jsx";
import App from "./App.jsx";
import ProtectedRoute from "./wrappers/ProtectedRoute.jsx";
import ChatList from "./components/ChatList.jsx";
import People from "./components/People.jsx";
import Logout from "./components/Logout.jsx";
import { WebsocketProvider } from "./contexts/WebsocketProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <WebsocketProvider>
          <Home />
        </WebsocketProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home/chats" />,
      },
      {
        path: "chats",
        element: <ChatList />,
      },
      {
        path: "people",
        element: <People />,
      },
    ],
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
