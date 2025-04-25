import { userState } from "@/atoms/userAtom";
import { auth } from "@/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { Link } from "react-router";
import { useRecoilState } from "recoil";

export default function Header() {
  const [user, setUser] = useRecoilState(userState);
  const queryClient = useQueryClient();
  const logoutClick = () => {
    signOut(auth);
    setUser(null);
    queryClient.clear();
    localStorage.removeItem("token");
  };
  return (
    <div className="flex justify-between mx-10 mt-5 mb-12">
      <div className="flex gap-4">
        {user ? (
          <>
            <div>{user.nickname}님 환영합니다!</div>
            <div onClick={logoutClick} className="hover:cursor-pointer">
              로그아웃
            </div>
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
        {user && user.isSeller ? <Link to="/seller">판매자페이지</Link> : null}
      </div>
      <div className="flex gap-4">
        <span>장바구니</span>
        <span>검색</span>
      </div>
    </div>
  );
}
