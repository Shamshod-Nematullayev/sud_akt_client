import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const handleEdit = (row, field) => {
  console.log("Edit row:", row, "Field:", field);
  // Implement your edit logic here
};

const handleDelete = (row, field) => {
  console.log("Delete row:", row, "Field:", field);
  // Implement your delete logic here
};

const renderActions = (params) => (
  <>
    <IconButton
      color="primary"
      onClick={() => handleEdit(params.row, params.field)}
    >
      <EditIcon />
    </IconButton>
    <IconButton
      color="secondary"
      onClick={() => handleDelete(params.row, params.field)}
    >
      <DeleteIcon />
    </IconButton>
  </>
);

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "firstName", headerName: "First name", width: 150 },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    renderCell: renderActions,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    renderCell: (params) => renderActions(params.row),
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function Test() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}
