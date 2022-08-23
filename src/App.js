import "antd/dist/antd.css";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/login";
import ProfileUser from "./pages/ProfileUser";
import Register from "./pages/register";
import RenderLayout from "./pages/RenderLayout";

const App = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState();
  useEffect(() => {
    if (!!Cookies.get().token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
    // setToken(Cookies.get().token);
  }, []);

  return (
    <Routes>
      {/* {!Cookies.get().token ? (
        <>
          <Route path="/login" element={<Login />}></Route>

          <Route path="/register" element={<Register />}></Route>
        </>
      ) : (
        <Route path="/home" element={<RenderLayout />}></Route>
      )} */}
      <Route path="/login" element={<Login />}></Route>

      <Route path="/register" element={<Register />}></Route>
      <Route path="/home" element={<RenderLayout />}></Route>
      <Route path="/home/profile" element={<ProfileUser />}></Route>
    </Routes>
  );
};

export default App;
