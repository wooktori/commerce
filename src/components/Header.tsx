import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();
  console.log(user, isSeller);
  const logoutClick = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {user ? (
        <div>
          <Button>마이페이지</Button>
          <Button onClick={logoutClick}>로그아웃</Button>
        </div>
      ) : (
        <div>
          <Button onClick={() => navigate("/login")}>로그인</Button>
          <Button onClick={() => navigate("/signin")}>회원가입</Button>
        </div>
      )}
    </div>
  );
}
