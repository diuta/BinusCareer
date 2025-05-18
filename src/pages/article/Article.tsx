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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import { IArticle } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import { AxiosResponse } from "axios";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/auth/selector";

export default function Article() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const isLoggedIn = !!user;
  const publicPath = "/article";

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.getArticles}`
    );
    const filteredArticles = response.data.filter(
      (article: IArticle) => getStatus(article) === "Published"
    );
    setArticles(filteredArticles);
  };

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

  if (isLoggedIn && location.pathname.startsWith(publicPath)) {
    return (
      <Navigate to="/protected/article/" state={{ from: location }} replace />
    );
  }

  const handleClick = (id: number) => {
    navigate(`/article/${id}`);
  };

  return (
    <Box sx={{ padding: 5}}>
      <Typography
        variant="h3"
        className="text-center"
        sx={{ mb: 10, color: "#2196f3" }}
      >
        ARTICLES
      </Typography>
      <Stack
        className="justify-content-center mb-5"
        spacing={{ xs: 3, sm: 4 }}
        direction="row"
        useFlexGap
        sx={{ flexWrap: "wrap" }}
      >
        {articles.map((article) => (
          <Paper
            key={article.id}
            elevation={2}
            sx={{
              width: {
                xs: "80vw",
                sm: "40vw",
                md: "25vw",
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
              style={{ maxHeight: "150px" }}
            />
            <PageWrapper>
              <Typography variant="body1" gutterBottom>
                {article.title}
              </Typography>
            </PageWrapper>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
