import { Link, useNavigate } from "react-router-dom";
import "./loginPage.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/wrapContext";
import { loginAPI } from "./../../util/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const focusPlaceholder = (inputId) => {
    document.querySelector(`#${inputId}`).focus();
  };
  useEffect(() => {
    // Kiểm tra localStorage khi component được khởi tạo
    const storedUser = JSON.parse(localStorage.getItem("info"));
    if (storedUser && storedUser.data) {
      // Tự động thiết lập trạng thái đăng nhập và chuyển hướng đến /calendar
      setAuth({
        isAuthenticated: true,
        user: {
          id: storedUser.data.user.id,
          email: storedUser.data.user.email,
          name: storedUser.data.user.name,
        },
      });
      navigate("/calendar");
    }
  }, []);

  const login = async () => {
    try {
      const user = await loginAPI(email, password);
      if (user.status === 200) {
        setAuth({
          isAuthenticated: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        });

        localStorage.setItem("info", JSON.stringify({ data: user.data }));
        navigate("/calendar");
      }
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  return (
    <div className="login-container">
      <span className="h-12 text-[40px] font-bol mb-[41px] block text-center">
        Login
      </span>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div
          className="input-container mb-6"
          onClick={() => focusPlaceholder("email")}
        >
          <input
            type="text"
            id="email"
            placeholder=""
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email" className="placeholder">
            Email
          </label>
        </div>
        <div
          className="input-container mb-[19px]"
          onClick={() => focusPlaceholder("password")}
        >
          <input
            type="password"
            id="password"
            placeholder=""
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password" className="placeholder">
            Password
          </label>
        </div>
        <Link className="mb-[19px] block text-[15px]" to={"/register"}>
          Register here.
        </Link>
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
