import { Paper, Typography, Button as MuiButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import useModal from "../../hooks/use-modal";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";

export default function AddCategory() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    console.log(categoryName);
  }, [categoryName]);

  const handleClick = async () => {
    await axios.post(ApiService.addCategory, { name: categoryName });
    showModal({
      title: "Category Added",
      message: `Category\n${categoryName}\nSuccessfully Added!`,
      options: {
        buttonTitle: "Continue",
        variant: "success",
        onOk: () => {
          navigate("/category-manager");
        },
      },
    });
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { value } = e.target;
    setCategoryName(value);
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
      elevation={2}
    >
      <Stack sx={{ width: "90%", padding: 2 }} spacing={2} direction="column">
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            my: 4,
          }}
          color="#2196f3"
        >
          ADD CATEGORY - BINUS
        </Typography>
        <Form>
          <FormGroup>
            <Label for="categoryName">Name</Label>
            <Input
              name="categoryName"
              type="text"
              placeholder="Enter category name"
              onChange={handleInputChange}
            />
          </FormGroup>
        </Form>
        <MuiButton
          color="primary"
          variant="outlined"
          onClick={handleClick}
          sx={{ alignSelf: "flex-end", my: 4 }}
        >
          Submit
        </MuiButton>
      </Stack>
    </Paper>
  );
}
