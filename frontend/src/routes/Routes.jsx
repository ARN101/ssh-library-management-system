import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import { adminPaths } from "./Admin.routes.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import { routeGenerator } from "../utils/routesGenerator.js";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <App />,
    children: routeGenerator(adminPaths),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  }
]);

export default router;
