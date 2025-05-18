import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Link,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageWrapper from "../../../components/container/PageWrapper";
import { IArticle } from "../interface/Interface";
import { ApiService } from "../../../constants/ApiService.Dev";
import apiClient from "../../../config/api-client";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { Col } from "reactstrap";

export default function ArticleCard() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const navigate = useNavigate();
  const displayArticles = articles.slice(0, 3);

  useEffect(() => {
    getArticles();
  }, []);

  const getStatus = (article: IArticle) => {
    const currentDate = new Date();
    const postedDate = new Date(article.postedDate);
    const expiredDate = new Date(article.expiredDate);
    if (expiredDate < currentDate) {
      return "Expired";
    }
    if (postedDate > currentDate) {
      return "Pending";
    }
    return "Published";
  };

  const getArticles = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.getArticles}`
    );
    const filteredArticles = response.data.filter((article: IArticle) => getStatus(article) === "Published");
    setArticles(filteredArticles);
  };

  const handleClick = (id: number) => {
    navigate(`/article/${id}`);
  };

  return (
    <Box>
      {articles.length > 0 ? (
        <Stack
          spacing={{ xs: 3, sm: 4 }}
          direction="column"
          useFlexGap
          sx={{ flexWrap: "wrap" }}
          justifyContent="center"
        >
          <Stack
            spacing={{ xs: 3, sm: 4 }}
            direction="row"
            useFlexGap
            sx={{ flexWrap: "wrap" }}
            justifyContent="center"
          >
            {displayArticles.map((article) => (
              <Paper
                key={article.id}
                elevation={2}
                sx={{
                  width: {
                    xs: "80vw",
                    sm: "40vw",
                    md: "20vw",
                  },
                }}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => handleClick(article.id)}
              >
                <img
                  className="w-100 d-block"
                  src={article.image}
                  style={{ maxHeight: "120px" }}
                />
                <PageWrapper>
                  <Typography variant="body1" gutterBottom>
                    {article.title}
                  </Typography>
                </PageWrapper>
              </Paper>
            ))}
          </Stack>
            <Link href="/article" className="text-center mb-5">
              View All
            </Link>
        </Stack>
      ) : (
        <Typography
          variant="h4"
          color="primary"
          sx={{
            textAlign: "center",
          }}
        >
          No Articles Available
        </Typography>
      )}
    </Box>
  );
}
