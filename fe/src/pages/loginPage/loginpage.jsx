import { Link, useNavigate } from "react-router-dom";
import "./loginPage.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/wrapContext";
import { loginAPI } from "./../../util/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth, translations, setLanguage, language } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const focusPlaceholder = (inputId) => {
    document.querySelector(`#${inputId}`).focus();
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("info"));
    if (storedUser && storedUser.data) {
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
      } else alert("Email/password is incorrect");
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  const changeLanguage = (event) => {
    const lang = event.target.value;
    setLanguage(lang);
  };

  return (
    <div className="login-container">
      <span className="h-12 text-[40px] font-bold mb-[41px] block text-center">
        {translations.login}
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
            {translations.email}
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
            {translations.password}
          </label>
        </div>
        <div className="flex items-center mb-[19px]">
          <Link className="block text-[15px]" to={"/register"}>
            {translations.register_here}
          </Link>
          <select
            value={language}
            onChange={changeLanguage}
            className="language-select ml-4"
          >
            <option value="en">English</option>
            <option value="vn">Tiếng Việt</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          {translations.login}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
