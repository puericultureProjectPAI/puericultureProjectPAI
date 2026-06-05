import { Outlet } from "react-router-dom";
import InstallPWA from "../components/InstallPWA";
import Header from "./Header";
import Navbar from "./NavBar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Persistant on every page */}
      <InstallPWA />

      <Header />

      <main className="flex-grow">
        {/* routes contents will be integrated here*/}
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
};

export default Layout;
