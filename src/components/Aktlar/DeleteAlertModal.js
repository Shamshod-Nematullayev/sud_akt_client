import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hide } from "../../app/reducers/showHideSlice";

function DeleteAlertModal({ fetchDelete }) {
  const { show } = useSelector((state) => state.showHide);
  const dispatch = useDispatch();
  console.log(show);

  const handleClose = () => {
    dispatch(hide());
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Rostdan ham o'chirmoqchimisiz?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Agar o'chirish tugmasini bossangiz ma'lumotlar bazasidan siz tanlagan
          akt ma'lumotlari butunlay o'chib ketadi va ularni keyinchalik qayta
          tiklash imkoniyati yo'q
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Bekor qilish
        </Button>
        <Button
          onClick={() => {
            fetchDelete();
          }}
          variant="outlined"
          color="error"
        >
          O'chirish
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteAlertModal;
