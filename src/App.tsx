import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import ProductRegistration from "./pages/ProductRegistration";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route
            path="/product-registration"
            element={<ProductRegistration />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
