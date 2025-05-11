import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.login(email, password);

      if (!res.user?.user_id) {
        throw new Error("Invalid response from server.");
      }

      sessionStorage.setItem("jwtToken", res.jwtToken);
      sessionStorage.setItem("csrfToken", res.csrfToken);
      localStorage.setItem("userId", res.user.user_id);
      localStorage.setItem("userEmail", res.user.email);

      toast.success("Login successful!");
      login();
      navigate("/");
      window.location.reload();
    } catch (err: any) {
      console.log(err.message || "Login failed");
      toast.error("Login failed");
    }
  };

  return (
    <>
      <div className="auth-page-wrapper">
        <div className="d-flex">
          <div>
            <img
              src="src/assets/images/auth.jpg"
              alt=""
              className="auth-modal-image"
            />
          </div>
          <div className="auth-form-container">
            <button
              onClick={() => navigate("/")}
              className="btn btn-link mb-4 p-0"
              style={{textDecoration: "none"}}
            >
              &larr; Back to Home
            </button>
            <div className="d-flex justify-content-center mb-4">
              <img
                src="src/assets/images/logoAuth.png"
                alt="Logo"
                height={50}
              />
            </div>
            <p className="text-center text-muted mb-4">
              Log in to explore countries around the world
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button className="btn custom-btn w-100 mt-2">Login</button>
            </form>

            <p className="text-center mt-3 mb-0">
              Don't have an account?{" "}
              <Link className="text-decoration-none fw-semibold" to="/register">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
