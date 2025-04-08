import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { z } from "zod";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

const formSchema = z
  .object({
    nickname: z
      .string()
      .min(2, { message: "닉네임은 두 글자 이상이어야 합니다." }),
    email: z.string().email({ message: "이메일 형식이 아닙니다." }),
    password: z.string().min(6, { message: "비밀번호는 최소 6자리입니다." }),
    checkPassword: z
      .string()
      .min(6, { message: "비밀번호는 최소 6자리입니다." }),
    isSeller: z.boolean(),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["checkPassword"],
  });

export default function Signup() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      checkPassword: "",
      nickname: "",
      isSeller: false,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { email, password, nickname, isSeller } = data;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const id = userCredential.user.uid;

      await setDoc(doc(db, "users", id), {
        id,
        nickname,
        isSeller,
        email,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      alert("회원가입 도중 오류가 발생했습니다.");
      console.error(error);
    },
  });

  const onValid = async (data: z.infer<typeof formSchema>) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center">
      <h3>회원가입</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onValid)} className="space-y-4">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input placeholder="닉네임" type="string" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="이메일" type="email" {...field} />
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
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input placeholder="비밀번호" type="password" {...field} />
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
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input
                    placeholder="비밀번호 확인"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isSeller"
            render={({ field }) => (
              <FormItem>
                <FormLabel>판매자 여부</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel>예</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel>아니오</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">회원가입</Button>
        </form>
      </Form>
    </div>
  );
}
