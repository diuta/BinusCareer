import { Link, Paper, Stack, Table, Typography } from "@mui/material";
import CarouselView from "./component/Carousel";
import ArticleCard from "../../components/common/ArticleCard";
import { Box } from "@mui/system";

export default function LandingPagePrivate() {
  return (
    <Stack
      spacing={{ xs: 3, sm: 4 }}
      direction="column"
      justifyContent="center"
    >
      <Box>
        <CarouselView />
      </Box>
      <Typography variant="h3" sx={{textAlign: "center"}}>
        ARTICLES
      </Typography>
      <Box>
        <ArticleCard />
      </Box>
    </Stack>
  );
}
