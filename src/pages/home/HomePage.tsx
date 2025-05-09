import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  Typography,
  Fade,
  Container,
} from "@mui/material";
import ManageButton from "../../components/layout/private-routes/manage-page-button";

export default function HomePage() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: {
            xs: "90vw",
            sm: "50vw",
            md: "35vw",
          },
          padding: 4,
        }}
      >
        <ManageButton />
      </Paper>
    </Container>
  );
}
