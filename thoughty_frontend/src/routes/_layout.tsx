import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { PodModalProvider } from "../contexts/PodModalContext";
import { AuthProvider } from "../contexts/AuthContext";
import GlobalPodModal from "../components/GlobalPodModal";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
  return (
    <AuthProvider>
      <PodModalProvider>
      {/* Navigation */}
      <NavBar />
      <Outlet />
      {/* Footer */}
      <Footer />
        {/* Global Pod Modal */}
        <GlobalPodModal />
        
        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          }}
        />
      </PodModalProvider>
    </AuthProvider>
  );
}