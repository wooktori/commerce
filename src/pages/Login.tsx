import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { auth, db } from "@/firebase";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export default function Login() {
  const navigate = useNavigate();
  type LoginData = z.infer<typeof loginSchema>;

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const { email, password } = data;
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const info = await getDoc(doc(db, "users", user.uid));
      console.log(info.data());
      navigate("/");
    } catch (error) {
      const errorCode = (error as FirebaseError).code;
      console.log(errorCode);
      if (errorCode === "auth/invalid-credential") {
        form.setError("password", {
          type: "manual",
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }
    }
  };

  const handleClick = () => {
    navigate("/signIn");
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-3">이메일</FormLabel>
                <FormControl>
                  <input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-2">비밀번호</FormLabel>
                <FormControl>
                  <input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="my-2">
            로그인
          </Button>
        </form>
      </Form>
      <Button onClick={handleClick}>회원가입</Button>
    </>
  );
}
