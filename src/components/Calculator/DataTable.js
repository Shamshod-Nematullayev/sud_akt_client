import { DataGrid, gridClasses } from "@mui/x-data-grid";
import React from "react";
import { alpha, styled } from "@mui/material/styles";
const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export default function DataTable({ rows }) {
  const columns = [
    { field: "id", headerName: "№", width: 70 },
    { field: "period", headerName: "Davr" },
    { field: "prescribed_cnt", headerName: "Y/S", width: 50 },
    { field: "saldo_n", headerName: "Saldo boshi", width: 90, align: "right" },
    { field: "nachis", headerName: "Hisoblandi", width: 90, align: "right" },
    { field: "saldo_k", headerName: "Saldo oxiri", width: 90, align: "right" },
    { field: "akt", headerName: "Aktlar", width: 90, align: "right" },
    { field: "income", headerName: "Tushum", width: 90, align: "right" },
  ];
  return (
    <StripedDataGrid
      columns={columns}
      rows={rows}
      style={{ width: 770, height: 600 }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
    >
      DataTable
    </StripedDataGrid>
  );
}
