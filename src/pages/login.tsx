/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Container, Tab, Tabs } from "@mui/material";
import SEO from "../components/common/seo";
import { LoginContent } from "../components/container/login";
import LoginComponent from "./login-register-components/loginComponent";
// import { OverlayModalLogin } from 'components/layout/overlay';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/auth/selector";

export function Login() {
  const auth = useSelector(selectAuth);

  // useEffect(() => {
  //   if (auth.user) window.location.href = "/";
  // }, [auth]);

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
          <LoginComponent />
        </Box>
        {/* <OverlayModalLogin modalLogin={modalLogin} setModalLogin={setModalLogin} />
        <CardModalLogin modalLogin={modalLogin} setModalLogin={setModalLogin} /> */}
      </Container>
    </>
  );
}
