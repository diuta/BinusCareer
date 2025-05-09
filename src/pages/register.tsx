/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Container, Tab, Tabs } from "@mui/material";
import SEO from "../components/common/seo";
import RegisterComponent from "./login-register-components/registerComponent";

export function Register() {
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
          <RegisterComponent />
        </Box>
        {/* <OverlayModalLogin modalLogin={modalLogin} setModalLogin={setModalLogin} />
        <CardModalLogin modalLogin={modalLogin} setModalLogin={setModalLogin} /> */}
      </Container>
    </>
  );
}
