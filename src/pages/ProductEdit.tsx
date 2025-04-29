import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db, storage } from "@/firebase"; // storage 추가 import
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage"; // Firebase Storage 관련 함수 추가
import { useEffect, useState } from "react"; // useState 추가
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";

interface Product {
  productId: string;
  sellerId: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  imageUrls: string[];
}

export default function ProductEdit() {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;
  const form = useForm<Product>();
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState<string[]>([]); // 기존 이미지 URL 저장
  const [newImages, setNewImages] = useState<File[]>([]); // 새로 업로드할 이미지 파일
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const productRef = doc(db, "products", productId);
        const product = await getDoc(productRef);

        if (product.exists()) {
          const data = product.data() as Product;
          form.reset({
            name: data.name,
            price: data.price,
            quantity: data.quantity,
            description: data.description,
            category: data.category,
            imageUrls: data.imageUrls,
          });
          setExistingImages(data.imageUrls || []); // 기존 이미지 URL 저장
        } else {
          console.log("제품을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [productId, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(files);
    }
  };

  const deleteExistingImage = async (imageUrl: string) => {
    try {
      // Firebase Storage에서 이미지 삭제
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // 기존 이미지 목록에서 제거
      setExistingImages(existingImages.filter((url) => url !== imageUrl));

      // 폼 데이터에서도 제거
      const currentImageUrls = form.getValues("imageUrls") || [];
      form.setValue(
        "imageUrls",
        currentImageUrls.filter((url) => url !== imageUrl)
      );
    } catch (error) {
      console.error("이미지 삭제 중 오류 발생:", error);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    });
    return await Promise.all(uploadPromises);
  };

  const onValid = async (data: Product) => {
    if (!productId) return;

    setIsUploading(true);

    try {
      let imageUrls = [...existingImages];

      // 새 이미지가 있으면 업로드
      if (newImages.length > 0) {
        // 기존 이미지 모두 삭제
        const deletePromises = existingImages.map((url) => {
          const imageRef = ref(storage, url);
          return deleteObject(imageRef).catch((error) =>
            console.error("이미지 삭제 실패:", error)
          );
        });

        await Promise.all(deletePromises);

        // 새 이미지 업로드
        const uploadedUrls = await uploadImages(newImages);
        imageUrls = uploadedUrls;
      }

      // 제품 정보 업데이트
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        description: data.description,
        category: data.category,
        imageUrls: imageUrls,
      });

      navigate("/seller");
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-10">
      <div className="flex items-center justify-center relative mb-10">
        <Link to="/seller" className="absolute left-0">
          &larr;
        </Link>
        <h1 className="text-sm font-bold text-center">상품수정 페이지</h1>
      </div>
      <Form {...form}>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={form.handleSubmit(onValid)}
        >
          <div className="md:col-span-1">
            <FormField
              name="imageUrls"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제품이미지</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* 기존 이미지 미리보기 */}
                      {existingImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {existingImages.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`기존 이미지 ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteExistingImage(url)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 새 이미지 업로드 */}
                      <div className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg relative">
                        <Input
                          placeholder="제품이미지"
                          multiple
                          type="file"
                          accept="image/*"
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                          onChange={handleImageChange}
                        />
                        <span className="text-gray-500">
                          이미지를 드래그하거나 클릭해주세요
                        </span>
                      </div>

                      {/* 새로 선택한 이미지 미리보기 */}
                      {newImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from(newImages).map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`새 이미지 ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                            </div>
                          ))}
                        </div>
                      )}
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
              name="price"
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
            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? "처리 중..." : "수정 완료"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
