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
import { ICarousel } from "./interface/Interface";
import { ApiService } from "../../constants/ApiService.Dev";
import apiClient from "../../config/api-client";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { blue, grey } from "@mui/material/colors";
import { fontSize, fontWeight } from "@mui/system";

export default function CarouselManager() {
  const [carousels, setCarousels] = useState<ICarousel[]>([]);
  const [filteredCarousels, setFilteredCarousels] = useState<ICarousel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    getCarousels();
  }, []);

  useEffect(() => {
    let result = [...carousels];

    if (searchTerm.trim() !== "") {
      result = result.filter((carousel) =>
        carousel.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredCarousels(result);
  }, [carousels, searchTerm, sortBy]);

  const getCarousels = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.getCarousels}`
    );
    setCarousels(response.data);
    setFilteredCarousels(response.data);
  };

  const handleEdit = (carouselId: string | number) => {
    navigate(`/edit-carousel/${carouselId}`);
  };

  const handleDelete = async (carouselId: string | number) => {
    try {
      await apiClient.delete(`${ApiService.getCarousels}/${carouselId}`);
      getCarousels();
    } catch (error) {
      console.error("Error deleting carousel:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      fontSize: 15,
      color: grey[700],
      fontWeight: 700,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    },
  }));

  return (
    <Paper elevation={5} sx={{ padding: 5 }}>
      <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Search by carousel name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
        />
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="name">Carousel Name</MenuItem>
            <MenuItem value="date">Date Posted</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper} elevation={0}>
        <Table aria-label="simple table">
          <TableHead
            sx={{
              bgcolor: grey[300],
            }}
          >
            <TableRow>
              <StyledTableCell align="right">NO.</StyledTableCell>
              <StyledTableCell align="right">CAROUSEL NAME</StyledTableCell>
              <StyledTableCell align="right">CAROUSEL CATEGORY</StyledTableCell>
              <StyledTableCell align="right">PUBLISHED BY</StyledTableCell>
              <StyledTableCell align="right">DATE PUBLISHED</StyledTableCell>
              <StyledTableCell align="right">EDITED BY</StyledTableCell>
              <StyledTableCell align="right">LAST EDITED</StyledTableCell>
              <StyledTableCell align="right">STATUS</StyledTableCell>
              <StyledTableCell align="right">ACTION</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCarousels.map((carousel, index) => (
              <TableRow key={carousel.id}>
                <TableCell component="th" scope="carousel">
                  {index + 1}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body1"
                    color={blue[400]}
                    component={Link}
                    href={`/carousel/${carousel.id}`}
                  >
                    {carousel.title}
                  </Typography>
                </TableCell>
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
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={10} align="center">
                <Link href="/add-carousel">ADD CAROUSEL</Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
