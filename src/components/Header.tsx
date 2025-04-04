export default function Header() {
  return (
    <div className="flex justify-between mx-10 my-5">
      <div className="flex gap-4">
        <span>로그인</span>
        <span>회원가입</span>
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
