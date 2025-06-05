import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Stack,
  Link,
} from "@mui/material";
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
import PageWrapper from "../components/container/PageWrapper";
import { ApiService } from "../constants/ApiService";
import { useNavigate } from "react-router-dom";
import useModal from "../hooks/use-modal";
import SEO from "../components/common/seo";

export function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    hashedPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showModal } = useModal();

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
    } catch (error: any) {
      showModal({
        title: "Registration Failed",
        message: error.response?.data,
        options: {
          variant: "failed",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <SEO />
      <Container maxWidth={false} disableGutters>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
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
            <Stack direction="row" sx={{justifyContent: "center"}}>
              <Stack direction="column">
                <Typography variant="h3" sx={{textAlign: "center", mb: 4}}>Register</Typography>
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
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        disabled={isLoading}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="hashedPassword">Password</Label>
                      <Input
                        id="hashedPassword"
                        name="hashedPassword"
                        type="password"
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

                    <Link href="/login" sx={{textAlign: "center", mt: 2, display: "block", color: "#2196f3", textDecoration: "none"}}>
                      Already have an account? Login
                    </Link>
                  </Form>
                </Stack>
              </Stack>
            </PageWrapper>
          </Paper>
        </Box>
        {/* <OverlayModalLogin modalLogin={modalLogin} setModalLogin={setModalLogin} />
        <CardModalLogin modalLogin={modalLogin} setModalLogin={setModalLogin} /> */}
      </Container>
    </>
  );
}
