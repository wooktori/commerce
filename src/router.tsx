import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Seller from "./pages/Seller";
import Registration from "./pages/Registration";
import ProductDetail from "./pages/ProductDetail";
import ProductEdit from "./pages/ProductEdit";
import Main from "./pages/Main";
import { ProtectedSellerRoute } from "./components/ProtectSellerRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Main />, children: [] },
      { path: "/login", element: <Login />, children: [] },
      { path: "/signup", element: <Signup />, children: [] },
      {
        path: "/seller",
        element: (
          <ProtectedSellerRoute>
            <Seller />
          </ProtectedSellerRoute>
        ),
        children: [
          {
            path: ":productId",
            element: <ProductDetail />,
            children: [],
          },
          {
            path: ":productId/edit",
            element: <ProductEdit />,
            children: [],
          },
          {
            path: "registration",
            element: <Registration />,
            children: [],
          },
        ],
      },
    ],
  },
]);

export default router;
