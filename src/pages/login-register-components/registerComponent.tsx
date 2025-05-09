import { Paper, TextField, Typography, CircularProgress } from "@mui/material";
import React, { useState } from "react";
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
import axios from "axios";
import PageWrapper from "../../components/container/PageWrapper";
import { ApiService } from "../../constants/ApiService";
import { useNavigate } from "react-router-dom";
import useModal from "../../hooks/use-modal";

export default function RegisterComponent() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    hashedPassword: "", // Using hashedPassword to match the backend model
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name === "password" ? "hashedPassword" : name; // Map password field to hashedPassword

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      await axios.post(ApiService.register, formData);

      showModal({
        title: "Registration Successful",
        message: "Your account has been created. You can now log in.",
        options: {
          variant: "success",
          onOk: () => {
            navigate("/login");
          },
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        let errorMessage = "An error occurred during registration";

        if (error.response?.status === 409) {
          errorMessage =
            error.response.data || "Username or email already exists";
        } else if (error.response?.data) {
          errorMessage = error.response.data;
        }

        showModal({
          title: "Registration Failed",
          message: errorMessage,
          options: {
            variant: "failed",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: {
          xs: "100%",
          md: "50%",
          xl: "40%",
        },
      }}
    >
      <PageWrapper>
        <Row className="justify-content-center">
          <Col md="6">
            <h1 className="text-center mb-4">Register</h1>
            <Form>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </FormGroup>

              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  // We're using password for the input name, but mapping to hashedPassword in the state
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </FormGroup>

              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  // We're using password for the input name, but mapping to hashedPassword in the state
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </FormGroup>

              <Button
                color="primary"
                block
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>

              <div className="text-center mt-3">
                <a href="/login">Already have an account? Login</a>
              </div>
            </Form>
          </Col>
        </Row>
      </PageWrapper>
    </Paper>
  );
}
