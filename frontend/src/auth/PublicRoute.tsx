import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";

export default function PublicRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  return <>{children}</>;
}
