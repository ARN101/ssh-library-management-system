import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import { adminPaths } from "./Admin.routes.jsx";
import { studentPaths } from "./Student.routes.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";
import ProtectedRoute from "../components/layout/ProtectedRoute.jsx";
import { routeGenerator } from "../utils/routesGenerator.js";
import NotFound from "../pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["librarian"]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: routeGenerator(adminPaths),
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: routeGenerator(studentPaths),
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
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
