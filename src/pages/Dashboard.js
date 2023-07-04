import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user_data")) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="admin-page">
      <SideBar />
    </div>
  );
}

export default Dashboard;
