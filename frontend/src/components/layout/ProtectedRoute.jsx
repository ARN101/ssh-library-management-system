import { useAppSelector } from "../../redux/hooks.js";
import {
  useCurrentToken,
  selectCurrentUser,
} from "../../redux/features/auth/authSlice.js";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = useAppSelector(useCurrentToken);
  const user = useAppSelector(selectCurrentUser);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && user?.role && !allowedRoles.includes(user.role)) {
    const fallback =
      user.role === "librarian"
        ? "/admin/book-inventory"
        : "/student/book-catalog";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
