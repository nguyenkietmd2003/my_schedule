export const languages = {
  en: {
    welcome: "Welcome",
    register: "Register",
    login: "Login",
    email: "Email",
    password: "Password",
    submit: "Submit",
  },
  vi: {
    welcome: "Chào mừng",
    register: "Đăng ký",
    login: "Đăng nhập",
    email: "Email",
    password: "Mật khẩu",
    submit: "Gửi",
  },
};

let currentLanguage = "vi";

app.get("/getLanguageStrings", (req, res) => {
  const strings = languages[currentLanguage];
  return res.status(200).json(strings);
});

// API để thay đổi ngôn ngữ
app.post("/setLanguage", (req, res) => {
  const { language } = req.body; // 'en' hoặc 'vi'

  // Kiểm tra xem ngôn ngữ có hợp lệ không
  if (languages[language]) {
    currentLanguage = language; // Cập nhật ngôn ngữ
    return res
      .status(200)
      .json({ message: `Ngôn ngữ đã được thay đổi sang ${language}` });
  } else {
    return res.status(400).json({ message: "Ngôn ngữ không hợp lệ" });
  }
});

/// fe

const [languageStrings, setLanguageStrings] = useState({});
const [currentLanguage1, setCurrentLanguage] = useState(
  localStorage.getItem("language") || "vi"
);
const fetchLanguageStrings = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/getLanguageStrings"
    );
    setLanguageStrings(response.data);
  } catch (error) {
    console.error("Lỗi khi lấy chuỗi ngôn ngữ", error);
  }
};

fetchLanguageStrings();

// Thay đổi ngôn ngữ
const handleChangeLanguage = async (language) => {
  try {
    await axios.post("http://localhost:3000/setLanguage", { language });
    setCurrentLanguage(language);
    localStorage.setItem("language", language); // Lưu ngôn ngữ vào localStorage
  } catch (error) {
    console.error("Lỗi khi thay đổi ngôn ngữ", error);
  }
};

//   sử dụng
<div>
  <label>{languageStrings.password}</label>
  <input type="password" />
</div>;
