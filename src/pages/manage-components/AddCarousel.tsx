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
import { useNavigate } from "react-router-dom";
import useModal from "../../hooks/use-modal";

export default function AddCarousel() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
  });

  const handleClick = async () => {
    await axios.post(ApiService.addCarousel, formData);
    showModal({
      title: "Carousel Added",
      message: `Carousel Successfully Added!`,
      options: {
        buttonTitle: "Continue",
        variant: "success",
        onOk: () => {
          navigate("/");
        },
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <PageWrapper>
        <Row className="justify-content-center">
          <Col md="6">
            <Typography variant="h3" className="text-center mb-4">
              Add Carousel
            </Typography>
            <Form>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your Title"
                />
              </FormGroup>

              <FormGroup>
                <Label for="image">ImageUrl</Label>
                <Input
                  id="image"
                  name="image"
                  type="text"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter your Image Url"
                />
                <img
                  className="mt-3 w-100 h-40"
                  id="img"
                  src={formData.image}
                  style={{
                    display: formData.image.length === 0 ? "none" : "block",
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  description
                  type="textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter your Description"
                  style={{ height: 200 }}
                />
              </FormGroup>

              <Button color="primary" block onClick={handleClick}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </PageWrapper>
    </Paper>
  );
}
