import { Paper, Typography, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import axios from "axios";
import useModal from "../../hooks/use-modal";
import { useNavigate, useParams } from "react-router-dom";
import { ApiService } from "../../constants/ApiService.Dev";
import PageWrapper from "../../components/container/PageWrapper";
import JoditComponent from "./component/JoditComponent";
import { Stack } from "@mui/system";
import apiClient from "../../config/api-client";

export default function EditArticle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showModal } = useModal();
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    if (id) {
      fetchArticleData();
    }
  }, [id]);

  const fetchArticleData = async () => {
    const response = await apiClient.get(`${ApiService.getArticle}/${id}`);
    const articleData = response.data;

    setFormData({
      id: articleData.id,
      title: articleData.title || "",
      content: articleData.content || "",
      image: articleData.image || "",
    });
  };

  const handleUpdateArticle = async () => {
    await apiClient.put(`${ApiService.getArticle}/${id}`, formData);
    showModal({
      title: "Article Updated",
      message: `Article\n${formData.title}\nSuccessfully Updated!`,
      options: {
        buttonTitle: "Continue",
        variant: "success",
        onOk: () => {
          navigate("/article-manager");
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
    console.log("Input changed:", name, value);
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
      <Stack sx={{ width: "90%", padding: 2 }} spacing={2} component={Row}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            my: 4,
          }}
          color="#2196f3"
        >
          EDIT ARTICLE - BINUS
        </Typography>
        <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter article title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="image">ImageUrl</Label>
            <Input
              id="image"
              name="image"
              type="text"
              placeholder="Enter article image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="content">Content</Label>
            <JoditComponent
              name="content"
              value={formData.content}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Form>
        <Button
          color="primary"
          variant="outlined"
          onClick={handleUpdateArticle}
          sx={{ alignSelf: "flex-end", my: 4 }}
        >
          Update
        </Button>
      </Stack>
    </Paper>
  );
}
