import {
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import { IArticle } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import { AxiosResponse } from "axios";
import apiClient from "../../config/api-client";
import { useParams } from "react-router-dom";

export default function ArticleDetail() {
  const [article, setArticle] = useState<IArticle | undefined>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getArticleDetail();
  }, [id]);

  const getArticleDetail = async () => {
    const response: AxiosResponse = await apiClient.get(`${ApiService.getArticleDetail.replace("{id}", id!)}`);
    setArticle(response.data);
  };

  return (
    <Paper elevation={5}>
      <PageWrapper>
        <Typography
          className="text-center mb-4 mt-3 text-secondary align-self-center justify-content-center w-50" 
          variant="h4"
        >
          {article?.title}
        </Typography>
        <img
          className="w-60 align-self-center"
          src={article?.image}
          alt={article?.title}  
        />
        <Typography
          className="w-50 align-self-center text-justify mt-5 mb-5 text-secondary" 
          variant="body1"
          style={{
            whiteSpace: "pre-line",
            wordWrap: "break-word",
            maxWidth: "100%",     
            overflow: "hidden"   
          }}
        >
          {article?.content}
        </Typography>
      </PageWrapper>
    </Paper>
  );
}