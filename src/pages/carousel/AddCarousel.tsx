import { Paper, Typography, Button as MuiButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import useModal from "../../hooks/use-modal";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../constants/ApiService.Dev";
import { ICategory } from "./interface/Interface";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/auth/selector";

export default function AddCarousel() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const user = useSelector(selectAuthUser);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    categoryId: 0,
    publishedBy: user?.name,
    postedDate: "",
    expiredDate: "",
  });

  useEffect(() => {
    console.log(formData);
    fetchCategories();
  }, [formData]);

  const fetchCategories = async () => {
    const response = await axios.get(ApiService.getCategories);
    setCategories(response.data);
  };

  const handleClick = async () => {
    await axios.post(ApiService.addCarousel, formData);
    showModal({
      title: "Carousel Added",
      message: `Carousel\n${formData.title}\nSuccessfully Added!`,
      options: {
        buttonTitle: "Continue",
        variant: "success",
        onOk: () => {
          navigate("/carousel-manager");
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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleIdChange = (e) => {
    const categoryIdInput = parseInt(e.target.value, 10);
    setFormData((prevState) => ({
      ...prevState,
      categoryId: categoryIdInput,
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
              type="text"
              placeholder="Enter carousel image URL"
              onChange={handleInputChange}
            />
            <img
              className="mt-3 w-100"
              src={formData.image}
              alt="Carousel preview"
              style={{
                display: formData.image.length === 0 ? "none" : "block",
                maxHeight: "200px",
                objectFit: "contain",
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

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between", width: "100%", mb: 3 }}
          >
            <FormGroup>
              <Label for="postedDate">Posted Date</Label>
              <Input
                type="date"
                name="postedDate"
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="expiredDate">Expired Date</Label>
              <Input
                type="date"
                name="expiredDate"
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
          </Stack>

          <FormGroup>
            <Label for="categoryId">Carousel Category</Label>
            <Input name="categoryId" type="select" onChange={handleIdChange}>
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
