import { Link, useLocation } from "react-router";

export default function ProductDetail() {
  interface Product {
    productId: string;
    sellerId: string;
    productName: string;
    productPrice: number;
    productQuantity: number;
    productDescription: string;
    productCategory: string;
    productImage: string[];
  }

  const location = useLocation();
  const { item } = location.state as { item: Product };
  console.log(item);
  return (
    <div className="mx-10">
      <div className="flex items-center justify-center relative mb-10">
        <Link to="/seller" className="absolute left-0">
          &larr;
        </Link>
        <h1 className="text-sm font-bold text-center">상품등록 페이지</h1>
      </div>
      <div className="flex gap-10">
        <img src={item.productImage[0]} />
        <div className="space-y-4">
          <h2>제품명 : {item.productName}</h2>
          <p>가격: {item.productPrice.toLocaleString()}원</p>
          <p>재고: {item.productQuantity}개</p>
          <p>카테고리: {item.productCategory}</p>
          <p>설명 : {item.productDescription}</p>
        </div>
      </div>
    </div>
  );
}
