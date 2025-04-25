import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

export default function Registration() {
  const form = useForm();
  const onValid = () => {};
  return (
    <div className="mx-10">
      <div className="flex items-center justify-center relative mb-10">
        <Link to="/seller" className="absolute left-0">
          &larr;
        </Link>
        <h1 className="text-sm font-bold text-center">상품등록 페이지</h1>
      </div>
      <Form {...form}>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={form.handleSubmit(onValid)}
        >
          <div className="md:col-span-1">
            <FormField
              name="제품이미지"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제품이미지</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full h-80 border-2 border-dashed rounded-lg relative">
                      <Input
                        placeholder="제품이미지"
                        type="file"
                        className="absolute opacity-0 w-full h-full cursor-pointer"
                        {...field}
                      />
                      <span className="text-gray-500">
                        이미지를 드래그하거나 클릭해주세요
                      </span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-1 space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제품명</FormLabel>
                  <FormControl>
                    <Input placeholder="제품명" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="제품가격"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제품가격</FormLabel>
                  <FormControl>
                    <Input placeholder="제품가격" type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="제품수량"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제품수량</FormLabel>
                  <FormControl>
                    <Input placeholder="제품수량" type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="제품설명"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제품설명</FormLabel>
                  <FormControl>
                    <Input placeholder="제품설명" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="카테고리"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <FormControl>
                    <Input placeholder="카테고리" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" className="w-full">
              등록
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
