import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface ProtectedSellerRouteProps {
  children?: ReactNode;
}

export function ProtectedSellerRoute({ children }: ProtectedSellerRouteProps) {
  const { userData, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // 또는 로딩 스피너
  }

  // userData가 없거나 isSeller가 false면 메인 페이지로 리다이렉트
  if (!userData?.isSeller) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}
