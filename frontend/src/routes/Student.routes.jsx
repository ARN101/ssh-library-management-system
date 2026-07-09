import BookCatalog from "../pages/BookCatalog.jsx";
import MyReservations from "../pages/MyReservations.jsx";
import ReadingRoom from "../pages/ReadingRoom.jsx";

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
  {
    name: "Reading Room",
    path: "reading-room",
    element: <ReadingRoom />,
  },
];
