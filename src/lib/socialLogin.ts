import { auth, db } from "@/firebase";
import { QueryClient } from "@tanstack/react-query";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

interface IParams {
  navigate: (path: string) => void;
  queryClient: QueryClient;
}

export const googleLogin = async ({ navigate, queryClient }: IParams) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const { uid, displayName, email } = userCredential.user;

    // 사용자 문서 참조
    const userDocRef = doc(db, "users", uid);

    // 문서 존재 여부 확인
    const docSnapshot = await getDoc(userDocRef);

    if (!docSnapshot.exists()) {
      // 새 사용자인 경우에만 문서 생성
      await setDoc(userDocRef, {
        id: uid,
        nickname: displayName,
        email,
        isSeller: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // 기존 사용자의 경우 업데이트 시간만 갱신
      await updateDoc(userDocRef, {
        updatedAt: serverTimestamp(),
      });
    }
    queryClient.invalidateQueries({ queryKey: ["user"] });

    navigate("/");
  } catch (error) {
    console.error(error);
  }
};
export const githubLogin = async ({ navigate, queryClient }: IParams) => {
  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const { uid, displayName, email } = userCredential.user;

    // 사용자 문서 참조
    const userDocRef = doc(db, "users", uid);

    // 문서 존재 여부 확인
    const docSnapshot = await getDoc(userDocRef);

    if (!docSnapshot.exists()) {
      // 새 사용자인 경우에만 문서 생성
      await setDoc(userDocRef, {
        id: uid,
        nickname: displayName,
        email,
        isSeller: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // 기존 사용자의 경우 업데이트 시간만 갱신
      await updateDoc(userDocRef, {
        updatedAt: serverTimestamp(),
      });
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });
    navigate("/");
  } catch (error) {
    console.error(error);
  }
};

export const kakaoLogin = async () => {};
