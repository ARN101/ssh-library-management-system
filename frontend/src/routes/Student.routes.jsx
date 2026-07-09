import BookCatalog from "../pages/BookCatalog.jsx";
import MyReservations from "../pages/MyReservations.jsx";

export const studentPaths = [
  {
    name: "Book Catalog",
    path: "book-catalog",
    element: <BookCatalog />,
  },
  {
    name: "My Reservations",
    path: "my-reservations",
    element: <MyReservations />,
  },
];
