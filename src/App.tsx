import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { RoutesRenderer } from "./routes";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className={`app-container ${isAuthPage ? "auth-page" : ""}`}>
      {!isAuthPage && <Sidebar />}

      <div className="app-content-wrapper">
        <main className={`app-main ${isAuthPage ? "auth-page" : ""}`}>
          <RoutesRenderer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="light"
            closeOnClick
            pauseOnHover
          />
        </main>
      </div>
    </div>
  );
};

export default App;
