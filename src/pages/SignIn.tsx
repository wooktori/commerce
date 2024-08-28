import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { v4 as uuidv4 } from "uuid";
import { signInSchema } from "@/schema";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();
  type signType = z.infer<typeof signInSchema>;
  const form = useForm<signType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      userId: "",
      email: "",
      nickname: "",
      password: "",
      checkPassword: "",
      isSeller: false,
    },
  });

  const onSubmit = async (userInfo: signType) => {
    const { email, nickname, password, isSeller } = userInfo;
    try {
      const id = uuidv4();
      console.log(id);
      console.log(userInfo);
      // authentication에 저장
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // firestore database에 유저 정보 저장
      await setDoc(doc(db, "users", userCredential.user.uid), {
        userId: id,
        email: email,
        nickname: nickname,
        isSeller: isSeller,
      });
      navigate("/login");
    } catch (error) {
      const errorCode = (error as FirebaseError).code;
      if (errorCode === "auth/email-already-in-use") {
        form.setError("email", {
          type: "manual",
          message: "이메일이 중복되었습니다.",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">이메일</FormLabel>
              <FormControl>
                <input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">닉네임</FormLabel>
              <FormControl>
                <input placeholder="nickname" {...field} />
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
        <FormField
          control={form.control}
          name="checkPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">비밀번호 확인</FormLabel>
              <FormControl>
                <input type="password" placeholder="checkPassword" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isSeller"
          render={({ field }) => (
            <FormItem className="border-2 border-black border-solid mt-3">
              <FormLabel>판매자 여부</FormLabel>
              <FormControl>
                <div>
                  <label>
                    <input
                      type="radio"
                      {...field}
                      value="true"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                    />
                    예
                  </label>
                  <label className="ml-5">
                    <input
                      type="radio"
                      {...field}
                      value="false"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                    />
                    아니오
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          회원가입
        </Button>
      </form>
    </Form>
  );
}
