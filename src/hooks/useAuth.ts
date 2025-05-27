import { useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useEffect } from "react";

export function useAuth() {
  const queryClient = useQueryClient();

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

      const userDoc = await getDoc(doc(db, "users", authUser.uid));
      const data = userDoc.data();

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
      queryClient.setQueryData(["userData", authUser.uid], doc.data());
    });

    return () => unsubscribe();
  }, [authUser?.uid, queryClient]);

  // 4. 새 사용자 문서 생성 로직
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
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
      } catch (error) {
        console.error("사용자 문서 생성 오류:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user: authUser,
    userData,
    isLoading: authLoading || dataLoading,
    error: authError || dataError,
    // 필요한 추가 필드
    nickname: userData?.nickname || null,
    isSeller: userData?.isSeller || false,
    email: userData?.email || authUser?.email || null,
  };
}
