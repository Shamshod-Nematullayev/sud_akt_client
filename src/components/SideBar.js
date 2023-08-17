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

  useEffect(() => {
    setActiveNavItem({ ...activeNavItem, [active]: "active" });
  }, []);

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
        <li className="nav-item">
          <Link
            to="/pachkalar"
            className={`nav-link ${activeNavItem.aktlar}`}
            aria-current="page"
          >
            Aktlar
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/ogohlantirish_xatlar"
            className={`nav-link ${activeNavItem.ogohlantirish}`}
          >
            Ogohlantirish xatlari
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/forma_bir" className={`nav-link  ${activeNavItem.forma1}`}>
            Forma 1
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/dalolatnomalar"
            className={`nav-link  ${activeNavItem.dalolatnomalar}`}
          >
            Dalolatnomalar
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/bildirgilar"
            className={`nav-link  ${activeNavItem.bildirgilar}`}
          >
            Bildirgi xatlari
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/documents"
            className={`nav-link  ${activeNavItem.documents}`}
          >
            Xujjatlar
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
