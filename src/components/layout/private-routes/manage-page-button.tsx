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
        href="/article-manager"
      >
        Article Manager
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
        href="/carousel-manager"
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
        href="/category-manager"
      >
        Category Manager
      </Button>
    </Stack>
  );
}
