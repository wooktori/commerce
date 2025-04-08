import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

interface IForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const form = useForm<IForm>({ defaultValues: { email: "", password: "" } });
  const onValid = async (data: IForm) => {
    const info = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    console.log(info);
    navigate("/");
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
    </div>
  );
}
