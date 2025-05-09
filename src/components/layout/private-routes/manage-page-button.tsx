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

export default function ManageButton() {
  return (
    <Stack
      spacing={3}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Button
        color="primary"
        variant="contained"
        sx={{
          borderRadius: 2,
          textTransform: "none",
          width: "90%",
        }}
        component={Link}
        href="/addCarousel"
      >
        Carousel Manager
      </Button>

      <Button
        color="primary"
        variant="contained"
        sx={{
          borderRadius: 2,
          textTransform: "none",
          width: "90%",
        }}
        component={Link}
        href="/addArticle"
      >
        Article Manager
      </Button>
    </Stack>
  );
}
