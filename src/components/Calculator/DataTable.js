import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "firstName", headerName: "First name", width: 150 },
  { field: "lastName", headerName: "Last name", width: 150 },
  { field: "age", headerName: "Age", type: "number", width: 110 },
  {
    field: "fullName",
    headerName: "Full name",
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
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: 25 },
  { id: 6, lastName: "Melisandre", firstName: "Unknown", age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function DataTable() {
  const [startCell, setStartCell] = React.useState(null);
  const [endCell, setEndCell] = React.useState(null);
  const [selecting, setSelecting] = React.useState(false);
  const [selectedCells, setSelectedCells] = React.useState([]);
  const [sum, setSum] = React.useState(0);

  const handleMouseDown = (event, cellParams) => {
    event.preventDefault();
    setStartCell(cellParams);
    setSelecting(true);
    setSelectedCells([cellParams]);
  };

  const handleMouseOver = (event, cellParams) => {
    event.preventDefault();
    if (selecting) {
      setEndCell(cellParams);
    }
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    setSelecting(false);
    setStartCell(null);
    setEndCell(null);
  };

  const calculateSelectedCells = () => {
    if (!startCell || !endCell) return [];

    const startRowIndex = Math.min(startCell.rowIndex, endCell.rowIndex);
    const endRowIndex = Math.max(startCell.rowIndex, endCell.rowIndex);
    const startColIndex = Math.min(startCell.colIndex, endCell.colIndex);
    const endColIndex = Math.max(startCell.colIndex, endCell.colIndex);

    const cells = [];
    for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
      for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
        cells.push({ rowIndex, colIndex });
      }
    }
    return cells;
  };

  React.useEffect(() => {
    const cells = calculateSelectedCells();
    setSelectedCells(cells);
    const selectedAges = cells.map((cell) => rows[cell.rowIndex]?.age || 0);
    const totalSum = selectedAges.reduce((acc, age) => acc + age, 0);
    setSum(totalSum);
  }, [endCell]);

  const renderCell = (params) => {
    const isSelected = selectedCells.some(
      (cell) =>
        cell.rowIndex === params.rowIndex && cell.colIndex === params.colIndex
    );
    return (
      <div
        onMouseDown={(event) => handleMouseDown(event, params)}
        onMouseOver={(event) => handleMouseOver(event, params)}
        onMouseUp={handleMouseUp}
        style={{ backgroundColor: isSelected ? "lightblue" : "inherit" }}
      >
        {params.value}
      </div>
    );
  };

  const customColumns = columns.map((col, index) => ({
    ...col,
    renderCell: (params) => renderCell({ ...params, colIndex: index }),
  }));

  return (
    <div onMouseUp={handleMouseUp} style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={customColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
      <div>Total Sum: {sum}</div>
    </div>
  );
}
