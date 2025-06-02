import { Paper, Typography, Button, Stack, Box } from "@mui/material";
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
    title: "",
    content: "",
    categoryId: 0,
    updatedBy: "",
    postedDate: "",
    expiredDate: "",
  });
  const [prevImage, setPrevImage] = useState("");
  const [image, setImage] = useState<File>();

  useEffect(() => {
    fetchArticleData();
    fetchCategories();
  }, [id]);

  const fetchArticleData = async () => {
    const response = await apiClient.get(`${ApiService.articles}/${id}`);
    const articleData = response.data;
    console.log(articleData);

    setFormData({
      title: articleData.title || "",
      content: articleData.content || "",
      postedDate: articleData.postedDate.split("T")[0],
      expiredDate: articleData.expiredDate.split("T")[0],
      categoryId: articleData.categoryId,
      updatedBy: user?.name,
    });

    setPrevImage(`${ApiService.URL}${articleData.image}`)
  };

  const fetchCategories = async () => {
    const response = await axios.get(ApiService.categories);
    setCategories(response.data);
  };

  const handleUpdateArticle = async () => {
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
    data.append("title", formData.title);
    data.append("content", formData.content);
        if (image instanceof File) {
      data.append("image", image);
    }
    data.append("categoryId", formData.categoryId.toString());
    data.append("updatedBy", formData.updatedBy);
    data.append("postedDate", formData.postedDate);
    data.append("expiredDate", formData.expiredDate);

    try{
      await apiClient.put(`${ApiService.articles}/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      showModal({
        title: "Article Updated",
        message: `Article\n${formData.title}\nSuccessfully Updated!`,
        options: {
          buttonTitle: "Continue",
          variant: "success",
          onOk: () => {
            navigate("/article/manager");
          },
        },
      });
    } catch (error){
      if(axios.isAxiosError(error)){
        showModal({
          title: "Article Failed To Update",
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
      setImage(e.target.files[0]);
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
              type="file"
              placeholder="Enter article image"
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
              onChange={handleCategoryChange}
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
