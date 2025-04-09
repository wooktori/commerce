import { auth } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const { userData } = useAuth();
  const queryClient = useQueryClient();
  console.log(userData);

  const handleClick = async () => {
    try {
      await auth.signOut();
      queryClient.setQueryData(["authUser"], null);
      queryClient.removeQueries({ queryKey: ["userData"] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between mx-10 my-5">
      <div className="flex gap-4">
        {userData ? (
          <>
            <span>{userData.nickname}</span>
            <button onClick={handleClick}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>
        )}

        <span>주문조회</span>
        <span>장바구니</span>
        <span>마이페이지</span>
      </div>
      <div className="flex gap-4">
        <span>장바구니</span>
        <span>검색</span>
      </div>
    </div>
  );
}
