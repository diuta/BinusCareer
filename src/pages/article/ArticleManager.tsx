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
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import React, { useEffect, useState } from "react";
import { IArticle, ICategory } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { blue, grey } from "@mui/material/colors";
import { fontWeight } from "@mui/system";
import PageWrapper from "../../components/container/PageWrapper";

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

  const handleSearch = () => {
    let result = [...articles];

    if (searchTerm.trim() !== "") {
      result = result.filter(
        (article) =>
          article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categories
            .find((category) => category.id === article.categoryId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          article.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getArticles = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.articles}`
    );
    setArticles(response.data);
    setFilteredArticles(response.data);
  };

  const getCategories = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.categories}`
    );
    setCategories(response.data);
  };

  const handleEdit = (articleId: string | number) => {
    navigate(`/article/${articleId}/edit`);
  };

  const handleDelete = async (articleId: string | number) => {
    try {
      await apiClient.delete(`${ApiService.articles}/${articleId}`);
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

  const StyledTableCell = styled(TableCell)(() => ({
    fontSize: 11,
  }));

  return (
    <PageWrapper>
      <Stack direction="column" spacing={2} sx={{ mb: 3, borderBottom: "1px solid lightgrey", paddingBottom: 2 }}>
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
        <Box sx={{display : "flex", justifyContent: "space-between"}}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineRoundedIcon />}
            sx={{
              width: "15vh",
            }}
            component={Link}
            href="/article/add"
          >
            Add
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: "15vh",
            }}
            onClick={() => handleSearch()}
          >
            Apply
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
              <StyledTableCell align="center">NO.</StyledTableCell>
              <StyledTableCell align="center">ARTICLE NAME</StyledTableCell>
              <StyledTableCell align="center">ARTICLE CATEGORY</StyledTableCell>
              <StyledTableCell align="center">CREATED DATE</StyledTableCell>
              <StyledTableCell align="center">CREATED BY</StyledTableCell>
              <StyledTableCell align="center">PUBLISHED DATE</StyledTableCell>
              <StyledTableCell align="center">EXPIRED DATE</StyledTableCell>
              <StyledTableCell align="center">LAST EDITED</StyledTableCell>
              <StyledTableCell align="center">EDITED BY</StyledTableCell>
              <StyledTableCell align="center">TOTAL VIEWS</StyledTableCell>
              <StyledTableCell align="center">STATUS</StyledTableCell>
              <StyledTableCell align="center">ACTION</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticles.map((article, index) => (
              <TableRow key={article.id}>
                <StyledTableCell component="th" scope="article">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography
                    variant="body1"
                    color={blue[400]}
                    component={Link}
                    href={`/article/${article.id}`}
                    fontSize={10}
                  >
                    {article.title}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {
                    categories.find(
                      (category) => category.id === article.categoryId
                    )?.name
                  }
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(article.createdDate).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center">{article.createdBy}</StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(article.postedDate).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(article.expiredDate).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {article.updatedAt
                    ? new Date(article.updatedAt).toLocaleDateString()
                    : "-"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {article.updatedBy === "" ? "-" : article.updatedBy}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {article.totalViews}
                </StyledTableCell>
                <StyledTableCell
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
                </StyledTableCell>
                <StyledTableCell align="center">
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
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageWrapper>
  );
}
