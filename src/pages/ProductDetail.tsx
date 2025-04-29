import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { Link, useLocation, useNavigate } from "react-router";

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

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state as { item: Product };
  console.log(item);
  const handleDelete = async () => {
    if (!window.confirm(`정말 "${item.name}" 상품을 삭제하시겠습니까?`)) {
      return;
    }
    try {
      // Firestore에서 해당 상품 문서 삭제
      await deleteDoc(doc(db, "products", item.productId));

      // 삭제 후 판매자 페이지로 이동
      navigate("/seller");
    } catch (error) {
      console.error("상품 삭제 중 오류 발생:", error);
    }
  };
  return (
    <div className="mx-10">
      <div className="flex items-center justify-center relative mb-10">
        <Link to="/seller" className="absolute left-0">
          &larr;
        </Link>
        <h1 className="text-sm font-bold text-center">상품상세 페이지</h1>
      </div>
      <div className="flex gap-20 max-w-4xl mx-auto items-start">
        <img className="w-50" src={item.imageUrls[0]} />
        <div className="space-y-4 ml-20">
          <h2>{item.name}</h2>
          <hr />
          <p>가격 {item.price.toLocaleString()} 원</p>
          <p>재고 {item.quantity} 개</p>
          <p>카테고리 {item.category}</p>
          <p>설명 {item.description}</p>
          <Button>수정</Button>
          <Button className="ml-10" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
