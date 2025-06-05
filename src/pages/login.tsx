import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Link,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuthenticate } from "../api/identity";
import { setAuthToken } from "../store/authToken/slice";
import { AuthenticateRequest } from "../types/identity";
import useModal from "../hooks/use-modal";
import PageWrapper from "../components/container/PageWrapper";
import { setProfile } from "../store/profile/slice";
import { setAuth } from "../store/auth/slice";
import { useDispatch } from "react-redux";
import SEO from "../components/common/seo";
import { Stack } from "@mui/system";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showModal } = useModal();

  const [formData, setFormData] = useState<AuthenticateRequest>({
    username: "",
    password: "",
  });

  const { mutate: authenticate, isLoading: isAuthenticating } = useAuthenticate(
    {
      onSuccess: async (response) => {
        dispatch(setAuthToken(response.jwtToken));

        dispatch(
          setAuth({
            token: response.jwtToken,
            name: response.username,
            id: response.id.toString(),
            avatar: "",
          })
        );
        dispatch(
          setProfile({
            userId: response.id.toString(),
            fullName: response.username,
            email: response.email,
            rolePermissions: [],
          })
        );

        showModal({
          title: "Login Successful",
          message: `Welcome, ${response.username}!`,
          options: {
            buttonTitle: "Dashboard",
            variant: "success",
            onOk: () => {
              navigate("/home");
            },
          },
        });
      },
      onError: (error: any) => {
        showModal({
          title: "Login Failed",
          message: error.response?.data,
          options: {
            variant: "failed",
          },
        });
      },
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    authenticate(formData);
  };

  return (
    <>
      <SEO />
      <Container disableGutters>
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
                md: "50%"
              },
            }}
          >
            <PageWrapper>
              <Stack direction="row" sx={{justifyContent: "center"}}>
                <Stack direction="column">
                  <Typography variant="h3" sx={{textAlign: "center", mb: 4}}>Login</Typography>
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
                        disabled={isAuthenticating}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        disabled={isAuthenticating}
                      />
                    </FormGroup>

                    <Button
                      color="primary"
                      block
                      onClick={handleLogin}
                      disabled={isAuthenticating}
                    >
                      {isAuthenticating ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <Link href="/register" sx={{textAlign: "center", mt: 2, display: "block", color: "#2196f3", textDecoration: "none"}}>
                      Don&apos;t have an account? Register
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
