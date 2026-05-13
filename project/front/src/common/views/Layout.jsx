import { Outlet } from "react-router-dom";
import InstallPWA from "../components/InstallPWA";
import Footer from "./Footer";
import Header from "./Header";

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

      <Footer />
    </div>
  );
};

export default Layout;
