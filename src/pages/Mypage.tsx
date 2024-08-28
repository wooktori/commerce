import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { productSchema } from "@/schema";
import { collection, getDocs, query, where } from "firebase/firestore";
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
      <div className="flex justify-end  mx-auto container">
        <Button onClick={() => navigate("/product-registration")}>
          상품등록
        </Button>
      </div>
      <hr className="my-3" />
      <div className="flex">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.productId}>
              {product.productImage && (
                <img
                  src={product.productImage[0]}
                  alt={product.productName}
                  className="w-30 h-52"
                />
              )}
              <h3>{product.productName}</h3>
              <Button className="bg-green-400 hover:bg-green-700">수정</Button>
              <Button className="bg-red-400 hover:bg-red-700">삭제</Button>
            </div>
          ))
        ) : (
          <p>등록된 제품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
