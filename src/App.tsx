import { Outlet } from "react-router";
import Header from "./components/Header";
import { useAuth } from "./hooks/useAuth";

function App() {
  useAuth();
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
