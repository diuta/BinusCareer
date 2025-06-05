import { Paper, Typography, Box, Grid, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import { IArticle } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import { AxiosResponse } from "axios";
import apiClient from "../../config/api-client";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/auth/selector";
import { ArticleRec } from "../../components/common/ArticleCard";

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
    <Grid container columns={5} mb="1vh">
      <Grid item lg={4} sm={5} sx={{ borderRight: "1px solid lightgrey" }}>
        <PageWrapper>
          <Stack
            direction="column"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                my: 4,
                color: "dimgrey",
                width: "80%",
                alignSelf: "center",
              }}
            >
              {article?.title}
            </Typography>
            <img src={imageUrl} style={{ width: "60%", alignSelf: "center" }} />
            <Box
              sx={{
                maxWidth: "100%",
                overflow: "hidden",
                textAlign: "justify",
                my: 4,
                color: "dimgrey",
                width: "80%",
                alignSelf: "center",
              }}
              dangerouslySetInnerHTML={{ __html: article?.content || "" }}
            />
          </Stack>
        </PageWrapper>
      </Grid>
      <Grid item lg={1} sx={{ display: { xs: "none", lg: "block" } }}>
        <PageWrapper>
          <Stack
            direction="column"
            sx={{
              display: "flex",
              alignContent: "center",
              minHeight: "100%",
            }}
          >
            <Typography variant="h5" color="dimgrey">
              Recent Articles
            </Typography>
            <ArticleRec />
          </Stack>
        </PageWrapper>
      </Grid>
    </Grid>
  );
}
