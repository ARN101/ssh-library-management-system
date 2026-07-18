import { Navigate } from "react-router-dom";
import { useAppSelector } from "./redux/hooks.js";
import {
  selectCurrentUser,
  useCurrentToken,
} from "./redux/features/auth/authSlice.js";

/** Root `/` — send users to their role home (or login). */
function App() {
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(useCurrentToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "librarian") {
    return <Navigate to="/admin/book-inventory" replace />;
  }

  return <Navigate to="/student/book-catalog" replace />;
}

export default App;
