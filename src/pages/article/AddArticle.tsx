import { Paper, Typography, Button } from "@mui/material";
import { title } from "process";
import React, { useEffect, useState } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import axios from "axios";
import useModal from "../../hooks/use-modal";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../constants/ApiService.Dev";
import PageWrapper from "../../components/container/PageWrapper";
import JoditComponent from "./component/JoditComponent";
import { Stack } from "@mui/system";

export default function AddArticle() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleClick = async () => {
    await axios.post(ApiService.addArticle, formData);
    showModal({
      title: "Article Added",
      message: `Article\n${formData.title}\nSuccessfully Added!`,
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
          ADD ARTICLE - BINUS
        </Typography>
        <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              name="title"
              type="text"
              placeholder="Enter article title"
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="image">ImageUrl</Label>
            <Input
              name="image"
              type="text"
              placeholder="Enter article image"
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
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="expiredDate">Expired Date</Label>
              <Input
                type="date"
                onChange={handleInputChange}
                style={{ width: "35vw" }}
              />
            </FormGroup>
          </Stack>

          <FormGroup>
            <Label for="category">Article Category</Label>
            <Input
              type="select"
              placeholder="Enter article category"
              onChange={handleInputChange}
            >
              <option value="news">News</option>
              <option value="event">Event</option>
              <option value="announcement">Announcement</option>
            </Input>
          </FormGroup>
        </Form>
        <Button
          color="primary"
          variant="outlined"
          onClick={handleClick}
          sx={{ alignSelf: "flex-end", my: 4 }}
        >
          Submit
        </Button>
      </Stack>
    </Paper>
  );
}
