import { useAppSelector } from "../../redux/hooks.js";
import { useCurrentToken } from "../../redux/features/auth/authSlice.js";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = useAppSelector(useCurrentToken);

    if (!token) {
        return <Navigate to="/login" replace={true} />;
    }

    return children;
}

export default ProtectedRoute;
