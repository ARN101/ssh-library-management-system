import BookInventory from "../pages/BookInventory.jsx";
import ReservationPanel from "../pages/ReservationPanel.jsx";
import SeatingMonitor from "../pages/SeatingMonitor.jsx";

export const adminPaths = [
  {
    name: "Book Inventory",
    path: "book-inventory",
    element: <BookInventory />,
  },
  {
    name: "Reservations",
    path: "reservations",
    element: <ReservationPanel />,
  },
  {
    name: "Seating Monitor",
    path: "seating-monitor",
    element: <SeatingMonitor />,
  },
];
