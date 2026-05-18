import { Navigate, Outlet, useParams } from "react-router";
import { useAuth } from "./AuthContext";

export default function RoleGuard({ access }) {
  const { user, loading } = useAuth();
  const params = useParams();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  // During your access tests, remember that the data is in user.user_metadata
  if (!access(user, params)) {
    return <Navigate to="/home" replace />; // Redirection to /home instead of /login for a right refusal
  }

  return <Outlet />;
}
