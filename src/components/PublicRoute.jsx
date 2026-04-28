import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;