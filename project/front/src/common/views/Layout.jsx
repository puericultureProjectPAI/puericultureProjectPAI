import { Outlet } from "react-router-dom";
import InstallPWA from "../components/InstallPWA";
import Header from "./Header";
import Navbar from "./NavBar";

const Layout = () => {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white">
      {/* Persistant on every page */}
      <InstallPWA />

      <Header />

      <main className="flex-1 overflow-y-auto">
        {/* routes contents will be integrated here*/}
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
};

export default Layout;
