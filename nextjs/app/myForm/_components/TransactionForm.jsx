// src/components/TransactionForm.tsx
import React, { useState } from "react";
import { Box, Button, Container, Slide, TextField, Typography } from "@mui/material";

const TransactionForm = ({ postProof }) => {
  const [formData, setFormData] = useState({
    email: "test@example.com",
    ethAddress: "0x7DA62A19305496d2A8C27D92770930c0d8125896",
    number: "1234567890",
  });
  const [response, setResponse] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // if (Object.values(formData).some(field => field === "" || field === 0)) {
    //   alert("Please fill out all fields correctly.");
    //   return;
    // }

    try {
      await postProof(formData);
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        mt: 5,
        mb: 5,
        p: 4,
        backgroundColor: "background.paper",
        borderRadius: 4,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        "& .MuiTextField-root": {
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
          mb: 1,
        },
        "& .MuiButton-root": {
          mt: 2,
          fontSize: "1.1rem",
        },
      }}
    >
      <Typography variant="h4" gutterBottom color="text.primary">
        Provide Transaction Data
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Email" name="email" type="text" onChange={handleChange} placeholder="test@example.com" />
        <TextField label="ETH Address" name="ethAddress" type="text" onChange={handleChange} placeholder="0x..." />
        <TextField label="Number" name="number" type="text" onChange={handleChange} placeholder="1234567890" />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default TransactionForm;
