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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { IArticle, ICategory } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { blue, grey } from "@mui/material/colors";

export default function ArticleManager() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySelected, setCategorySelected] = useState("All");
  const [statusSelected, setStatusSelected] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    getArticles();
    getCategories();
  }, []);

  useEffect(() => {
    let result = [...articles];

    if (searchTerm.trim() !== "") {
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categories
            .find((category) => category.id === article.categoryId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          article.publishedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categorySelected && categorySelected !== "All") {
      result = result.filter((article) =>
        categories
          .find((category) => category.id === article.categoryId)
          ?.name.toLowerCase()
          .includes(categorySelected.toLowerCase())
      );
    }

    if (statusSelected && statusSelected !== "All") {
      result = result.filter((article) =>
        getStatus(article).toLowerCase().includes(statusSelected.toLowerCase())
      );
    }

    setFilteredArticles(result);
  }, [articles, searchTerm, categorySelected, statusSelected]);

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
    setArticles(response.data);
    setFilteredArticles(response.data);
  };

  const getCategories = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.getCategories}`
    );
    setCategories(response.data);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: any) => {
    setCategorySelected(event.target.value);
  };

  const handleStatusChange = (event: any) => {
    setStatusSelected(event.target.value);
  };

  return (
    <Paper elevation={5} sx={{ padding: 5 }}>
      <Typography
        variant="h3"
        className="text-center"
        sx={{ mb: 3, color: "#2196f3" }}
      >
        ARTICLE LIST
      </Typography>
      <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
        <InputLabel id="search-label">Search</InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
        />
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <InputLabel id="category-select-label">Category Type</InputLabel>
            <Select
              id="category-select"
              value={categorySelected}
              onChange={handleCategoryChange}
              fullWidth
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((category) => (
                <MenuItem value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              id="status-select"
              value={statusSelected}
              onChange={handleStatusChange}
              fullWidth
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Published">Published</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </Box>
        </Stack>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: "20vh",
            }}
            component={Link}
            href="/add-article"
          >
            Add Article
          </Button>
        </Box>
      </Stack>

      <TableContainer component={Paper} elevation={0}>
        <Table aria-label="simple table">
          <TableHead
            sx={{
              bgcolor: grey[300],
            }}
          >
            <TableRow>
              <TableCell align="center">NO.</TableCell>
              <TableCell align="center">ARTICLE NAME</TableCell>
              <TableCell align="center">ARTICLE CATEGORY</TableCell>
              <TableCell align="center">PUBLISHED BY</TableCell>
              <TableCell align="center">DATE PUBLISHED</TableCell>
              <TableCell align="center">EDITED BY</TableCell>
              <TableCell align="center">LAST EDITED</TableCell>
              <TableCell align="center">STATUS</TableCell>
              <TableCell align="center">ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticles.map((article, index) => (
              <TableRow key={article.id}>
                <TableCell component="th" scope="article">
                  {index + 1}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body1"
                    color={blue[400]}
                    component={Link}
                    href={`/article/${article.id}`}
                  >
                    {article.title}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {
                    categories.find(
                      (category) => category.id === article.categoryId
                    )?.name
                  }
                </TableCell>
                <TableCell align="center">{article.publishedBy}</TableCell>
                <TableCell align="center">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  {article.updatedBy === "" ? "-" : article.updatedBy}
                </TableCell>
                <TableCell align="center">
                  {article.updatedAt
                    ? new Date(article.updatedAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor:
                      getStatus(article) === "Published"
                        ? "steelblue"
                        : getStatus(article) === "Expired"
                        ? "crimson"
                        : "orange",
                    color: "white",
                  }}
                >
                  {getStatus(article)}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
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
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
