import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

function InputCalculator() {
  const [expression, setExpression] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      try {
        // Evaluate the expression
        const evalResult = eval(expression);
        setExpression(evalResult.toString());
      } catch (error) {
        setExpression("Error");
      }
    }
  };

  const handleInputChange = (event) => {
    setExpression(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      if (expression === "Error") {
        setExpression("");
      }
    }
    if (event.key === "Delete") {
      try {
        setExpression("");
      } catch (error) {
        setExpression("Error");
      }
    }
  };

  return (
    <Box
      sx={{
        width: "300px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <TextField
        fullWidth
        label="Calculator"
        variant="outlined"
        value={expression}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        inputProps={{ style: { fontSize: "1.5rem", textAlign: "right" } }}
        autoFocus
      />
    </Box>
  );
}

export default InputCalculator;
