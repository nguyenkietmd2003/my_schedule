import { createContext, useState } from "react";

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
  //////////////////////////////////////////////////////////
  const [appLoading, setAppLoading] = useState(true);
  //
  const [infoRegister, setInfoRegister] = useState({
    email: "",
    password: "",
    name: "",
  });

  ////////////////////////////////////////////////////
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        appLoading,
        setAppLoading,
        infoRegister,
        setInfoRegister,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
