import { Outlet, useLocation } from "react-router-dom";
import InstallPWA from "../components/InstallPWA";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./NavBar";

const Layout = () => {
  const location = useLocation();
  const isPublicationFlow = location.pathname === "/product/create";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Persistant on every page */}
      <InstallPWA />

      {!isPublicationFlow && <Header />}

      <main className="flex-grow">
        {/* routes contents will be integrated here*/}
        <Outlet />
      </main>

      {!isPublicationFlow && <Navbar />}
      {!isPublicationFlow && <Footer />}
    </div>
  );
};

export default Layout;
