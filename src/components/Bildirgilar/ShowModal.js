import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function ShowModal({ details }) {
  const [open, setOpen] = React.useState(false);
  // const [detail, setDetail] = React.useState();

  const handleClickOpen = (e) => {
    // setDetail(details);
    console.log(details);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        id={details._id}
        onClick={(e) => handleClickOpen(details)}
      >
        <PreviewIcon className="mx-2" />
      </span>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{details.fish}</DialogTitle>

        <DialogContent>
          <TableContainer>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Kodi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.abonents.map((data, i) => (
                <TableRow key={data + Date.now()}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell align="center">{data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
