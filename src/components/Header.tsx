import { auth } from "@/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { Link } from "react-router";

export default function Header() {
  const queryClient = useQueryClient();

  // 1. 인증된 사용자 정보 가져오기
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    enabled: false, // 수동으로 관리 (Firebase 리스너가 이미 있음)
    initialData: null,
  });

  // 2. Firestore 사용자 데이터 (isSeller 포함)
  const { data: userData } = useQuery({
    queryKey: ["userData", authUser?.uid],
    enabled: !!authUser?.uid,
  });

  const logoutClick = async () => {
    await signOut(auth);
    queryClient.removeQueries({ queryKey: ["authUser"] });
    queryClient.removeQueries({ queryKey: ["userData"] });
  };

  return (
    <div className="flex justify-between mx-10 mt-5 mb-12">
      <div className="flex gap-4">
        {authUser ? (
          <>
            <div>{userData?.nickname}님 환영합니다!</div>
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
        {userData?.isSeller ? <Link to="/seller">판매자페이지</Link> : null}
      </div>
      <div className="flex gap-4">
        <span>장바구니</span>
        <span>검색</span>
      </div>
    </div>
  );
}
