import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Seller from "./pages/Seller";
import Registration from "./pages/Registration";
import ProductDetail from "./pages/ProductDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/login", element: <Login />, children: [] },
      { path: "/signup", element: <Signup />, children: [] },
      {
        path: "/seller",
        element: <Seller />,
        children: [],
      },
      { path: "/seller/:productId", element: <ProductDetail />, children: [] },
      {
        path: "/registration",
        element: <Registration />,
        children: [],
      },
    ],
  },
]);

export default router;
