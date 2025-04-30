import { useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userAtom";

export function useAuth() {
  const queryClient = useQueryClient();
  const setUser = useSetRecoilState(userState);

  // 1. Firebase 인증 상태 조회
  const {
    data: authUser,
    isLoading: authLoading,
    error: authError,
  } = useQuery<User | null>({
    queryKey: ["authUser"],
    initialData: null,
    async queryFn() {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      });
    },
  });

  // 2. Firestore 사용자 데이터 조회
  const {
    data: userData,
    isLoading: dataLoading,
    error: dataError,
  } = useQuery({
    queryKey: ["userData", authUser?.uid],
    enabled: !!authUser?.uid, // 사용자가 있을 때만 실행
    async queryFn() {
      if (!authUser?.uid) return null;

      //console.log("Firestore 조회 시도:", authUser.uid); // 디버깅 로그

      const userDoc = await getDoc(doc(db, "users", authUser.uid));
      const data = userDoc.data();

      //console.log("Firestore 조회 결과:", data); // 디버깅 로그

      if (!userDoc.exists()) {
        throw new Error("User document not found");
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });

  // 3. 실시간 업데이트 설정
  useEffect(() => {
    if (!authUser?.uid) return;

    const unsubscribe = onSnapshot(doc(db, "users", authUser.uid), (doc) => {
      //console.log("실시간 업데이트:", doc.data()); // 디버깅 로그
      queryClient.setQueryData(["userData", authUser.uid], doc.data());
    });

    return () => unsubscribe();
  }, [authUser?.uid, queryClient]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem("token", token);

          // Firestore에서 사용자 문서 조회 또는 생성
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            // 소셜 로그인 사용자에 대한 기본 문서 생성
            await setDoc(userRef, {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              nickname:
                firebaseUser.displayName ||
                `user_${firebaseUser.uid.slice(0, 8)}`,
              isSeller: false,
              createdAt: new Date(),
              provider: firebaseUser.providerData[0]?.providerId || "unknown",
            });
          }

          // 최종 사용자 상태 업데이트
          const finalUserDoc = await getDoc(userRef);
          setUser({
            id: firebaseUser.uid,
            email: finalUserDoc.data()?.email || firebaseUser.email || "",
            nickname:
              finalUserDoc.data()?.nickname ||
              firebaseUser.displayName ||
              "익명",
            isSeller: finalUserDoc.data()?.isSeller || false,
          });
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("인증 상태 오류:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return {
    user: authUser,
    userData,
    isLoading: authLoading || dataLoading,
    error: authError || dataError,
    nickname: userData?.nickname || null,
    // 다른 필요한 필드들...
  };
}
