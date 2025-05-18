import {
  Box,
  Link,
  Paper,
  Stack,
  Table,
  Typography,
} from "@mui/material";
import CarouselView from "./component/Carousel";
import ArticleCard from "./component/ArticleCard";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/auth/selector";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LandingPagePublic() {
  const user = useSelector(selectAuthUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

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
