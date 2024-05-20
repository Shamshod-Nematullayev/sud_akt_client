import { DataGrid } from "@mui/x-data-grid";
import React from "react";

export default function DataTable({ rows }) {
  const columns = [
    { field: "id", headerName: "№", width: 70 },
    { field: "period", headerName: "Davr" },
    { field: "prescribed_cnt", headerName: "Y/S", width: 50 },
    { field: "saldo_n", headerName: "Saldo boshi", width: 80, align: "right" },
    { field: "nachis", headerName: "Hisoblandi", width: 80, align: "right" },
    { field: "saldo_k", headerName: "Saldo oxiri", width: 80, align: "right" },
    { field: "akt", headerName: "Aktlar", width: 80, align: "right" },
    { field: "income", headerName: "Tushum", width: 80, align: "right" },
  ];
  return (
    <DataGrid columns={columns} rows={rows} style={{ width: 700, height: 600 }}>
      DataTable
    </DataGrid>
  );
}
