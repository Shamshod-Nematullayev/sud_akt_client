import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Aktlar from "../pages/Aktlar";
import Ogohlantirish from "../pages/Ogohlantirish";
import Forma1 from "../pages/Forma1";
import Dalolatnomalar from "../pages/Dalolatnomalar";
import Bildirgilar from "../pages/Bildirgilar";
import Pachkalar from "../pages/Pachkalar";
import NotFound from "../components/NotFound/NotFound"; // Add a NotFound component for 404 pages
import Documents from "../pages/Documents";
import useAuthStore from "../store/authStore";
import Qulayliklar from "../pages/Qulayliklar";
import Calculator from "./Calculator/Calculator";

const PrivateRoute = ({ element, ...props }) => {
  const isAuthenticated = useAuthStore((state) => state.user);

  return element; // vaqtincha dastur ishlab chiqilayotganiligi sababli auth o'chirib qo'yildi
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
    <Route
      path="/dashboard"
      element={<PrivateRoute element={<Dashboard />} />}
    />
    <Route path="/aktlar/*" element={<PrivateRoute element={<Aktlar />} />} />
    <Route
      path="/ogohlantirish_xatlar"
      element={<PrivateRoute element={<Ogohlantirish />} />}
    />
    <Route path="/forma_bir" element={<PrivateRoute element={<Forma1 />} />} />
    <Route
      path="/dalolatnomalar"
      element={<PrivateRoute element={<Dalolatnomalar />} />}
    />
    <Route
      path="/bildirgilar"
      element={<PrivateRoute element={<Bildirgilar />} />}
    />
    <Route
      path="/pachkalar"
      element={<PrivateRoute element={<Pachkalar />} />}
    />
    <Route
      path="/documents"
      element={<PrivateRoute element={<Documents />} />}
    />
    <Route
      path="/qulayliklar"
      element={<PrivateRoute element={<Qulayliklar />} />}
    />
    <Route
      path="/calculator"
      element={<PrivateRoute element={<Calculator />} />}
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
