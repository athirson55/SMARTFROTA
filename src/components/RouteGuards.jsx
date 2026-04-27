import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/sessionAuth";

export function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function GuestOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
