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
import ArticleCard from "../../components/common/ArticleCard";

export default function Article() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const isLoggedIn = !!user;
  const publicPath = "/articles";

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.articles}`
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
      <Navigate to="/protected/articles" state={{ from: location }} replace />
    );
  }

  const handleClick = (id: number) => {
    navigate(`/article/${id}`);
  };

  return (
    <PageWrapper>
      <ArticleCard/>
    </PageWrapper>
  );
}
