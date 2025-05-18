import { Paper, Typography, Button, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import useModal from "../../hooks/use-modal";
import { useNavigate, useParams } from "react-router-dom";
import { ApiService } from "../../constants/ApiService.Dev";
import JoditComponent from "./component/JoditComponent";
import apiClient from "../../config/api-client";
import { ICategory } from "./interface/Interface";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/auth/selector";

export default function EditArticle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showModal } = useModal();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const user = useSelector(selectAuthUser);
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    content: "",
    image: "",
    categoryId: 0,
    publishedBy: "",
    updatedBy: "",
    postedDate: "",
    expiredDate: "",
  });

  useEffect(() => {
    fetchArticleData();
    fetchCategories();
  }, [id]);

  const fetchArticleData = async () => {
    const response = await apiClient.get(`${ApiService.getArticle}/${id}`);
    const articleData = response.data;
    console.log(articleData);

    setFormData({
      id: articleData.id,
      title: articleData.title || "",
      content: articleData.content || "",
      image: articleData.image || "",
      postedDate: articleData.postedDate.split("T")[0],
      expiredDate: articleData.expiredDate.split("T")[0],
      categoryId: articleData.categoryId,
      publishedBy: articleData.publishedBy || "",
      updatedBy: user?.name,
    });
  };

  const fetchCategories = async () => {
    const response = await axios.get(ApiService.getCategories);
    setCategories(response.data);
  };

  const handleUpdateArticle = async () => {
    await apiClient.put(`${ApiService.editArticle}/${id}`, formData);
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
          EDIT ARTICLE - BINUS
        </Typography>
        <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
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
                value={formData.postedDate}
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="expiredDate">Expired Date</Label>
              <Input
                type="date"
                name="expiredDate"
                value={formData.expiredDate}
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
          </Stack>

          <FormGroup>
            <Label for="categoryId">Article Category</Label>
            <Input
              type="select"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleIdChange}
            >
              {categories.map((category) => (
                <option value={category.id}>{category.name}</option>
              ))}
            </Input>
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
