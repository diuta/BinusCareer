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
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import { ICategory } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { blue, grey } from "@mui/material/colors";
import { fontSize, fontWeight } from "@mui/system";

export default function CategoryManager() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
  }, []);

  const handleSearch = () => {
    let result = [...categories];

    if (searchTerm.trim() !== "") {
      result = result.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "id") {
      result.sort((a, b) => a.id - b.id);
    }

    setFilteredCategories(result);
  };

  const getCategories = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.categories}`
    );
    setCategories(response.data);
    setFilteredCategories(response.data);
  };

  const handleEdit = (categoryId: string | number) => {
    navigate(`/category/${categoryId}/edit`);
  };

  const handleDelete = async (categoryId: string | number) => {
    try {
      await apiClient.delete(`${ApiService.categories}/${categoryId}`);
      getCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  return (
    <PageWrapper>
      <Stack
        direction="column"
        spacing={2}
        sx={{ mb: 3, borderBottom: "1px solid lightgrey", paddingBottom: 2 }}
      >
        <InputLabel id="search-label">Search</InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
        />
        <InputLabel id="sort-select-label">Sort By</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sortBy}
          label="Sort By"
          onChange={handleSortChange}
        >
          <MenuItem value="name">Category Name</MenuItem>
          <MenuItem value="id">Category ID</MenuItem>
        </Select>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineRoundedIcon />}
            sx={{
              width: "15vh",
            }}
            component={Link}
            href="/category/add"
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
              <TableCell align="left">ID.</TableCell>
              <TableCell align="left">CATEGORY NAME</TableCell>
              <TableCell align="right">ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell component="th" scope="category">
                  {category.id}
                </TableCell>
                <TableCell align="left">
                  <Typography
                    variant="body1"
                    color={blue[400]}
                    component={Link}
                    href={`/category/${category.id}`}
                  >
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      endIcon={<EditNoteIcon />}
                      sx={{
                        width: 3,
                        borderRadius: 0,
                        pl: 1,
                        color: "#2196f3",
                        border: "1px solid #2196f3",
                      }}
                      onClick={() => handleEdit(category.id)}
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
                      onClick={() => handleDelete(category.id)}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageWrapper>
  );
}
