import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";

export default function Seller() {
  // interface Product {
  //   productId: string;
  //   sellerId: string;
  //   productName: string;
  //   productPrice: number;
  //   productQuantity: number;
  //   productDescription: string;
  //   productCategory: string;
  //   productImage: string[];
  // }

  const items = [
    {
      productId: 1,
      sellerId: "string",
      productName: "item1",
      productPrice: 123,
      productQuantity: 2,
      productDescription: "상품",
      productCategory: "하의",
      productImage: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlFJTg0JUVDJTlEJTk4JUVDJTlEJTk4fGVufDB8fDB8fHww",
      ],
    },
    {
      productId: 2,
      sellerId: "string",
      productName: "item2",
      productPrice: 123,
      productQuantity: 2,
      productDescription: "상품",
      productCategory: "상의",
      productImage: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlFJTg0JUVDJTlEJTk4JUVDJTlEJTk4fGVufDB8fDB8fHww",
      ],
    },
    {
      productId: 3,
      sellerId: "string",
      productName: "item3",
      productPrice: 123,
      productQuantity: 2,
      productDescription: "상품",
      productCategory: "모자",
      productImage: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlFJTg0JUVDJTlEJTk4JUVDJTlEJTk4fGVufDB8fDB8fHww",
      ],
    },
    {
      productId: 4,
      sellerId: "string",
      productName: "item1",
      productPrice: 123,
      productQuantity: 2,
      productDescription: "상품",
      productCategory: "하의",
      productImage: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlFJTg0JUVDJTlEJTk4JUVDJTlEJTk4fGVufDB8fDB8fHww",
      ],
    },
    {
      productId: 5,
      sellerId: "string",
      productName: "item2",
      productPrice: 123,
      productQuantity: 2,
      productDescription: "상품",
      productCategory: "상의",
      productImage: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlFJTg0JUVDJTlEJTk4JUVDJTlEJTk4fGVufDB8fDB8fHww",
      ],
    },
    {
      productId: 6,
      sellerId: "string",
      productName: "item3",
      productPrice: 123,
      productQuantity: 2,
      productDescription: "상품",
      productCategory: "모자",
      productImage: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlFJTg0JUVDJTlEJTk4JUVDJTlEJTk4fGVufDB8fDB8fHww",
      ],
    },
    {
      productId: 7,
      sellerId: "string",
      productName: "item1",
      productPrice: 123,
      productQuantity: 2,
      productDescription: "상품",
      productCategory: "하의",
      productImage: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlFJTg0JUVDJTlEJTk4JUVDJTlEJTk4fGVufDB8fDB8fHww",
      ],
    },
    {
      productId: 8,
      sellerId: "string",
      productName: "item2",
      productPrice: 123,
      productQuantity: 2,
      productDescription: "상품",
      productCategory: "상의",
      productImage: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlFJTg0JUVDJTlEJTk4JUVDJTlEJTk4fGVufDB8fDB8fHww",
      ],
    },
    {
      productId: 9,
      sellerId: "string",
      productName: "item3",
      productPrice: 123,
      productQuantity: 2,
      productDescription: "상품",
      productCategory: "모자",
      productImage: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlFJTg0JUVDJTlEJTk4JUVDJTlEJTk4fGVufDB8fDB8fHww",
      ],
    },
  ];

  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/registration");
  };

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
              style={{ backgroundImage: `url(${item.productImage[0]})` }}
            ></div>
            <div className="text-center">{item.productName}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 4/25 할 것
// - 회원가입/로그인 블로그 작성
// - 판매자 페이지 완성 (1주차에 해당하는거)
