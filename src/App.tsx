import { Outlet } from "react-router";
import Header from "./components/Header";
import { useAuth } from "./hooks/useAuth";

function App() {
  const data = useAuth();
  console.log(data);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
