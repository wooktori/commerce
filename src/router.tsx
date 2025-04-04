import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
  { path: "/", element: <App />, children: [] },
  { path: "/login", element: <Login />, children: [] },
  { path: "/signup", element: <Signup />, children: [] },
]);

export default router;
