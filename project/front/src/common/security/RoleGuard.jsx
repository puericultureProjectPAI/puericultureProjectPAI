import { Navigate, Outlet, useParams } from "react-router";
import { useAuth } from "./AuthContext";

export default function RoleGuard({ access }) {
  const { user } = useAuth();
  const params = useParams();

  if (!user) return <Navigate to="/login" replace />;

  if (!access(user, params)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
