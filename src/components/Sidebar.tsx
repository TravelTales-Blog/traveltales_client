import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import sidebarLogo from "../assets/images/logoFull2.png";
import CreatePostModal from "../pages/CreatePost";

const Sidebar: React.FC = () => {
  const { userId } = useAuth();
  const nav = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-item ${isActive ? "fw-bold" : "fw-light"}`;

  return (
    <aside className="aside">
      <div className="d-flex justify-content-start mb-5 mx-4">
        <img src={sidebarLogo} alt="Logo" height={27} />
      </div>

      <nav className="side-nav">
        <NavLink to="/" className={navLinkClass}>
          <i className="bi bi-house-fill me-2" /> Home
        </NavLink>

        <NavLink to="/search" className={navLinkClass}>
          <i className="bi bi-search me-2" /> Search
        </NavLink>

        <NavLink to="/following" className={navLinkClass}>
          <i className="bi bi-person-check me-2" /> Following
        </NavLink>

        {userId && (
          <>
            <button
              className={navLinkClass + "  nav-link d-flex align-items-center"}
              onClick={() => setShowCreate(true)}
            >
              <i className="bi bi-plus-circle me-2" /> Create Post
            </button>

            <NavLink
              to={`/profile/${userId}`}
              className={navLinkClass}
            >
              <i className="bi bi-person-circle me-2" /> My Profile
            </NavLink>
          </>
        )}
      </nav>

      <div style={{ marginTop: "auto" }}>
        {userId ? (
          <button
            onClick={() => {
              localStorage.clear();
              nav("/");
              window.location.reload();
            }}
            className="sidebar-logout-btn"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => nav("/login")}
            className="sidebar-login-btn"
          >
            Login
          </button>
        )}
      </div>

      <CreatePostModal
        show={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          window.location.reload();
        }}
      />
    </aside>
  );
};

export default Sidebar;
