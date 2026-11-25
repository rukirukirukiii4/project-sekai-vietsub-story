import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminRoute({ children }) {
  const { isAdmin, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="py-16 text-center text-sm font-bold text-muted">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}