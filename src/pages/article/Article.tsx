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
import { useNavigate } from "react-router-dom";

export default function Article() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.getArticles}`
    );
    setArticles(response.data);
  };

  const handleClick = (id: number) => {
    navigate(`/article/${id}`);
  };
  
  const handleAddArticle = () => {
    navigate('/addArticle');
  }

  return (
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
      <Paper
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
        onClick={() => handleAddArticle()}
      >
        <img
          className="w-100 d-block"
          src="https://www.shutterstock.com/shutterstock/videos/3569801719/thumb/7.jpg?ip=x480"
          style={{ maxHeight: "150px" }}
        />
        <PageWrapper>
          <Typography variant="body1" gutterBottom>
            Add New Article
          </Typography>
        </PageWrapper>
      </Paper>
    </Stack>
  );
}
