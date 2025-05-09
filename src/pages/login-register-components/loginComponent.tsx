import { Paper, TextField, Typography, CircularProgress } from "@mui/material";
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
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuthenticate } from "../../api/identity";
import { setAuthToken } from "../../store/authToken/slice";
import { AuthenticateRequest } from "../../types/identity";
import useModal from "../../hooks/use-modal";
import PageWrapper from "../../components/container/PageWrapper";
import { setProfile } from "../../store/profile/slice";
import { setAuth } from "../../store/auth/slice";

export default function LoginComponent() {
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
        // Store the JWT token in Redux
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
            binusianId: "",
            fullName: response.username,
            position: "",
            email: response.email,
            currentRole: "User",
            currentRoleDetailId: "",
            rolePermissions: [], // IMPORTANT: Initialize with empty array
            organizationRoles: [
              {
                roleId: "user",
                roleName: "User",
                roleDesc: "Regular user",
              },
            ], // Default roles
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
          message: error.response?.data?.message,
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
            <h1 className="text-center mb-4">Login</h1>
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

              <div className="text-center mt-3">
                <a href="/register">Don&apos;t have an account? Register</a>
              </div>
            </Form>
          </Col>
        </Row>
      </PageWrapper>
    </Paper>
  );
}
