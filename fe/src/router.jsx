// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/homepage/homepages";
import LoginPage from "./pages/loginPage/loginpage";
import RegisterPage from "./pages/registerPage/registerPage";
import SharedPage from "./pages/SharedPage/SharePage";
import ProtectedRoute from "./util/protectedRoute.jsx";
import VerifyPage from "./pages/verifyPage/verifyPage.jsx";
import FreeTimeForm from "./pages/freeTimePage/freeTimePage.jsx";
import TestPage from "./pages/test.jsx";
import AB from "./pages/test2.jsx";
import AP from "./pages/test3.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/verify",
        element: <VerifyPage />,
      },
      { path: "/freeTime", element: <FreeTimeForm /> },
    ],
  },
  {
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  // Route lỗi
  {
    path: "*",
    element: <div>Error Page</div>,
  },
  {
    path: `/link-schedule/:randomString`,
    element: <SharedPage />,
  },
  {
    path: "t",
    element: <TestPage />,
  },
  {
    path: "tt",
    element: <AB />,
  },
  {
    path: "ttt",
    element: <AP />,
  },
]);
