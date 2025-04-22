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
    <div className="flex justify-between mx-10 my-5">
      <div className="flex gap-4">
        {user ? (
          <>
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
      </div>
      <div className="flex gap-4">
        <span>장바구니</span>
        <span>검색</span>
      </div>
    </div>
  );
}
