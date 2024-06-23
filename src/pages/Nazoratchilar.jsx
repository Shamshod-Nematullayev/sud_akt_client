import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { host } from "../utils/APIRouters";

export default function Nazoratchilar() {
  const [rows, setRows] = useState([]); // State to hold rows data
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(host + "/api/inspectors"); // Replace with your endpoint
        const data = await response.json();
        const result = [];
        data.rows.forEach((row) => {
          result.push({
            id: row.id,
            name: row.name,
            mfy1: row.biriktirilgan[0],
            mfy2: row.biriktirilgan[1],
            mfy3: row.biriktirilgan[2],
          });
        });
        setRows(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on component mount

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Ism", width: 200 },
    {
      field: "mfy1",
      headerName: "Mahalla 1",
      width: 150,
      valueGetter: (params) => params.row.mfy1?.mfy_name,
    },
    {
      field: "mfy2",
      headerName: "Mahalla 2",
      width: 150,
      valueGetter: (params) => params.row.mfy2?.mfy_name,
    },
    {
      field: "mfy3",
      headerName: "Mahalla 3",
      width: 150,
      valueGetter: (params) => params.row.mfy3?.mfy_name,
    },
  ];

  return (
    <div className="admin-page">
      {/* Yuklanmoqda loader */}
      <SideBar active="inspectors" />
      <div className="container">
        <h1 style={{ fontSize: "1rem" }}>ЕсоРау тизимидаги Инспекторлар</h1>
        <DataGrid
          className="data-table card  "
          rows={rows}
          columns={columns}
          style={{ height: "90%" }}
        />
      </div>
    </div>
  );
}
