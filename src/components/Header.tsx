import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { getAuthUser } from "../hooks/user";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getAuthUser,
  });
  const handleLogout = async () => {
    await signOut(auth);
    queryClient.removeQueries({ queryKey: ["user"] });
    navigate("/");
  };
  console.log(user);
  return (
    <div className="flex justify-between mx-10 mt-5 mb-12">
      <div className="flex gap-4">
        {user ? (
          <>
            <span>{user.nickname}님</span>
            <Link to="/mypage">마이페이지</Link>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>
        )}
        <span>주문조회</span>
        <span>장바구니</span>
        <Link to="/seller">판매자페이지</Link>
      </div>
      <div className="flex gap-4">
        <span>장바구니</span>
        <span>검색</span>
      </div>
    </div>
  );
}
