import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Button as MuiButton,
} from "@mui/material";
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
import { IArticle } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useModal from "../../hooks/use-modal";

export default function EditCarousel() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    description: "",
    image: "",
    startDate: "",
    endDate: "",
    category: "",
  });

  useEffect(() => {
    if (id) {
      fetchCarouselData();
    }
  }, [id]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const fetchCarouselData = async () => {
    const response = await apiClient.get(`${ApiService.getCarousel}/${id}`);
    const carouselData = response.data;

    setFormData({
      id: carouselData.id,
      title: carouselData.title || "",
      description: carouselData.description || "",
      image: carouselData.image || "",
      startDate: carouselData.startDate || "",
      endDate: carouselData.endDate || "",
      category: carouselData.category || "",
    });
  };

  const handleUpdateCarousel = async () => {
    await apiClient.put(`${ApiService.getCarousel}/${id}`, formData);
    showModal({
      title: "Carousel Updated",
      message: `Carousel\n${formData.title}\nSuccessfully Updated!`,
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
            <Label for="image">ImageUrl</Label>
            <Input
              name="image"
              type="text"
              placeholder="Enter carousel image URL"
              value={formData.image}
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
              <Label for="startDate">Start Date</Label>
              <Input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
          </Stack>

          <FormGroup>
            <Label for="category">Carousel Category</Label>
            <Input
              name="category"
              type="select"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="home">Home</option>
              <option value="events">Events</option>
              <option value="news">News</option>
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
