import { Paper, Stack, Typography, Button as MuiButton } from "@mui/material";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useModal from "../../hooks/use-modal";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/auth/selector";
import { ICategory } from "./interface/Interface";
import { Box } from "@mui/system";

export default function EditCarousel() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { id } = useParams();
  const user = useSelector(selectAuthUser);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    description: "",
    categoryId: 0,
    updatedBy: "",
    postedDate: "",
    expiredDate: "",
  });
  const [image, setImage] = useState<File>();
  const [prevImage, setPrevImage] = useState("");

  useEffect(() => {
    if (id) {
      fetchCarouselData();
      fetchCategories();
    }
  }, [id]);

  useEffect(() => {
    console.log(image);
  });

  const fetchCategories = async () => {
    const response = await apiClient.get(ApiService.categories);
    setCategories(response.data);
  };

  const fetchCarouselData = async () => {
    const response = await apiClient.get(`${ApiService.carousels}/${id}`);
    const carouselData = response.data;

    setFormData({
      id: carouselData.id,
      title: carouselData.title,
      description: carouselData.description,
      categoryId: carouselData.categoryId,
      updatedBy: user?.name,
      postedDate: carouselData.postedDate.split("T")[0],
      expiredDate: carouselData.expiredDate.split("T")[0],
    });
    setPrevImage(`${ApiService.URL}${carouselData.image}`);
  };

  const handleUpdateCarousel = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (image instanceof File) {
      data.append("image", image);
    }
    data.append("categoryId", formData.categoryId.toString());
    data.append("postedDate", formData.postedDate);
    data.append("expiredDate", formData.expiredDate);

    console.log(data);

    await apiClient.put(`${ApiService.carousels}/${id}`, data);
    showModal({
      title: "Carousel Updated",
      message: `Carousel\n${formData.title}\nSuccessfully Updated!`,
      options: {
        buttonTitle: "Continue",
        variant: "success",
        onOk: () => {
          navigate("/carousel/manager");
        },
      },
    });
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
      setImage(e.target.files[0]);
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
          EDIT CAROUSEL - BINUS
        </Typography>
        <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              name="title"
              type="text"
              placeholder="Enter carousel title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="image">Image</Label>
            <Input
              name="image"
              type="file"
              onChange={handleFileChange}
              style={{
                width: "100%",
                border: "1px solid lightgrey",
                padding: "10px",
                borderRadius: "3px",
              }}
            />
            {prevImage && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: "1rem",
                }}
              >
                <img src={prevImage} style={{ maxWidth: "35%" }} />
              </Box>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              name="description"
              type="textarea"
              placeholder="Enter carousel description"
              value={formData.description}
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
                name="postedDate"
                type="date"
                value={formData.postedDate}
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="expiredDate">Expired Date</Label>
              <Input
                name="expiredDate"
                type="date"
                value={formData.expiredDate}
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
          </Stack>

          <FormGroup>
            <Label for="categoryId">Carousel Category</Label>
            <Input
              name="categoryId"
              type="select"
              value={formData.categoryId}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Form>
        <MuiButton
          color="primary"
          variant="outlined"
          onClick={handleUpdateCarousel}
          sx={{ alignSelf: "flex-end", my: 4 }}
        >
          Update
        </MuiButton>
      </Stack>
    </Paper>
  );
}
