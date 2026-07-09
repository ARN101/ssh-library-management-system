import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import { adminPaths } from "./Admin.routes.jsx";
import { studentPaths } from "./Student.routes.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import BookCatalog from "../pages/BookCatalog.jsx";
import BookInventory from "../pages/BookInventory.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";
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
    element: <App />,
    errorElement: <NotFound />,
    children: routeGenerator(adminPaths),
  },
  {
    path: "/student",
    element: <App />,
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
    path: "/preview",
    element: <MainLayout />,
    children: [
      {
        path: "book-catalog",
        element: <BookCatalog />,
      },
      {
        path: "book-inventory",
        element: <BookInventory />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
