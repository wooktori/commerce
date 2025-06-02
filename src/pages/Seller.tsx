import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import { getAuthUser, User } from "@/hooks/user";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router"; // ✅ react-router-dom 사용

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

async function getSellerProducts(userId: string): Promise<Product[]> {
  const q = query(collection(db, "products"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    productId: doc.id,
    ...doc.data(),
  })) as Product[];
}

export default function Seller() {
  const navigate = useNavigate();

  // 1. 유저 정보 불러오기
  const { data: user, isLoading: userLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: getAuthUser,
  });

  // 2. 상품 정보 불러오기 (user가 있을 때만)
  const {
    data: items,
    isLoading: itemsLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products", user?.id],
    queryFn: () => getSellerProducts(user!.id),
    enabled: !!user?.id, // ✅ user가 있을 때만 실행
  });

  const handleAdd = () => navigate("/registration");

  if (userLoading || itemsLoading) return <LoadingSpinner />;
  if (isError) return <div>상품을 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="mx-10">
      <h1 className="text-sm font-bold text-center">판매자 페이지</h1>
      <div className="flex justify-end my-4">
        <Button onClick={handleAdd}>상품 등록</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {items?.map((item) => (
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
