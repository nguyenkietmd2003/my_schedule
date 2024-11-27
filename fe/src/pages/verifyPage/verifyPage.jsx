import { useContext, useEffect, useState } from "react"; // Nhập useState từ React
import { Link, useNavigate } from "react-router-dom";
import "../registerPage/registerPage.css";
import { verifyOtp } from "../../util/api";
import { AuthContext } from "../../context/wrapContext";

const VerifyPage = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { infoRegister } = useContext(AuthContext);
  const focusPlaceholder = (inputId) => {
    document.querySelector(`#${inputId}`).focus();
  };
  const register = async (email, name, password) => {
    try {
      const result = await verifyOtp(email, name, password, otp);
      if (result.data.ER === 0) {
        navigate("/");
      } else alert("Otp verification failed");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const checkInfo = () => {
      if (infoRegister.email == "") {
        navigate("/register");
      }
    };
    checkInfo();
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, name, password } = infoRegister;
    register(email, name, password);
  };

  return (
    <div className="register-container">
      <span className="h-12 text-[40px] font-bol mb-[32.75px] block text-center">
        Xác thực OTP
      </span>
      <form
        action=""
        className="flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <div
          className="input-container mb-[24.65px]"
          onClick={() => focusPlaceholder("otp")}
        >
          <input
            type="number"
            id="otp"
            placeholder=""
            className="input-field"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <label htmlFor="name" className="placeholder"></label>
        </div>

        <button type="submit" className="submit-button">
          Xác Thực
        </button>
      </form>
    </div>
  );
};

export default VerifyPage;
