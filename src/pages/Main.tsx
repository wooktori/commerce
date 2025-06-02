import { db } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

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

export default function Main() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        })) as Product[];

        setItems(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.productId}>
            <div
              className="w-full h-60 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.imageUrls[0]})` }}
            ></div>
            <div className="text-center">{item.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
