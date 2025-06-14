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
import PageWrapper from "../container/PageWrapper";
import { IArticle } from "../../pages/landing-page/interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import { AxiosResponse } from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ArticleCard() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  let displayArticles = articles;

  if (location.pathname.includes("/article")) {
    displayArticles = articles.slice(0, 3);
  }

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
      `${ApiService.articles}`
    );
    const filteredArticles = response.data.filter(
      (article: IArticle) => getStatus(article) === "Published"
    );
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
                  src={`${ApiService.URL}${article.image}`}
                  style={{ maxHeight: "120px", width: "100%" }}
                />
                <PageWrapper>
                  <Typography variant="body1" gutterBottom>
                    {article.title}
                  </Typography>
                </PageWrapper>
              </Paper>
            ))}
          </Stack>
          <Link
            href="/articles"
            sx={{ mb: 5, textAlign: "center" }}
            style={
              location.pathname.includes("/articles") ? { display: "none" } : {}
            }
          >
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

export function ArticleRec() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const displayArticles = articles.slice(0, 4);

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
      `${ApiService.articles}`
    );
    const filteredArticles = response.data.filter(
      (article: IArticle) =>
        getStatus(article) === "Published" &&
        article.id !== Number(location.pathname.split("/").pop())
    );
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
          sx={{ flexWrap: "wrap", mt: 3 }}
          justifyContent="center"
        >
          {displayArticles.map((article) => (
            <Paper
              key={article.id}
              elevation={2}
              sx={{
                width: {
                  sm: "15vw",
                },
                minHeight: "200px",
                maxHeight: "250px",
              }}
              style={{
                cursor: "pointer",
              }}
              onClick={() => handleClick(article.id)}
            >
              <img
                src={`${ApiService.URL}${article.image}`}
                style={{ maxHeight: "120px", width: "100%" }}
              />
              <PageWrapper>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "70%"
                  }}
                  gutterBottom
                >
                  {article.title}
                </Typography>
              </PageWrapper>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography
          variant="body1"
          color="primary"
          sx={{
            textAlign: "center",
            mt: 5,
          }}
        >
          No More Available Article
        </Typography>
      )}
    </Box>
  );
}
