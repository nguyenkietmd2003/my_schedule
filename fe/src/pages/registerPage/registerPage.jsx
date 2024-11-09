import { useState } from "react"; // Nhập useState từ React
import { Link, useNavigate } from "react-router-dom";
import "./registerPage.css";
import { registerAPI } from "../../util/api";

const RegisterPage = () => {
  const [name, setName] = useState(""); // Trạng thái cho tên
  const [email, setEmail] = useState(""); // Trạng thái cho email
  const [phone, setPhone] = useState(""); // Trạng thái cho số điện thoại
  const [password, setPassword] = useState(""); // Trạng thái cho mật khẩu
  const navigate = useNavigate();
  const focusPlaceholder = (inputId) => {
    document.querySelector(`#${inputId}`).focus();
  };
  const register = async (name, password, email, phone) => {
    try {
      const result = await registerAPI(name, password, email, phone);
      // chua validate data
      console.log(result);
      if (result.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    register(name, password, email, phone);
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
          className="input-container mb-[24.65px]"
          onClick={() => focusPlaceholder("phone")}
        >
          <input
            type="number"
            id="phone"
            placeholder=""
            className="input-field"
            value={phone} // Liên kết với trạng thái
            onChange={(e) => setPhone(e.target.value)} // Cập nhật trạng thái khi thay đổi
          />
          <label htmlFor="phone" className="placeholder">
            Phone
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
