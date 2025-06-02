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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { LoadingSpinner } from "@/components/Loading";
import { getAuthUser } from "@/hooks/user";

const formSchema = z.object({
  name: z.string().min(1, "이름은 필수입니다."),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  description: z.string(),
  category: z.string(),
  images: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "최소 1개 이상의 이미지가 필요합니다")
    .refine((files) => files?.length <= 5, "최대 5개까지 업로드 가능합니다"),
});

export default function Registration() {
  const user = getAuthUser();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      description: "",
      category: "",
      images: undefined,
    },
  });
  const registrationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { name, price, quantity, description, category, images } = data;
      const userId = user.id;
      const productId = uuidv4();

      // 1. 이미지 업로드
      const imageUrls = await Promise.all(
        Array.from(images).map(async (file, index) => {
          const storageRef = ref(
            storage,
            `products/${productId}/${index}_${file.name}`
          );
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );

      // 2. Firestore에 데이터 저장
      await setDoc(doc(db, "products", productId), {
        userId,
        name,
        price,
        quantity,
        description,
        category,
        imageUrls,
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
      {registrationMutation.isPending && <LoadingSpinner />}
      {registrationMutation.isPending && (
        <div className="fixed inset-0 bg-black/10 z-40 pointer-events-none"></div>
      )}

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
              name="images"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제품이미지</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full h-80 border-2 border-dashed rounded-lg relative">
                      <Input
                        placeholder="제품이미지"
                        multiple
                        type="file"
                        className="absolute opacity-0 w-full h-full cursor-pointer"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                      />
                      {field.value?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 w-full">
                          {Array.from(field.value).map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 border rounded"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`미리보기 ${index + 1}`}
                                className="h-16 w-16 object-cover rounded"
                              />
                              <span className="text-sm truncate">
                                {file.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-gray-500">
                            이미지를 드래그하거나 클릭해주세요 (최대 5개)
                          </span>
                        </div>
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
