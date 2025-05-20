import { Paper, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import { IArticle } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import { AxiosResponse } from "axios";
import apiClient from "../../config/api-client";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/auth/selector";

export default function ArticleDetail() {
  const [article, setArticle] = useState<IArticle | undefined>();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const isLoggedIn = !!user;
  const publicPath = "/article";

  useEffect(() => {
    getArticleDetail();
  }, [id]);

  const getArticleDetail = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.getArticle}/${id}`
    );
    setArticle(response.data);
  };

  if (isLoggedIn && location.pathname.startsWith(publicPath)) {
    return (
      <Navigate
        to={`/protected/article/${id}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return (
    <Paper
      elevation={5}
      sx={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <PageWrapper>
        <Typography
          className="text-center mb-4 mt-3 text-secondary align-self-center justify-content-center w-75"
          variant="h4"
        >
          {article?.title}
        </Typography>
        <img
          className="w-60 align-self-center"
          src={article?.image}
          alt={article?.title}
        />
        <Box
          className="w-75 align-self-center mt-5 mb-5 text-secondary"
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: article?.content || "" }}
        />
      </PageWrapper>
    </Paper>
  );
}
