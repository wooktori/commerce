import { userState } from "@/atoms/userAtom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/firebase";
import { useMutation } from "@tanstack/react-query";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSetRecoilState } from "recoil";

interface IForm {
  email: string;
  password: string;
}

export default function Login() {
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  const form = useForm<IForm>({ defaultValues: { email: "", password: "" } });
  const loginMutation = useMutation({
    mutationFn: async (data: IForm) => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const id = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", id));
      if (!userDoc.exists()) {
        throw new Error("사용자 정보가 없습니다.");
      }

      const token = await userCredential.user.getIdToken();

      localStorage.setItem("token", token);

      setUser({
        id,
        email: userDoc.data().email,
        nickname: userDoc.data().nickname,
        isSeller: userDoc.data().isSeller,
      });
    },
    onSuccess: () => navigate("/"),
    onError: (error) => {
      alert("로그인에 실패하였습니다.");
      console.error(error);
    },
  });
  const onValid = async (data: IForm) => {
    loginMutation.mutate(data);
  };

  const githubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const data = await signInWithPopup(auth, provider);
      setUser({
        id: data.user.uid,
        email: data.user.email,
        nickname: data.user.displayName!,
        isSeller: false,
      });
      console.log(data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const data = await signInWithPopup(auth, provider);
      setUser({
        id: data.user.uid,
        email: data.user.email,
        nickname: data.user.displayName!,
        isSeller: false,
      });
      console.log(data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h3>로그인</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onValid)} className="space-y-4">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="이메일" type="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="비밀번호" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">로그인</Button>
        </form>
      </Form>
      <div className="hover:cursor-pointer" onClick={googleLogin}>
        구글로 로그인
      </div>
      <div className="hover:cursor-pointer" onClick={githubLogin}>
        깃허브로 로그인
      </div>
      <div className="hover:cursor-pointer">카카오로 로그인</div>
    </div>
  );
}
