import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./registerPage.css";
import { sendOtp } from "../../util/api";
import { AuthContext } from "../../context/wrapContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setInfoRegister, translations } = useContext(AuthContext);

  const focusPlaceholder = (inputId) => {
    document.querySelector(`#${inputId}`).focus();
  };

  const register = async (name, password, email) => {
    try {
      const result = await sendOtp(email);
      console.log(result);
      if (result.data.ER === 0 || result.data.ER === 1) {
        setInfoRegister({
          name,
          email,
          password,
        });
        navigate("/verify");
      } else alert("vui long nhap day du thong tin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    register(name, password, email);
  };

  return (
    <div className="register-container">
      <span className="h-12 text-[40px] font-bol mb-[32.75px] block text-center">
        {translations.signup}
      </span>
      <form
        action=""
        className="flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <div
          className="input-container mb-[24.65px]"
          onClick={() => focusPlaceholder("name")}
        >
          <input
            type="text"
            id="name"
            placeholder=""
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="name" className="placeholder">
            {translations.name} {/* Sử dụng bản dịch */}
          </label>
        </div>
        <div
          className="input-container mb-[24.65px]"
          onClick={() => focusPlaceholder("email")}
        >
          <input
            type="text"
            id="email"
            placeholder=""
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="email" className="placeholder">
            {translations.email}
          </label>
        </div>
        <div
          className="input-container mb-[47px]"
          onClick={() => focusPlaceholder("password")}
        >
          <input
            type="password"
            id="password"
            placeholder=""
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="password" className="placeholder">
            {translations.password}
          </label>
        </div>

        <button type="submit" className="submit-button">
          {translations.signup}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
