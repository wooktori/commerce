import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { auth, db, storage } from "@/firebase";
import { productSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function CreateProduct() {
  type ProductData = z.infer<typeof productSchema>;
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imgPaths, setImgPaths] = useState<string[]>([]);
  const imgRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sellerId: "",
      productId: "",
      productName: "",
      productPrice: 0,
      productQuantity: 0,
      productDescription: "",
      productCategory: "",
      productImageUrls: [],
      productImagePaths: [],
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          form.reset(productData as ProductData);
          setImgPaths(productData.productImageUrls || []);
        }
      }
    };

    fetchProduct();
  }, [productId]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);

      const fileUrls = files.map((file) => URL.createObjectURL(file));
      setImgPaths(fileUrls);
    } else {
      console.error("No file selected");
    }
  };

  const handleImageDelete = (index: number) => {
    const newFiles = [...selectedFiles];
    const newImgPaths = [...imgPaths];

    newFiles.splice(index, 1);
    newImgPaths.splice(index, 1);

    setSelectedFiles(newFiles);
    setImgPaths(newImgPaths);
  };

  const handleUpload = async (data: ProductData) => {
    const {
      productName,
      productPrice,
      productQuantity,
      productDescription,
      productCategory,
    } = data;
    const newProductId = productId || uuidv4();
    console.log(newProductId);

    try {
      setIsLoading(true);
      const urls: string[] = [];
      const paths: string[] = [];

      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const id = Date.now();
          const imageRef = ref(
            storage,
            `${auth.currentUser?.uid}/${newProductId}-${id}`
          );
          const image = await uploadBytes(imageRef, file);
          const imageUrl = await getDownloadURL(image.ref);
          urls.push(imageUrl);
          paths.push(imageRef.fullPath);
        }
      }
      // 상품 정보 저장
      await setDoc(doc(db, "products", newProductId), {
        sellerId: user?.userId,
        productId: newProductId,
        productName,
        productPrice,
        productQuantity,
        productDescription,
        productCategory,
        productImageUrls: urls,
        productImagePaths: paths,
      });
      navigate("/mypage");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>업로드 중...</div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold">제품 등록</h2>
          <hr className="my-3" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpload)}>
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-3">이름</FormLabel>
                    <FormControl>
                      <input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-3">가격</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        placeholder="0"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-3">수량</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        placeholder="0"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-3">카테고리</FormLabel>
                    <FormControl>
                      <select {...field}>
                        <option value="">카테고리를 선택하세요</option>
                        <option value="식품">식품</option>
                        <option value="가전제품">가전제품</option>
                        <option value="의류">의류</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel className="mr-3">제품설명</FormLabel>
                    <FormControl>
                      <input placeholder="description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <label
                htmlFor="image"
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                이미지 추가
              </label>
              <input
                type="file"
                id="image"
                multiple
                onChange={handleFileSelect}
                ref={imgRef}
                className="hidden"
              />
              {selectedFiles.length > 0 ? (
                <div className="flex">
                  {imgPaths.map((img, index) => (
                    <div key={index} className="relative inline-block">
                      <img
                        src={img}
                        alt={`preview-${index}`}
                        className="w-52 h-52"
                      />
                      <Button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full"
                        onClick={() => handleImageDelete(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-red-500 my-3">이미지를 추가 해주세요</div>
              )}
              <Button type="submit">업로드</Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
