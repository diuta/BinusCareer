import { Paper, Typography, Button as MuiButton, Stack, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import useModal from "../../hooks/use-modal";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../constants/ApiService.Dev";
import { ICategory } from "./interface/Interface";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/auth/selector";
import apiClient from "../../config/api-client";
import { Box } from "@mui/system";

export default function AddCarousel() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const user = useSelector(selectAuthUser);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    categoryId: 1,
    createdBy: user?.name,
    postedDate: "",
    expiredDate: "",
  });

  useEffect(() => {
    fetchCategories();
    console.log(formData);
  }, [formData]);

  const fetchCategories = async () => {
    const response = await axios.get(ApiService.categories);
    setCategories(response.data);
  };

  const handleClick = async () => {
    if (!formData.postedDate || !formData.expiredDate) {
      showModal({
        title: "Carousel Failed To Add",
        message: "Please insert the posted / expired date",
        options: {
          buttonTitle: "Continue",
          variant: "failed",
        },
      });
      return;
    }

    const data = new FormData();
    data.append("title", formData.title || "");
    data.append("description", formData.description || "");
    data.append("image", formData.image || "");
    data.append("categoryId", formData.categoryId.toString());
    data.append("createdBy", formData.createdBy);
    data.append("postedDate", formData.postedDate);
    data.append("expiredDate", formData.expiredDate);

    try {
      await apiClient.post(ApiService.carousels, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showModal({
        title: "Carousel Added",
        message: `Carousel\n${formData.title}\nSuccessfully Added!`,
        options: {
          buttonTitle: "Continue",
          variant: "success",
          onOk: () => {
            navigate("/carousel/manager");
          },
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showModal({
          title: "Carousel Failed To Add",
          message: error.response?.data,
          options: {
            buttonTitle: "Continue",
            variant: "failed",
          },
        });
      }
    }
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryIdInput = parseInt(e.target.value, 10);
    setFormData((prevState) => ({
      ...prevState,
      categoryId: categoryIdInput,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    }
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
          ADD CAROUSEL - BINUS
        </Typography>
        <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              name="title"
              type="text"
              placeholder="Enter carousel title"
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="image">ImageUrl</Label>
            <Input
              name="image"
              type="file"
              placeholder="Enter carousel image URL"
              onChange={handleFileChange}
              style={{
                width: "100%",
                border: "1px solid lightgrey",
                padding: "10px",
                borderRadius: "3px",
              }}
            />
          </FormGroup>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              name="description"
              type="textarea"
              placeholder="Enter carousel description"
              onChange={handleInputChange}
              style={{ height: 200 }}
            />
          </FormGroup>

          <Grid
            container
            direction="row"
            columns={2}
            sx={{ justifyContent: "space-between", width: "100%", mb: 3 }}
          >
            <Grid item xs={1}>
              <FormGroup>
                <Label for="postedDate">Posted Date</Label>
                <Input
                  name="postedDate"
                  type="date"
                  onChange={handleInputChange}
                  style={{ width: "90%", maxWidth: "35vw" }}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={1}>
              <Box sx={{ display: "flex", justifyContent: "flex-end"}}>
                <FormGroup style={{width: "90%"}}>
                  <Label for="expiredDate">Expired Date</Label>
                  <Input
                    name="expiredDate"
                    type="date"
                    onChange={handleInputChange}
                    style={{ width: "100%", maxWidth: "35vw" }}
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>

          <FormGroup>
            <Label for="categoryId">Carousel Category</Label>
            <Input
              name="categoryId"
              type="select"
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <option value={category.id}>{category.name}</option>
              ))}
            </Input>
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
