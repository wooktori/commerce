import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db, storage } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const formSchema = z.object({
  name: z.string().min(1, "이름은 필수입니다."),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  description: z.string(),
  category: z.string(),
  image: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "이미지는 필수입니다"),
});

export default function Registration() {
  const user = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      description: "",
      category: "",
      image: undefined,
    },
  });
  const registrationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { name, price, quantity, description, category, image } = data;
      const userId = user.userData!.id;
      const productId = uuidv4();

      // 1. 이미지 업로드
      const file = image[0];
      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. Firestore에 데이터 저장 (이미지 URL 포함)
      await setDoc(doc(db, "products", productId), {
        userId,
        name,
        price,
        quantity,
        description,
        category,
        imageUrl, // 이미지 URL 저장
        createdAt: new Date().toISOString(),
      });

      return productId;
    },
    onSuccess: () => {
      navigate("/seller");
    },
    onError: (error) => {
      alert("상품등록 도중 오류가 발생했습니다");
      console.error(error);
    },
  });
  const onValid = (data: z.infer<typeof formSchema>) => {
    registrationMutation.mutate(data);
  };
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
              name="image"
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
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                      />
                      {field.value?.length > 0 ? (
                        <span className="text-sm text-green-600">
                          선택된 파일: {field.value[0].name}
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          이미지를 드래그하거나 클릭해주세요
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제품가격(원)</FormLabel>
                  <FormControl>
                    <Input placeholder="제품가격" type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="quantity"
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
              name="description"
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
              name="category"
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
