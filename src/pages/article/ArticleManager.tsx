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
  styled,
  tableCellClasses,
  Button,
  Link,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import { IArticle } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { blue, grey } from "@mui/material/colors";
import { fontSize, fontWeight } from "@mui/system";

export default function ArticleManager() {
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

  const handleEdit = (articleId: string | number) => {
    navigate(`/edit-article/${articleId}`);
  };

  const handleDelete = async (articleId: string | number) => {
    try {
      await apiClient.delete(`${ApiService.getArticles}/${articleId}`);
      getArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: 700,
      fontSize: 15,
      color: grey[700],
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    },
  }));

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead
          sx={{
            bgcolor: grey[200],
          }}
        >
          <TableRow>
            <StyledTableCell align="right">NO.</StyledTableCell>
            <StyledTableCell align="right">ARTICLE NAME</StyledTableCell>
            <StyledTableCell align="right">ARTICLE CATEGORY</StyledTableCell>
            <StyledTableCell align="right">POSTED BY</StyledTableCell>
            <StyledTableCell align="right">DATE POSTED</StyledTableCell>
            <StyledTableCell align="right">EDITED BY</StyledTableCell>
            <StyledTableCell align="right">LAST EDITED</StyledTableCell>
            <StyledTableCell align="right">TOTAL VIEWS</StyledTableCell>
            <StyledTableCell align="right">STATUS</StyledTableCell>
            <StyledTableCell align="right">ACTION</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow key={article.id}>
              <TableCell component="th" scope="article">
                {index + 1}
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="body1"
                  color={blue[400]}
                  component={Link}
                  href={`/article/${article.id}`}
                >
                  {article.title}
                </Typography>
              </TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">
                <Stack direction="row">
                  <Button
                    endIcon={<EditNoteIcon />}
                    sx={{
                      width: 3,
                      borderRadius: 0,
                      pl: 1,
                      color: "#2196f3",
                      border: "1px solid #2196f3",
                    }}
                    onClick={() => handleEdit(article.id)}
                  />
                  <Button
                    color="error"
                    variant="outlined"
                    endIcon={<DeleteIcon />}
                    sx={{
                      width: 3,
                      borderRadius: 0,
                      pl: 1,
                      color: "#e53935",
                      border: "1px solid #e53935",
                    }}
                    onClick={() => handleDelete(article.id)}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={10} align="center">
              <Link href="/add-article">ADD ARTICLE</Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
