// /api/user.ts
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export interface User {
  email: string;
  id: string;
  isSeller: boolean;
  nickname: string;
}

export async function getAuthUser(): Promise<User | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) throw new Error("사용자 정보를 찾을 수 없습니다.");

  return userDoc.data() as User;
}
