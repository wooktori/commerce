import { useAuth } from "@/context/AuthContext";
import React from "react";

export default function Home() {
  const { user, isSeller } = useAuth();
  console.log(user, isSeller);
  return <div>Home</div>;
}
