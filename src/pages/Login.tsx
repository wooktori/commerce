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
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSetRecoilState } from "recoil";
import { FcGoogle } from "react-icons/fc";
import { RiGithubFill, RiKakaoTalkFill } from "react-icons/ri";
import { githubLogin, googleLogin, kakaoLogin } from "@/lib/socialLogin";

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

  const { mutate: googleMutate } = useMutation({
    mutationFn: () => googleLogin({ setUser, navigate }),
    onError: (error) => {
      alert("구글 로그인에 실패하였습니다.");
      console.error(error);
    },
  });

  const { mutate: githubMutate } = useMutation({
    mutationFn: () => githubLogin({ setUser, navigate }),
    onError: (error) => {
      alert("깃허브 로그인에 실패하였습니다.");
      console.error(error);
    },
  });

  const onValid = async (data: IForm) => {
    loginMutation.mutate(data);
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
      <div>
        <Button
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors duration-300 hover:bg-gray-100"
          onClick={() => googleMutate()}
        >
          <FcGoogle size={20} />
          구글 계정으로 로그인
        </Button>

        <Button
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors duration-300 hover:bg-gray-100"
          onClick={() => githubMutate()}
        >
          <RiGithubFill size={20} />
          깃허브 계정으로 로그인
        </Button>
        <Button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#FEE500] text-sm font-medium text-gray-700 transition-colors duration-300 hover:border hover:border-yellow-300 hover:bg-[#FFEB3B]"
          onClick={kakaoLogin}
        >
          <RiKakaoTalkFill size={20} />
          카카오 계정으로 로그인
        </Button>
      </div>
    </div>
  );
}
