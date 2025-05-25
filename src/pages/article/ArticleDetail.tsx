import { Paper, Typography, Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import { IArticle } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import { AxiosResponse } from "axios";
import apiClient from "../../config/api-client";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/auth/selector";

export default function ArticleDetail() {
  const [article, setArticle] = useState<IArticle>();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const isLoggedIn = !!user;
  const publicPath = "/article";
  const hasFetched = useRef(false); // ini biar fetchnya ga multiple
  const imageUrl = article?.image ? `${ApiService.URL}${article.image}` : "";

  useEffect(() => {
    if (!hasFetched.current) {
      fetchArticle();
      hasFetched.current = true;
    }
  }, [id]);

  const fetchArticle = async () => {
    const url = location.pathname.startsWith(publicPath)
      ? `${ApiService.articles}/${id}`
      : `${ApiService.articles}/${id}?count=false`;
    const response = await apiClient.get(url);
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
          src={imageUrl}
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
