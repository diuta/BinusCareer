import { Paper, Typography } from "@mui/material";
import { title } from "process";
import React, { useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import axios from "axios";
import useModal from "../../hooks/use-modal";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../constants/ApiService.Dev";
import PageWrapper from "../../components/container/PageWrapper";

export default function AddArticle() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const handleClick = async () => {
    await axios.post(ApiService.addArticle, formData);
    showModal({
      title: "Article Added",
      message: `Article\n${formData.title}\nSuccessfully Added!`,
      options: {
        buttonTitle: "Continue",
        variant: "success",
        onOk: () => {
          navigate("/article");
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
            <Typography variant="h3" className="text-center mb-4 mt-3">
              Add Article
            </Typography>
            <Form>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter article title"
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
                  onChange={handleInputChange}
                />
                <img
                  className="mt-3 w-100 h-40"
                  src={formData.image}
                  style={{
                    display: formData.image.length === 0 ? "none" : "block",
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="content">Content</Label>
                <Input
                  id="content"
                  name="content"
                  type="textarea"
                  placeholder="Enter article content"
                  onChange={handleInputChange}
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

