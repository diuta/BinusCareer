import {
  Box,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CarouselView from "./component/Carousel";
import ArticleCard from "./component/ArticleCardPublic";

export default function LandingPage() {
  return (
    <Stack
      spacing={{ xs: 3, sm: 4 }}
      direction="column"
      justifyContent="center"
    >
      <Box sx={{ width: "100vw" }}>
        <CarouselView />
      </Box>
      <Typography variant="h3" className="text-center">
        ARTICLES
      </Typography>
      <Box>
        <ArticleCard />
      </Box>
    </Stack>
  );
}
