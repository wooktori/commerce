import { User } from "@/atoms/userAtom";
import { auth } from "@/firebase";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

interface IParams {
  setUser: (user: User) => void;
  navigate: (path: string) => void;
}

export const googleLogin = async ({ setUser, navigate }: IParams) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken();

    localStorage.setItem("token", token);

    setUser({
      id: userCredential.user.uid,
      email: userCredential.user.email,
      nickname: userCredential.user.displayName!,
      isSeller: false,
    });

    navigate("/");
  } catch (error) {
    console.error(error);
  }
};
export const githubLogin = async ({ setUser, navigate }: IParams) => {
  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken();

    localStorage.setItem("token", token);

    setUser({
      id: userCredential.user.uid,
      email: userCredential.user.email,
      nickname: userCredential.user.displayName!,
      isSeller: false,
    });

    navigate("/");
  } catch (error) {
    console.error(error);
  }
};

export const kakaoLogin = async () => {};
