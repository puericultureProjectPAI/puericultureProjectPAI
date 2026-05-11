import { Outlet } from "react-router";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    {
      /* ignore for now */
    }
    {
      /* return <Navigate to="/login" replace />;*/
    }
  }

  return <Outlet />;
}
