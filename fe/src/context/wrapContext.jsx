import { createContext, useState } from "react";
import en from "../translations/en.json";
import vi from "../translations/vi.json";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    id: 0,
    email: "",
    name: "",
  },
  appLoading: true,
  infoRegister: {
    email: "",
    password: "",
    name: "",
  },
  language: "en", // Thêm ngôn ngữ vào context
  translations: en, // Thêm thông tin ngôn ngữ vào context
  setLanguage: () => {}, // Hàm thay đổi ngôn ngữ
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      id: 0,
      email: "",
      name: "",
    },
  });

  const [appLoading, setAppLoading] = useState(true);

  const [infoRegister, setInfoRegister] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState(en);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    if (lang === "en") {
      setTranslations(en);
    } else if (lang === "vn") {
      setTranslations(vi);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        appLoading,
        setAppLoading,
        infoRegister,
        setInfoRegister,
        language,
        translations,
        setLanguage: changeLanguage,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
