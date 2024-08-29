import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { productSchema } from "@/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

export default function ProductEditPage() {
  type ProductData = z.infer<typeof productSchema>;
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const imgRef = useRef<HTMLInputElement>(null); // For file input reference
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imgPaths, setImgPaths] = useState<string[]>([]);
  const navigate = useNavigate();
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
      try {
        if (productId) {
          const productRef = doc(db, "products", productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            const productData = productSnap.data() as ProductData;
            setProduct(productData);
            // Set form values
            form.reset(productData);
            // Set image paths if available
            if (productData.productImageUrls) {
              setImgPaths(productData.productImageUrls);
            }
          } else {
            console.error("Product not found");
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId, form]);

  const handleUpload = async (data: ProductData) => {
    try {
      const productRef = doc(db, "products", productId!);
      await updateDoc(productRef, {
        ...data,
        productImageUrls: imgPaths,
        productImagePaths: selectedFiles.map((file) =>
          URL.createObjectURL(file)
        ),
      });
      alert("성공적으로 수정되었습니다!");
      navigate("/mypage");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
      setImgPaths(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleImageDelete = (index: number) => {
    setImgPaths((prevPaths) => prevPaths.filter((_, i) => i !== index));
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold">제품 수정</h2>
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
          {imgPaths.length > 0 ? (
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
  );
}
