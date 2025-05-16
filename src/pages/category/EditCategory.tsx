import { Paper, Typography, Button as MuiButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import useModal from "../../hooks/use-modal";
import { useNavigate, useParams } from "react-router-dom";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";

export default function EditCategory() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState({
    id: 0,
    name: "",
  });

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    const response = await apiClient.get(`${ApiService.getCategory}/${id}`);
    const fetchedCategory = response.data;
    setCategoryData(fetchedCategory);
  };

  const handleClick = async () => {
    console.log(categoryData);
    await axios.put(`${ApiService.editCategory}/${id}`, categoryData);
    showModal({
      title: "Category Updated",
      message: `Category\n${categoryData.name}\nSuccessfully Updated!`,
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
    const { name, value } = e.target;
    setCategoryData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
          EDIT CATEGORY - BINUS
        </Typography>
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              name="name"
              type="text"
              placeholder="Enter category name"
              value={categoryData.name}
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
