import { Navigate } from "react-router-dom";
import { isAunthenticated } from "../services/authService";

function ProtectedRoute({ children }) {
    if (!isAunthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;