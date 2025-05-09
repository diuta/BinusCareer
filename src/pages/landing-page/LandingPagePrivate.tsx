import {
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
import ArticleCard from "./component/ArticleCardPrivate";
import { Box } from "@mui/system";

export default function LandingPage2() {
  return (
    <Stack
      spacing={{ xs: 3, sm: 4 }}
      direction="column"
      justifyContent="center"
    >
      <Box>
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
