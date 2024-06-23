import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SideBar({ active }) {
  const [activeNavItem, setActiveNavItem] = useState({
    aktlar: "link-body-emphasis",
    ogohlantirish: "link-body-emphasis",
    forma1: "link-body-emphasis",
    dalolatnomalar: "link-body-emphasis",
    bildirgilar: "link-body-emphasis",
    documents: "link-body-emphasis",
  });

  const navItems = [
    {
      to: "/pachkalar",
      active: "aktlar",
      text: "Aktlar",
    },
    {
      to: "/ogohlantirish_xatlar",
      active: "ogohlantirish_xatlar",
      text: "Ogohlantirish xatlari",
    },
    {
      to: "/forma_bir",
      active: "forma_bir",
      text: "Forma 1",
    },
    {
      to: "/dalolatnomalar",
      active: "dalolatnomalar",
      text: "Dalolatnomalar",
    },
    {
      to: "/bildirgilar",
      active: "bildirgilar",
      text: "Bildirgi xatlari",
    },
    {
      to: "/documents",
      active: "documents",
      text: "Xujjatlar",
    },
    {
      to: "/inspectors",
      active: "inspectors",
      text: "Nazoratchilar",
    },
    {
      to: "/qulayliklar",
      active: "qulayliklar",
      text: "Uskunalar",
    },
  ];

  return (
    <div className="side-bar d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary">
      <div className="brand">
        <Link
          to="/dashboard"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <h1 className="fs-4">Xadsen Max</h1>
        </Link>
      </div>
      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item, i) => (
          <li className="nav-item" key={i}>
            <Link
              to={item.to}
              className={`nav-link ${
                active === `${item.active}` ? "active" : "link-body-emphasis"
              }`}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
