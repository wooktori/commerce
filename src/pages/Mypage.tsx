import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/firebase";
import { productSchema } from "@/schema";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export default function Mypage() {
  type ProductData = z.infer<typeof productSchema>;
  const [products, setProducts] = useState<ProductData[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const q = query(
    collection(db, "products"),
    where("sellerId", "==", user?.userId)
  );

  const editClick = (product: ProductData) => {
    navigate(`/product/${product.productId}/edit`);
  };

  const deleteClick = async (product: ProductData) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        const productRef = doc(db, "products", product.productId);

        if (product.productImagePaths && product.productImagePaths.length > 0) {
          for (const path of product.productImagePaths) {
            const imgRef = ref(storage, path);
            await deleteObject(imgRef);
          }
        }
        await deleteDoc(productRef);
        setProducts(products.filter((p) => p.productId !== product.productId));
      } catch (error) {
        console.log(error);
        alert("제품 삭제 중 오류가 발생했습니다.");
      }
      console.log(product);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await getDocs(q);
        const productList: ProductData[] = [];
        products.forEach((product) => {
          console.log(product.data());
          const productData = product.data() as ProductData;
          productList.push({ ...productData });
        });
        setProducts(productList);
      } catch (error) {
        console.error("Error!", error);
      }
    };
    getProducts();
  }, []);

  return (
    <div>
      <div className="flex justify-between  mx-auto container">
        <Button onClick={() => navigate("/")}>&larr;</Button>
        <Button onClick={() => navigate("/product-registration")}>
          상품등록
        </Button>
      </div>
      <hr className="my-3" />
      <div className="flex">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.productId}>
              {product.productImageUrls && (
                <img
                  src={product.productImageUrls[0]}
                  alt={product.productName}
                  className="w-30 h-52 hover:cursor-pointer"
                  onClick={() => navigate(`/product/${product.productId}`)}
                />
              )}
              <h3>{product.productName}</h3>
              <Button
                onClick={() => editClick(product)}
                className="bg-green-400 hover:bg-green-700"
              >
                수정
              </Button>
              <Button
                onClick={() => deleteClick(product)}
                className="bg-red-400 hover:bg-red-700"
              >
                삭제
              </Button>
            </div>
          ))
        ) : (
          <p>등록된 제품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
