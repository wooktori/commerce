import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productDescription, setProductDescription] = useState("");
  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const productId = params.productId;
      if (productId) {
        try {
          const docRef = doc(db, "products", productId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const {
              productName,
              productPrice,
              productDescription,
              productQuantity,
              productImageUrls,
            } = docSnap.data();
            console.log(docSnap.data());
            setProductName(productName);
            setProductQuantity(productQuantity);
            setProductPrice(productPrice);
            setProductDescription(productDescription);
            setImagePaths(productImageUrls);
            console.log(imagePaths);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getProducts();
  }, []);

  return (
    <div>
      {" "}
      <div className="flex justify-between  mx-auto container">
        <Button onClick={() => navigate("/mypage")}>&larr;</Button>
        <Button onClick={() => navigate("/product-registration")}>
          상품등록
        </Button>
      </div>
      <hr className="my-3" />
      <div>
        <div className="flex">
          {imagePaths.map((path) => (
            <img src={path} alt="이미지" className="w-52 h-52" />
          ))}
        </div>
        <div>{productName}</div>
        <div>{productPrice}원</div>
        <div>{productQuantity}개</div>
        <div>{productDescription}</div>
      </div>
    </div>
  );
}
