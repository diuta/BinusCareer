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
import PageWrapper from "../../components/container/PageWrapper";
import { ICarousel, ICategory } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { blue, grey } from "@mui/material/colors";
import { fontSize, fontWeight } from "@mui/system";

export default function CarouselManager() {
  const [carousels, setCarousels] = useState<ICarousel[]>([]);
  const [filteredCarousels, setFilteredCarousels] = useState<ICarousel[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySelected, setCategorySelected] = useState("All");
  const [statusSelected, setStatusSelected] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    getCarousels();
    getCategories();
  }, []);

  useEffect(() => {
    let result = [...carousels];

    if (searchTerm.trim() !== "") {
      result = result.filter(
        (carousel) =>
          carousel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categories
            .find((category) => category.id === carousel.categoryId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          carousel.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categorySelected && categorySelected !== "All") {
      result = result.filter((carousel) =>
        categories
          .find((category) => category.id === carousel.categoryId)
          ?.name.toLowerCase()
          .includes(categorySelected.toLowerCase())
      );
    }

    if (statusSelected && statusSelected !== "All") {
      result = result.filter((carousel) =>
        getStatus(carousel).toLowerCase().includes(statusSelected.toLowerCase())
      );
    }

    setFilteredCarousels(result);
  }, [carousels, searchTerm, categorySelected, statusSelected]);

  const getCarousels = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.carousels}`
    );
    setCarousels(response.data);
    setFilteredCarousels(response.data);
  };

  const getCategories = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.categories}`
    );
    setCategories(response.data);
  };

  const getStatus = (carousel: ICarousel) => {
    const currentDate = new Date();
    const postedDate = new Date(carousel.postedDate);
    const expiredDate = new Date(carousel.expiredDate);
    if (expiredDate < currentDate) {
      return "Expired";
    }
    if (postedDate > currentDate) {
      return "Pending";
    }
    return "Published";
  };

  const handleEdit = (carouselId: string | number) => {
    navigate(`/carousel/${carouselId}/edit`);
  };

  const handleDelete = async (carouselId: string | number) => {
    await apiClient.delete(`${ApiService.carousels}/${carouselId}`);
    getCarousels();
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
    <Paper elevation={5} sx={{ padding: 5 }}>
      <Typography
        variant="h3"
        className="text-center"
        sx={{ mb: 3, color: "#2196f3" }}
      >
        CAROUSEL LIST
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
          sx={{ justifyContent: "space-between", width: "100%" }}
          spacing={2}
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
            href="/carousel/add"
          >
            Add Carousel
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
              <StyledTableCell align="center">CAROUSEL NAME</StyledTableCell>
              <StyledTableCell align="center">CAROUSEL CATEGORY</StyledTableCell>
              <StyledTableCell align="center">CREATED DATE</StyledTableCell>
              <StyledTableCell align="center">CREATED BY</StyledTableCell>
              <StyledTableCell align="center">PUBLISHED DATE</StyledTableCell>
              <StyledTableCell align="center">EXPIRED DATE</StyledTableCell>
              <StyledTableCell align="center">LAST EDITED</StyledTableCell>
              <StyledTableCell align="center">EDITED BY</StyledTableCell>
              <StyledTableCell align="center">VIEWERS</StyledTableCell>
              <StyledTableCell align="center">STATUS</StyledTableCell>
              <StyledTableCell align="center">ACTION</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCarousels.map((carousel, index) => (
              <TableRow key={carousel.id}>
                <StyledTableCell component="th" scope="carousel">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="body1" color={blue[400]}>
                    {carousel.title}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {categories.find((c) => c.id === carousel.categoryId)?.name ||
                    "-"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(carousel.createdDate).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center">{carousel.createdBy}</StyledTableCell>
                <StyledTableCell align="center">{new Date(carousel.postedDate).toLocaleDateString()}</StyledTableCell>
                <StyledTableCell align="center">{new Date(carousel.expiredDate).toLocaleDateString()}</StyledTableCell>
                <StyledTableCell align="center">
                  {carousel.updatedAt
                    ? new Date(carousel.updatedAt).toLocaleDateString()
                    : "-"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {carousel.updatedBy === "" ? "-" : carousel.updatedBy}
                </StyledTableCell>
                <StyledTableCell align="center">
                  viewers has not been implemented
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{
                    backgroundColor:
                      getStatus(carousel) === "Published"
                        ? "steelblue"
                        : getStatus(carousel) === "Expired"
                        ? "crimson"
                        : "orange",
                    color: "white",
                  }}
                >
                  {getStatus(carousel)}
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
                      onClick={() => handleEdit(carousel.id)}
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
                      onClick={() => handleDelete(carousel.id)}
                    />
                  </Stack>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
