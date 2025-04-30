import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

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

export default function Seller() {
  const navigate = useNavigate();
  const user = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.userData?.id) return;

      try {
        const q = query(
          collection(db, "products"),
          where("userId", "==", user.userData.id)
        );
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        })) as Product[];

        setItems(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user?.userData?.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleAdd = () => {
    navigate("/registration");
  };
  console.log(items);
  return (
    <div className="mx-10">
      <h1 className="text-sm font-bold text-center">판매자 페이지</h1>
      <div className="flex justify-end my-4">
        <Button onClick={handleAdd}>상품 등록</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            to={`/seller/${item.productId}`}
            state={{ item }}
            className="flex flex-col"
            key={item.productId}
          >
            <div
              className="w-full h-60 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.imageUrls[0]})` }}
            ></div>
            <div className="text-center">{item.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
