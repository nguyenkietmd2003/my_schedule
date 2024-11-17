import { useContext, useState } from "react"; // Nhập useState từ React
import { Link, useNavigate } from "react-router-dom";
import "./registerPage.css";
import { sendOtp } from "../../util/api";
import { AuthContext } from "../../context/wrapContext";

const RegisterPage = () => {
  const [name, setName] = useState(""); // Trạng thái cho tên
  const [email, setEmail] = useState(""); // Trạng thái cho email
  const [password, setPassword] = useState(""); // Trạng thái cho mật khẩu
  const navigate = useNavigate();
  const { setInfoRegister } = useContext(AuthContext);
  const focusPlaceholder = (inputId) => {
    document.querySelector(`#${inputId}`).focus();
  };
  const register = async (name, password, email) => {
    try {
      const result = await sendOtp(email);
      if (result.data.ER === 0 || result.data.ER === 1) {
        setInfoRegister({
          name,
          email,
          password,
        });
        navigate("/verify");
      }
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
        Signup
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
            value={name} // Liên kết với trạng thái
            onChange={(e) => setName(e.target.value)} // Cập nhật trạng thái khi thay đổi
          />
          <label htmlFor="name" className="placeholder">
            Name
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
            value={email} // Liên kết với trạng thái
            onChange={(e) => setEmail(e.target.value)} // Cập nhật trạng thái khi thay đổi
          />
          <label htmlFor="email" className="placeholder">
            Email
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
            value={password} // Liên kết với trạng thái
            onChange={(e) => setPassword(e.target.value)} // Cập nhật trạng thái khi thay đổi
          />
          <label htmlFor="password" className="placeholder">
            Password
          </label>
        </div>

        <button type="submit" className="submit-button">
          Signup
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
