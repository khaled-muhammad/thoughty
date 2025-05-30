import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { PodModalProvider } from "../contexts/PodModalContext";
import GlobalPodModal from "../components/GlobalPodModal";

export default function Layout() {
  return (
    <PodModalProvider>
      {/* Navigation */}
      <NavBar />
      <Outlet />
      {/* Footer */}
      <Footer />
      {/* Global Pod Modal */}
      <GlobalPodModal />
    </PodModalProvider>
  );
}