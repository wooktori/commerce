import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface IForm {
  email: string;
  password: string;
}

export default function Signup() {
  const form = useForm<IForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onValid = (data: IForm) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center">
      <h3>회원가입</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onValid)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" type="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
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
